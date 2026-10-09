# Testing

`npm test` runs every file in `tests/cases/`. Each case is pasted into the game bundle at the `/*@test-hook*/` marker (in `src/js/engine/world-streaming.js`), so it runs inside the game's own scope right after the starting world is ready. The browser, three.js and audio are replaced by do-nothing stand-ins (`tests/harness/runner.cjs`); world generation, lighting, meshing, streaming and game logic run for real.

- `assert(condition, 'description')` records a pass or a failure. `info(...)` prints a metric.
- `// @seed 777` near the top of a case pins its world seed. Otherwise the seed is 123456789, or `--seed=N`. `// @seed 123456789 4242` runs the case once per seed, each in its own process.
- `snapshot('name', value)` compares `value` with the value recorded in `tests/snapshots/<case>.json` for the current seed. A missing or different value is a failure that prints both values.
- `npm test -- doorways` runs only cases whose file name contains `doorways`.
- Each case runs in its own Node process with up to 4 GB of memory; a full world takes several seconds to generate.

| Case | Checks |
|---|---|
| 01-smoke | The world generates, frames run, core tables and switches are intact |
| 02-lighting | Streamed block and sky light equal a full recompute, exactly; sky light reaches covered cells from the side; light after about 800 edits (shafts, roofs, hollows) equals a full recompute |
| 03-ruin-graph | Doorways open on both sides; under 3% of rooms sealed; checked over the hold of region (0,0) |
| 04-doorways | Doorways can be walked through; at most 2% blocked (seeds 4242 and 777), with the window moved to the hold of region (0,0) |
| 05-underground | Underground water and surface openings stay under their targets; no underground water floats or rests on anything floating (D-024) |
| 06-biomes | Lands are wide and balanced |
| 07-gamepad | A simulated controller drives menus and play |
| 08-determinism | Every chunk is identical when regenerated in reverse and shuffled order, after a window shift (kept, streamed and freshly regenerated chunks) and after shifting back |
| 09-world-hash | Hash snapshot of the starting world for seeds 123456789 and 4242: blocks and water by layer, column data, block light, terrain over 16 000 blocks and the city plan over 81 x 81 cells around the hold of region (0,0) |
| 10-content-tables | Block ids fit 0 to 255 and avoid 101 to 107 (water levels in saves), items never share a block id, tiles are inside the atlas, recipes and loot tables reference existing, allowed items, and no removed kind of block or item (power, trade, ore processing, rails) exists. Prints free block ids and unreferenced atlas tiles |
| 11-saves | World keys decode exactly at every height; a surface edit survives a save (under the world's own key) and reload at the same place; undo restores the right block |
| 12-weather-farming | A lit crop under a roof grows; mountain snow starts at the snow line; farmland tracking survives window shifts |
| 13-survival | Crate loot is never lost with a full pack; creative only looks inside; blasts spare graves; using a block beats the held item |
| 14-engine | Torches in streamed chunks are registered; lit kegs wait while paused |
| 15-names | The Tolkien blocklist catches names, near misses and roots; 30 000 generated names across ten peoples, hold names over a wide area, and every fixed place, block and item name pass |
| 16-worlds | Worlds can be created, exported, imported and deleted; seeds typed as numbers are exact; only player changes are saved (automatic changes and flowing water add nothing) |
| 17-entities | Every moving kind is registered; entities and meshes keep their world position through a window shift; updates wait while paused; rebuilds clear ordinary entities and keep waypoint beams in place |
| 18-actions | Every binding names a real action; held controls read through `keyHeld`; a rebound key, held control and controller button take effect |
| 19-equipment | Equip, swap and unequip; equipment is saved with the world and goes into the grave on death |
| 20-holds | Holds are 1000+ blocks apart and a few thousand on average, several hundred across, inside their own region, never under spawn; one name each; some inhabited; mines fade with distance from the hold |
| 21-deep | Cave systems (D-028): every region has one, most reach the deep, some reach the lava sea and link to the next region, all three chamber shapes occur; passages of unjoined edges never come within three blocks of each other; open rock under spawn is between 0.8% and 6% and roomier deep than near the surface; the lava sea is open under most land and under holds; water and lava are held in sound rock in three windows; no lava hangs over the sea |
| 22-old-lights | An abandoned hold has only cold lamps and still has eerie lights; an inhabited hold keeps its lamps lit; coal relights lamps |
| 23-entrances | Hold gates can be climbed from y82 to the terrace and the first has a waystone; plaza waymarkers name the nearest gate; cave entrances, ruined stairways and deep ravines are common enough, a way down is usually within about a hundred blocks, the nearest stairways can be walked down to their caves, most entrances lead on foot at least 60 blocks down, and a link from a cave system can be walked into a hold's mines |
| 24-places | Dungeon rooms and points of interest are rare, all four dungeon kinds occur, and every room in eight windows opens onto its cave |
| 25-remains | All four kinds of remains occur, whole and as leftovers, about one region in four; the nearest of each stands built in an open cavern |
| 26-surface | Most regions have a ruined site of each kind; roads link nearly every site and are laid near them; the nearest of each kind stands, rests on the ground and has its waystone |
| 27-streaming | Streaming one step per frame (with window slides mid-chunk) equals whole-chunk generation; streamed block and sky light equal a full recompute; typical step under the 4 ms budget; travel makes only 3 x 3 chunks at once; the explored map is capped |
| 28-meshing | The surface floor trims the band and spawn stays under 1.3 million vertices (D-029); the floor never cuts above 24 blocks under open ground; cave mode and its band switch with some give |
| 29-view | Auto is the default view; it grows while smooth, shrinks when frames slow, on 60 Hz and 120 Hz screens. Resolution: Sharp, Fast and Auto pick the right pixel ratio on 200% and 300% screens; under slow frames Auto pulls the view to 72 before lowering the resolution, and restores the resolution first. |
| 30-noclip | Creative noclip: N is bound, the player passes through rock, turning it off inside rock lifts them out, survival refuses it and turns it off, fly during noclip leaves flying on |
| 31-natural-surface | Rivers lie in valleys (under 3% of river columns with land 8 above the water within 5 blocks); gentle lands are smooth; the ranges still have high peaks and few sheer steps; barrows only on the Barrow Hills, clustered, facing several ways, sized and some broken open; no site in a hollow and towers and castles on high ground; trees gather in groves |
| 32-items | The tool ladder rises strictly in tier, speed and wear for pickaxes, axes and shovels; each pickaxe is the first to mine the next ore; tools speed their own materials; shears keep leaves; every recipe is reachable from the starting kit and the natural world; no Blueprint Tool recipe; the hook and fireworks are gone and the keg has one name; ladders and pitons follow their placement rules; the player climbs a ladder, holds still and climbs down unharmed; rope unrolls as far as carried and comes back down; a thrown grapnel catches a wall's top edge, hangs rope to the floor, and the player climbs onto the ledge; map, compass and depth gauge gate the minimap and position in survival; the sickle harvests and replants 9 wheat; a flare climbs over 40 blocks and burns out |
| 33-survival-systems | A built chest takes stacks (tools keep wear), is saved, refuses to break while full, empties and is forgotten when broken; an unopened world chest cannot be broken; packs and the satchel give 45, 54 and 63 slots and a smaller pack is refused while its slots hold items; the lantern takes oil then candles in the dark, goes out with no fuel, burns nothing in daylight, gives more light than a torch; no light around the player without either; cave light falls with depth; creative keeps its lamp; R refuses in survival; touching an ancient waystone attunes it; travel only from beside a waystone, to another; attuned stones are saved; turnips and beans grow and the sickle replants them; four dishes cook at a furnace; bilberries, mushrooms and wild turnips grow in three windows |
| 34-controls | Travel is off D-pad up; rebinding a key frees it from its old action and is saved; movement keys rebind; saved bindings load as saved and a control left with nothing gets its default back; fixed controller buttons refuse; the panel's capture binds, cancels with Esc or B and refuses fixed buttons, also through pollPad; reset; help by mode and device follows the bindings; hints show once, name the device's control, stay off when off, and the hint tick notices a new world, hunger and a waystone; the readout action; renaming worlds keeps names unique |
| 35-maps-creative | Every window chunk is explored; places are kept once nearby and lands are not places; markers take names and colours; explored chunks (packed), places and markers are saved and unpack exactly; the map draws sea blue and land in its land's colour; the world map needs a map in survival, opens and closes with M, and tapping picks a point or a marker; the layer view only underground; the Fill Tool fills 27, replaces 26 and leaves the rest, lists the box, undoes, clears, refuses a box over 64; brushes reach 13; time and rain can be set; each test structure builds, saves its blocks as edits and undoes; going to coordinates loads the area and stands the player on the ground; the Fill Tool is creative only |
| 36-lands | The registry (30 new lands, 7 kept, 3 reworked, signatures, peoples, no Tolkien names); the transition map is symmetric and keeps winter from deserts; over 12 000 x 12 000 blocks every neighbouring pair is allowed, no land is under 215 x 215, all but corner tips lie in a 115-block circle of their land, few pinch, common lands are larger than uncommon ones, no land covers over 14%; every land appears within 12 800 blocks; gorges are fewer than the old ravines, at least 7 wide but for their rounded ends, and reach 45 to 62 deep; stretch names; the land tour goes into the chosen land (creative only); block ids above 255 fit the world |
| 37-forests | The seven forest lands are built (Fens now Willow Vales); a window on each grows its own logs, floor and plants; over 80 x 80 cells about 40% of forest stretches have no signature, few miss one, and all 14 kinds appear; the lodge, stilt house and watch post stand, their ponds hold water and no tree grows inside them; each new log makes its planks and any planks make sticks |
| 38-highlands | The five highland lands are built (Northern Fells now Frozen Tundra) and each grows its own ground and plants; highland and mountain stretches nearly all get their signature and every kind appears; the great sinkhole is open down to a cave passage; waterfalls are found and carry water all the way to their pool; mistwood makes planks |
| 39-coasts | The six coast lands are built and each has its own shore, rock or plants (the Western Sea its kelp and seagrass); the chalk cliffs behind an arch drop 15 or more within three blocks and the arch stands on two legs; nearly every coast and sea stretch gets its signature and all 14 kinds appear; kelp and seagrass count as water; lily pads float on the pools of the vales and bogs |

When a change alters generation on purpose, update the thresholds deliberately and record why in `docs/DECISIONS.md`.

## Determinism (08-determinism)

Hashes every loaded chunk (block ids and water levels, all heights) by world chunk coordinate, then wipes and regenerates chunks in other orders and window positions and requires identical hashes. It catches `Math.random()`, stateful random streams and any read of neighbouring chunks during generation. It does not check that two chunks agree on a structure crossing their border (a broken `veinP`-style invariant is still deterministic); the world-hash snapshot catches that kind of change instead. It takes about 15 seconds.

## The world-hash snapshot (09-world-hash)

`tests/snapshots/09-world-hash.json` holds twelve hashes per seed. Each names what it covers, so a failure points at the part of the world that moved: `blocks:<layer>:y<from>-<to>` for the layers in `docs/DESIGN.md`, `columns:...` for ground height, land and height map, `light:...` for block light, `plan:terrain-16k` for terrain and land far beyond the window, and `plan:city-81x81-cells` for the dwarven city plan.

**If it fails and you did not mean to change generation**, the change has a side effect: find it (the failing names say where) and fix it. Do not update the snapshot.

**Updating the world snapshot on purpose**, when a change is meant to alter generation:

1. Run the full suite first and note which snapshot names fail; only the ones you expect should.
2. `npm run test:update-snapshots` (the same as `node tests/run-tests.mjs --update-snapshots world-hash`). It prints `SNAP <name> changed "old" -> "new"` for each changed hash and rewrites the file.
3. `npm test` again; everything must pass.
4. Commit the snapshot file in the same commit as the generation change, never alone.
5. In `docs/DECISIONS.md`, log the change and the save key decision (bump `SAVE_KEY` or say why not). In the PR, list the snapshot names that changed and why.

The hashes are identical on Node 20, 21 and 22 (checked on 2026-10-07). If a Node upgrade alone changes them, record that in the PR and update the snapshot in its own commit with no source changes.

## Screenshots

`npm run shots` (`tools/shot.mjs`) renders set views of the real game in headless Chromium and saves PNGs to `tests/.tmp/shots/` (D-026). It fails on any page error or WebGL shader error, so run it after any shader or renderer change and read the pictures. It is not part of `npm test` (it takes a few minutes and needs the global Playwright of the cloud VM).

## Benchmark

`npm run bench` is a separate CPU benchmark (startup, chunk generation, streaming, meshing) that uses the same harness. It is not part of `npm test`. See `docs/PERF.md`.

## Adding a case

Create `tests/cases/NN-name.test.js`. It runs inside the game's scope with the starting world ready but the outer ring of chunks still queued; call `while(genQ.length)processGenQ();` if you need the whole window. Use `assert`, `info` and `snapshot`. Prefer `// @seed` so failures reproduce. `performance.now()` returns 0 in the harness; use `Date.now()` for timings. Add a row to the table above.

## Maps

`npm run lands` (`tools/lands.mjs`) draws the land layout of 16 000 x 16 000 blocks (one pixel per 10 blocks) and writes `docs/LANDS.md`, `docs/lands/land-map.png` and `docs/lands/legend.png` from the land registry (D-039). Run it after any change to `world/lands.js`; with `--out=` it writes the pictures elsewhere and leaves the docs alone (`--seed=`, `--size=`).

`npm run map` (`tools/map.mjs`) generates square windows of the real world headlessly and writes three PNGs to `tests/.tmp/maps/`: a shaded height map, open cave space seen from above in four depth bands, and two vertical sections through the middle (D-029). Options: `--seed=`, `--x=` and `--z=` (centre), `--tiles=` (windows per side, 224 blocks each), `--label=`, `--out=`. Three by three windows take under a minute. Use it before and after a generation change, and attach the pictures for the owner.
