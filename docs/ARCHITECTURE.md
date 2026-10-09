# Architecture

## How the source becomes a game

The game began as one HTML file with one inline script. That script is now split by system into `src/js/`, but it is still **classic script code that shares one scope**: the build concatenates the files in the order listed in `src/js/manifest.json`, wraps them in the manifest's `prefix` and `suffix` (a strict-mode function that runs immediately), and either inlines the result (`dist/single/`) or writes it to `js/game.js` (`dist/web/`).

Consequences:

- Any file can use anything declared in any other file, but **top-level code runs in manifest order**. Moving a file earlier can break code that runs at load time (function declarations are hoisted across the whole bundle; `const` and `let` are not).
- There are no imports or exports yet. Moving to ES modules is planned for after M2 (D-022), one system at a time with tests passing after each step: see `docs/ES_MODULES_PLAN.md`.
- three.js **r128** (npm `three@0.128.0`) is the only library. The template loads it from the cdnjs CDN; the single-file build keeps that tag. The game-folder build swaps the tag for `vendor/three.min.js`, a committed, byte-identical copy, so `dist/web` runs offline (see `vendor/README.md`). The web build copies `vendor/` and `assets/` automatically.

## Modules, in bundle order

| File | Contents |
|---|---|
| `src/js/core/config.js` | Grid size, sea level, keys, settings and save data |
| `src/js/core/noise.js` | Seeded random numbers, hashing and fractal noise |
| `src/js/core/names.js` | Names per people (dwarf first, others drafts) and the Tolkien-name blocklist |
| `src/js/blocks/blocks.js` | Block ids, block definitions, hardness and sounds |
| `src/js/blocks/items.js` | Items that are not blocks: fuel, ores, ingots; the tool ladder (`TOOL_LADDER`, tools as `{tool, tier, speed, dur}`), gear and their icons |
| `src/js/blocks/atlas.js` | Texture atlas painted pixel by pixel, average tile colours |
| `src/js/world/terrain.js` | World arrays, column terrain and biomes (ranges, river valleys, blended borders), lakes |
| `src/js/world/caves.js` | Cave systems (D-028): plans per region (trunks, branches, loops, chambers, descents, links, gorges, lava falls, stream pools), carving, cave anchors, lakes |
| `src/js/world/deep-caves.js` | The Fire Below: the lava sea with islands and flared pillars |
| `src/js/world/underground-sites.js` | Mineshafts, supply crates, points of interest (each opening onto a cave), dripstone |
| `src/js/world/remains.js` | Remains of other peoples in the deep: goblin warrens, gnome workshops, drow halls, nameless ruins |
| `src/js/ruins/city-plan.js` | Holds (one per region, D-023) and their city: districts, street plan, decay level, room shapes, shells, openings, decay passes |
| `src/js/ruins/holds-and-lore.js` | Holds, hold names, lore pages, chasms, cellars, room conditions |
| `src/js/ruins/pillared-deep.js` | The pillared hall, heavy decay, tidy pass, connectivity rules, applyRuins |
| `src/js/ruins/rooms.js` | Single-chunk room types |
| `src/js/ruins/megastructures.js` | Two-by-two chunk great structures |
| `src/js/world/cave-life.js` | Cave regions and their decoration |
| `src/js/world/features.js` | Chunk clipping, trees, barrows, standing stones, willows, ice spikes, ruined stairways, dungeon rooms, surface claims |
| `src/js/world/surface-sites.js` | Ruined watchtowers, keeps and castles, old roads between them and to hold gates, ancient waystones |
| `src/js/world/chunk-generation.js` | Per-chunk features, ores, plants, the underground water drain and the genChunk pipeline |
| `src/js/engine/lighting.js` | Block light and sideways sky light flood fills, relighting after edits |
| `src/js/engine/renderer.js` | three.js setup, sun, clouds, shadow, selection, mesh buffers |
| `src/js/engine/entities.js` | Entity registry: moving things register once; shifted with the window, cleared on rebuild, updated while playing |
| `src/js/world/mines.js` | Dwarven mines: galleries, inclines, junctions, great pits, descents |
| `src/js/engine/chunk-mesher.js` | Underground naming, mesh band and chunk meshing |
| `src/js/engine/editing-and-physics.js` | Block editing, water flow, falling blocks, waypoint beams |
| `src/js/engine/audio.js` | Synthesized sound and haptics |
| `src/js/input/actions.js` | Input actions: named actions with keyboard, controller and touch bindings (settings.binds overrides the defaults) |
| `src/js/input/gamepad.js` | Controller support through the Gamepad API |
| `src/js/engine/particles.js` | Particles and explosives |
| `src/js/gameplay/player-and-input.js` | Player physics, held item, keyboard and mouse |
| `src/js/gameplay/mining.js` | Survival mining: hold-to-break timing by tool and material (`toolFits`), pickaxe tiers, drops, the sickle's sweep |
| `src/js/gameplay/crafting.js` | Recipes, crafting, and the BANNED set (defined but out of play) |
| `src/js/gameplay/blueprints.js` | Blueprint capture and placement |
| `src/js/gameplay/survival.js` | Health, hunger, air, damage, death, graves, the survival HUD; climbing gear (rope, grapnel, `onClimb`), signal flares |
| `src/js/input/touch.js` | Touch controls |
| `src/js/ui/menus.js` | Hotbar, block menu, overlay and settings |
| `src/js/ui/save-and-minimap.js` | Saving, worlds (create, switch, delete, export, import) and the minimap |
| `src/js/engine/world-streaming.js` | Initial generation, rebuild on travel, sliding window streaming |
| `src/js/gameplay/sky-weather-farming.js` | Day and night, weather, grass spread, farming |
| `src/js/core/main-loop.js` | Main loop |

Removed in M1 (0.3.0) for the setting: the town and road generator, the power network and power tools, trading counters and mints, ore processing and rails (D-021). Coins stay defined but out of play through the `BANNED` set in `gameplay/crafting.js`, which filters recipes, loot tables and the creative menu; `tests/cases/10-content-tables.test.js` fails if any removed kind of block or item returns.

## World coordinates and the loaded window

- The world is endless horizontally. A window of `W` x `D` = 224 x 224 columns (14 x 14 chunks of 16) and `H` = 512 blocks (sea level 310, D-023) is kept in memory around the player.
- World coordinates are `X, Y, Z`. Window coordinates are `x = X - OX`, `z = Z - OZ`. World chunk coordinates are `WCX, WCZ`; window chunk indexes are `cx, cz`.
- `world` (block ids), `lvl` (water level), `BLK` (block light) are flat typed arrays indexed by `I(x, y, z)`. Per-column arrays include `ground`, `hm`, `biome`.
- Moving more than a chunk from the centre slides the window (`shiftWindow`) and queues the new strip of chunks (`genQ`). `processGenQ` works on one chunk at a time (`genJob`): its generation steps (`GEN_STEPS`), then its light, then its map tile, within a per-frame budget (D-025). Travel (`regenerateAll`) makes the 3 x 3 chunks around the arrival at once and streams the rest.

## Generation rules (keep these true)

1. **Determinism.** Everything generated is a pure function of the seed and world coordinates. Never use `Math.random()` in generation; use `hsh`, `rngAt`, `fbm2` and friends. Two chunks that look at the same structure must compute the same structure.
2. **Chunk-local writes.** Generation writes through `PW(X, Y, Z, id, mode)`, which silently clips to the chunk being generated (`gx0`, `gz0`). Structures that span chunks are recomputed from their anchor by each chunk they touch. `GW` reads only inside the current chunk.
3. **Random-stream invariants.** When a generator skips work for chunks it cannot reach, it must still draw the same number of random values (see `veinP`), or every later structure from that stream shifts.
4. **Write modes.** `MODE_SET` overwrites, `MODE_AIR` writes only into air, `MODE_STONE` replaces only stone and deepstone, `MODE_FILL` fills.

## Chunk generation pipeline (`genChunk`)

`genChunk` runs every step of `GEN_STEPS` at once; streaming runs them a few per frame. The order is the same either way:

Column fill (terrain, soil, water, deepstone) -> `lavaSea` (the Fire Below) -> cave plans of the regions around (`caveBase`, one region per step) -> `carveCaves` in four parts (passages and chambers; the last part fills lakes, stream pools and lava falls) -> `caveFormations` (stalagmites, stalactites, columns) -> `applyShafts` (mineshafts) -> `applyPOIs` (camps, cellars, old ruins, each with a passage to its cave) -> `applyRemains` (other peoples' remains) -> `applyMines` (dwarven mines) -> `applyRuins` (the hold's city, ending with the tidy pass; both with `genLit` set in inhabited holds) -> `features` for the 3 x 3 surrounding chunks (ores, pockets, boulders, barrows, stone rings, trees, ruined stairways, dungeon rooms) -> `applySites` (ruined surface sites and waystones) -> hold gates (last, so nothing cuts their stair) -> `drainCaveWater` -> `plants` -> `applyRoads` -> saved player edits (water next to them is queued to flow again).

## Lighting

- Sky light is the larger of two values: the per-column height map (full above the column's roof, fading below it) and `SKL`, a flood fill from every open cell above its roof into covered cells, so it spreads sideways into overhangs and cave mouths (D-027). Block light (`BLK`) is a flood fill from emitting blocks. Both use the same queue and `propagate`.
- Neither light enters chunks that are not generated yet (`genDone`). Because of that, lighting a newly streamed chunk with `lightChunk` gives exactly the same result as relighting the whole window. The lighting tests check this for both stores, also after edits, and it must stay exact.
- Edits relight a box (`lbox`, `relight`) 15 blocks around them; when a column's roof moves, the box also covers the cells between the old and new roof.

## Meshing and rendering

- Each chunk builds an opaque and a water mesh with smooth light and ambient occlusion. Chunks wait for all their neighbours to exist before meshing, so each is built once.
- Only a vertical band around the player is meshed (`MB`, `meshBand`). Above ground (`MB.surf`) it reaches the top of the world, and each chunk stops `MESH_DEEP` blocks under the lowest sky-exposed ground in and around it (`meshFloor`), with a dark quad there; underground the band follows the cave fog setting. Changing band or mode rebuilds the chunks, nearest first, within a per-frame budget.
- Chunks beyond the fog are hidden. The painted atlas is copied to the GPU with each tile in a 32-pixel cell with 8 pixels of repeated edge, so mipmaps do not bleed between tiles (D-027).
- The chunk shader animates water (shimmer, glints), the lava sea (rolling crests) and plant tops (sway), and lets light-giving blocks show through fog. Clouds are a mesh of flat boxes placed by world position (`placeClouds`); the moon shows the phase of the day counter. Sky, sun, moon, stars and clouds are hidden well underground.

## Saves

- Worlds (D-021): an index under `SAVE_KEY` (currently `fantasy-blockcraft-save-v4`), `{active, list:[{id,name,seed,mode,created,played}]}`, and each world's data under `SAVE_KEY+':'+id` (`{v:4, seed, e, spawn, p, hot, mode, inv, hp, food, gv, t}`). Older keys are deleted on load. Settings are under `blockcraft-settings-v1` and blueprints under `blockcraft-blueprints`, shared by all worlds.
- `createWorld`, `switchWorld` (saves, then reloads into the other world), `deleteWorld`, `exportWorld` and `importWorld` live in `ui/save-and-minimap.js`; the pause menu lists the worlds. An exported file is `{format:'fantasy-blockcraft-world', saveKey, world, data}` and only loads under the same `SAVE_KEY`.
- **Player changes only.** Automatic systems (`flowStep`, `randomTicks`) set `autoEdit`; their changes are recorded only where the player already changed that block, so crops keep their growth while natural water flow, grass spread and snow never grow the save.
- A save stores the seed and the player's block edits by world coordinate. Edits are keyed by `wkey(X,y,Z)`: X and Z in 21 bits each and y in 9 bits (heights 0 to 511), decoded by `keyXYZ`; `tests/cases/11-saves.test.js` round-trips them. Saves always yield to updates: bump `SAVE_KEY` on any generation or save-format change (D-019).
- Per-block state lives in sets of window indexes that `shiftWindow` moves and `regenerateAll` clears: `torches` and `farms` (farmland, so crops grow anywhere lit). `genChunk` and `setBlock` keep them current.

## Entities, input and equipment (M1b)

- **Entities** (`engine/entities.js`): every kind of moving thing registers once with `entityKind({name, list, update?, persist?, shift?, clear?})`. `shiftWindow` calls `shiftEntities`, `regenerateAll` calls `clearEntities` (persistent kinds such as waypoint beams and rain follow the new origin), and the main loop calls `updateEntities` only while playing. Positions are window coordinates, like all physics; `entityWorld(e)` gives world coordinates. New creatures (E1) register the same way.
- **Input** (`input/actions.js`): `ACTIONS` names every discrete action; `BINDS.keys` (KeyboardEvent codes), `BINDS.pad` (standard-mapping button numbers) and `BINDS.held` (movement, jump, sprint keys) map inputs to them, from `BIND_DEFAULTS` overridden by `settings.binds` (`loadBinds`). Keyboard, controller and touch dispatch through `runAction`; movement reads `keyHeld`. Sticks, triggers, the mouse and menu navigation stay in their own code.
- **Equipment** (`gameplay/player-and-input.js`): `equip.belt`, `equip.pack`, `equip.bag`. An item fits the slot named by `ITEMS[id].equip`; `equipFrom(i)` and `unequip(slot)` move items; equipment is saved as `eq` and goes to the grave on death. The inventory shows the slots once any item has an `equip` slot.

## Holds, the deep and cold lights (M2a)

- **Holds** (`ruins/city-plan.js`, D-023): `holdAt(rx,rz)` gives the one hold of a region of `HOLD_REG` x `HOLD_REG` chunks (centre, radius, `inhabited`); `holdNear(cx,cz)` asks a chunk's own region, which is enough because a hold and its mines never reach the region edge. `holdReach(h,cx,cz)` is the distance from the centre in units of the hold's ragged radius: `ruinZone` is `holdReach < 1`, `mineZone` is under 1.15 and patchy out to 1.9. Inside a hold the old city plan applies unchanged (8 x 8-chunk quarters with avenues to a plaza, rooms, great structures, decay, connectivity rules). `holdOf` gives one name and history per hold.
- **The Fire Below** (`world/deep-caves.js`): `lavaSea` runs over the chunk's own columns after the column fill. The lava sea (`FIRE_LV`, lava y3 to y8) is open under most columns under a roof 5 to 16 above it (`seaCeil`), with smooth islands (`seaIsle`) and pillars on a jittered 28-block grid that flare at both ends.
- **Cave systems** (`world/caves.js`, D-028): each region of `CR` x `CR` chunks (10, 160 blocks) has a plan, `caveBase(rx,rz)`, a pure function of the region: up to three systems, each a trunk of nodes from an entrance (a mouth at the foot of a slope or a sinkhole, `B.ents`) down through ramps, steep passages and spirals, with branches, loops back into the trunk, shafts and chambers (`B.ch`: domed halls with pillars, rifts with ledges, stepped halls with a lake). Passages are curved paths of capsules (`cavePath`); `caveCheckPath` keeps every new path three blocks of rock away from all others and from chambers, except where they share a node, and keeps the deep parts out of holds and their mines (`caveHoldFree`). The main system's deepest hall can get a gorge down to the lava sea (`caveGorge`) and a causeway to an island (`caveToFire`). `cavePlan(rx,rz)` adds links between neighbouring regions' deepest halls (`caveLink`) and into a nearby hold's upper mine gallery (`caveHoldLink`), lava falls (`caveFall`) and stream pools, and indexes everything by chunk. A chunk carves the elements of the 3 x 3 regions around it that reach it (`caveEls`).
- **Planned water and lava:** stepped-hall lakes and stream pools are shaped so rock holds them on every side; `plannedWater` lets the drain pass trust them at a chunk edge, and `plannedLava` marks the open face of a lava fall. A lake or pool is left dry where its own passages run low beside it, a gorge cuts its hall, a ravine reaches it, or a place built later reaches into it (`placesTouch`), so neighbouring chunks always agree.
- **Cold lights:** `PW` writes `COLD_OF[id]` (cold lantern, sconce, torch, dim glowstone) in place of a lit lamp unless `genLit` is set; `genChunk` sets it around `applyMines` and `applyRuins` in inhabited holds. Generation that needs a lit lamp in an abandoned place must use another emitter (runes, crystals, fungi).

## The surface (M3.5b, D-031)

- **Terrain** stays a pure function per column (`colInfoBase`). Mountains add a ridged field (`1-|fbm2|` cubed, scale 230) with saddles from a slower field, and peaks only where the ridge is high. Rivers come from the same river noise as before, but their effect grows with the land around them: the valley half-width (in noise units) is `rw + relief*0.0075`, capped, and rivers fade out where the land is high or mountainous (`on`). The land a column belongs to (`o.b`) is chosen against `0.5 + fbm2(X/16)*0.4`, so borders mix in patches.
- **Barrows and rings** come from `barrowAt(WCX,WCZ)` (`world/features.js`): the highest of three spots in the chunk, on the Barrow Hills only, with a higher chance inside burial-ground zones and beside old roads; facing, size, length and a broken roof come from hashes of the chunk.
- **Sites** (`siteAt`) score up to 14 level candidates: towers and castles by how far they rise over a ring of land 36 blocks out, keeps by a river within 40 blocks; a hollow is never chosen. `buildSite` fills under the floor with earth and banks it down one block per block to the land.
- **Trees** multiply their density by a grove field (`fbm2(X/70)`), a valley bonus and a steep-slope penalty.

## Ways down, places and the surface (M2b)

- **`caveAnchor(WCX,WCZ,y0,y1,salt)`** (`world/caves.js`) picks a point in a passage of a cave system inside the chunk's middle, standing on the passage's real floor (`edgeFloor`), outside chambers. Ruined stairways, dungeon rooms and built points of interest open onto one, so they are always connected.
- **Claims on the surface:** `surfTaken(X,Z,m)` (`world/features.js`) is true near a gate terrace, ruined stairway, site, old road or cave entrance (`caveMouthNear`); trees, boulders, barrows and old towers keep off it.
- **Remains** (`world/remains.js`) and **sites** (`world/surface-sites.js`) are planned per region (`remainsAt`, `siteAt`) and rebuilt by every chunk they touch. Remains stand in the great hall a cave plan marks for them (`rem`), one region in about three.
- **Roads:** `roadSegs` lists the segments that may touch a chunk (site to two nearest sites, gate to nearest site), and `oldRoadAt` tests a column against them with a wander that fades at both ends; `applyRoads` lays them on the chunk's own columns.
- **Underground water and lava** must stay in sound rock (D-024, Q87): `drainCaveWater` runs after everything else that writes underground and drains water, and lava outside holds, their mines and the sea, that breaks the rule (planned lakes, pools and lava-fall faces excepted at chunk edges, above).

