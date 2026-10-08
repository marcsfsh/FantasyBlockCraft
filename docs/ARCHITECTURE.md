# Architecture

## How the source becomes a game

The game began as one HTML file with one inline script. That script is now split by system into `src/js/`, but it is still **classic script code that shares one scope**: the build concatenates the files in the order listed in `src/js/manifest.json`, wraps them in the manifest's `prefix` and `suffix` (a strict-mode function that runs immediately), and either inlines the result (`dist/single/`) or writes it to `js/game.js` (`dist/web/`).

Consequences:

- Any file can use anything declared in any other file, but **top-level code runs in manifest order**. Moving a file earlier can break code that runs at load time (function declarations are hoisted across the whole bundle; `const` and `let` are not).
- There are no imports or exports yet. Moving to ES modules is a planned refactor, best done one system at a time with tests passing after each step: see `docs/ES_MODULES_PLAN.md` and `docs/ROADMAP.md`.
- three.js **r128** (npm `three@0.128.0`) is the only library. The template loads it from the cdnjs CDN; the single-file build keeps that tag. The game-folder build swaps the tag for `vendor/three.min.js`, a committed, byte-identical copy, so `dist/web` runs offline (see `vendor/README.md`). The web build copies `vendor/` and `assets/` automatically.

## Modules, in bundle order

| File | Contents |
|---|---|
| `src/js/core/config.js` | Grid size, sea level, keys, settings and save data |
| `src/js/core/noise.js` | Seeded random numbers, hashing and fractal noise |
| `src/js/blocks/blocks.js` | Block ids, block definitions, hardness and sounds |
| `src/js/blocks/items.js` | Items that are not blocks: fuel, ores, ingots, tools |
| `src/js/blocks/atlas.js` | Texture atlas painted pixel by pixel, average tile colours |
| `src/js/world/terrain.js` | World arrays, column terrain and biomes, lakes, town blending |
| `src/js/world/caves.js` | Layered worm caves, caverns, sinkholes, flooding, cave lakes |
| `src/js/world/underground-sites.js` | Mineshafts, supply crates, points of interest, dripstone and springs |
| `src/js/ruins/city-plan.js` | Dwarven city: districts, street plan, decay level, room shapes, shells, openings, decay passes |
| `src/js/ruins/holds-and-lore.js` | Holds, names, lore pages, gates, chasms, cellars, room conditions |
| `src/js/ruins/pillared-deep.js` | The pillared hall, heavy decay, tidy pass, connectivity rules, applyRuins |
| `src/js/ruins/rooms.js` | Single-chunk room types |
| `src/js/ruins/megastructures.js` | Two-by-two chunk great structures |
| `src/js/world/cave-life.js` | Cave regions and their decoration |
| `src/js/world/features.js` | Chunk clipping, column fill, trees, barrows, standing stones, willows |
| `src/js/legacy/towns.js` | Towns (disabled: townPlan returns null) |
| `src/js/legacy/roads.js` | Roads between towns (disabled) |
| `src/js/world/chunk-generation.js` | Per-chunk features, ores, plants and genChunk pipeline |
| `src/js/engine/lighting.js` | Block light flood fill and sky light |
| `src/js/engine/renderer.js` | three.js setup, sun, clouds, shadow, selection, mesh buffers |
| `src/js/world/mines.js` | Dwarven mines: galleries, inclines, junctions, great pits, descents |
| `src/js/engine/chunk-mesher.js` | Underground naming, mesh band and chunk meshing |
| `src/js/engine/editing-and-physics.js` | Block editing, water flow, falling blocks, waypoint beams |
| `src/js/engine/audio.js` | Synthesized sound and haptics |
| `src/js/input/gamepad.js` | Controller support through the Gamepad API |
| `src/js/engine/particles.js` | Particles and explosives |
| `src/js/gameplay/player-and-input.js` | Player physics, held item, keyboard and mouse |
| `src/js/legacy/power-tools.js` | Power tools (removed from play by the BANNED list) |
| `src/js/gameplay/crafting.js` | Recipes and crafting |
| `src/js/legacy/power-network.js` | Power network (removed from play by the BANNED list) |
| `src/js/gameplay/trading.js` | Banned-item filter, values, coins and trading counters |
| `src/js/gameplay/ore-processing.js` | Gold pan, sluices and crusher |
| `src/js/gameplay/blueprints.js` | Blueprint capture and placement |
| `src/js/gameplay/survival.js` | Health, hunger, air, damage, death, graves and the survival HUD |
| `src/js/input/touch.js` | Touch controls |
| `src/js/ui/menus.js` | Hotbar, block menu, overlay and settings |
| `src/js/ui/save-and-minimap.js` | Saving and the minimap |
| `src/js/engine/world-streaming.js` | Initial generation, rebuild on travel, sliding window streaming |
| `src/js/gameplay/sky-weather-farming.js` | Day and night, weather, grass spread, farming |
| `src/js/core/main-loop.js` | Main loop |

`legacy/` holds systems that are switched off for the fantasy setting: towns (`townPlan` returns `null`), roads (`roadAt` returns `false`), power tools and the power network (removed from play through the `BANNED` set in `gameplay/trading.js`). They are candidates for deletion once nothing references them.

## World coordinates and the loaded window

- The world is endless horizontally. A window of `W` x `D` = 224 x 224 columns (14 x 14 chunks of 16) and `H` = 384 blocks is kept in memory around the player.
- World coordinates are `X, Y, Z`. Window coordinates are `x = X - OX`, `z = Z - OZ`. World chunk coordinates are `WCX, WCZ`; window chunk indexes are `cx, cz`.
- `world` (block ids), `lvl` (water level), `BLK` (block light) are flat typed arrays indexed by `I(x, y, z)`. Per-column arrays include `ground`, `hm`, `biome`.
- Moving more than a chunk from the centre slides the window (`shiftWindow`) and queues the new strip of chunks (`genQ`), which `processGenQ` generates a few milliseconds per frame.

## Generation rules (keep these true)

1. **Determinism.** Everything generated is a pure function of the seed and world coordinates. Never use `Math.random()` in generation; use `hsh`, `rngAt`, `fbm2` and friends. Two chunks that look at the same structure must compute the same structure.
2. **Chunk-local writes.** Generation writes through `PW(X, Y, Z, id, mode)`, which silently clips to the chunk being generated (`gx0`, `gz0`). Structures that span chunks are recomputed from their anchor by each chunk they touch. `GW` reads only inside the current chunk.
3. **Random-stream invariants.** When a generator skips work for chunks it cannot reach, it must still draw the same number of random values (see `veinP`), or every later structure from that stream shifts.
4. **Write modes.** `MODE_SET` overwrites, `MODE_AIR` writes only into air, `MODE_STONE` replaces only stone and deepstone, `MODE_FILL` fills.

## Chunk generation pipeline (`genChunk`)

Column fill (terrain, soil, water, deepstone) -> `applyWorms` (layered caves, caverns, flooding) -> `applyShafts` (mineshafts) -> `applyPOIs` (camps, cellars, old ruins) -> `applyMines` (dwarven mines) -> `applyRuins` (dwarven city, ending with the tidy pass) -> `features` for the 3 x 3 surrounding chunks (ores, pockets, boulders, barrows, stone rings, trees) -> towns and roads (disabled) -> `plants` -> saved player edits.

## Lighting

- Sky light comes from the per-column height map; block light (`BLK`) is a flood fill from emitting blocks.
- Block light never enters chunks that are not generated yet (`genDone`). Because of that, lighting a newly streamed chunk with `lightChunk` gives exactly the same result as relighting the whole window. The lighting test checks this and it must stay exact.

## Meshing and rendering

- Each chunk builds an opaque and a water mesh with smooth light and ambient occlusion. Chunks wait for all their neighbours to exist before meshing, so each is built once.
- Only a vertical band of about 120 blocks above and below the player is meshed (`MB`, `meshBand`). Moving far up or down rebuilds the band.
- Chunks beyond the fog are hidden; the texture atlas is a power-of-two with mipmaps.

## Saves

- Local storage key `SAVE_KEY` (currently `fantasy-blockcraft-save-v2`); settings under `blockcraft-settings-v1`; blueprints under `blockcraft-blueprints`.
- A save stores the seed and the player's block edits by world coordinate. Edits are keyed by `wkey(X,y,Z)`: X and Z in 21 bits each and y in 9 bits (heights 0 to 511), decoded by `keyXYZ`; `tests/cases/11-saves.test.js` round-trips them. Saves always yield to updates: bump `SAVE_KEY` on any generation or save-format change (D-019).
- Per-block state lives in sets of window indexes that `shiftWindow` moves and `regenerateAll` clears: `torches`, `sluices`, `farms` (farmland, so crops grow anywhere lit). `genChunk` and `setBlock` keep them current.
