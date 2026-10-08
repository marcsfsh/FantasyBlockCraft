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
| 02-lighting | Streamed lighting equals a full recompute, exactly |
| 03-ruin-graph | Doorways open on both sides; under 3% of rooms sealed |
| 04-doorways | Doorways can be walked through; at most 2% blocked (seeds 4242 and 777) |
| 05-underground | Underground water and surface openings stay under their targets |
| 06-biomes | Lands are wide and balanced |
| 07-gamepad | A simulated controller drives menus and play |
| 08-determinism | Every chunk is identical when regenerated in reverse and shuffled order, after a window shift (kept, streamed and freshly regenerated chunks) and after shifting back |
| 09-world-hash | Hash snapshot of the starting world for seeds 123456789 and 4242: blocks and water by layer, column data, block light, terrain over 16 000 blocks and the city plan over 81 x 81 cells |
| 10-content-tables | Block ids fit 0 to 255 and avoid 101 to 107 (water levels in saves), items never share a block id, tiles are inside the atlas, recipes and loot tables reference existing, allowed items, and no removed kind of block or item (power, trade, ore processing, rails) exists. Prints free block ids and unreferenced atlas tiles |
| 11-saves | World keys decode exactly at every height; a surface edit survives a save (under the world's own key) and reload at the same place; undo restores the right block |
| 12-weather-farming | A lit crop under a roof grows; mountain snow starts at the snow line; farmland tracking survives window shifts |
| 13-survival | Crate loot is never lost with a full pack; creative only looks inside; blasts spare graves; using a block beats the held item |
| 14-engine | Torches in streamed chunks are registered; lit kegs wait while paused |
| 15-names | The Tolkien blocklist catches names, near misses and roots; 30 000 generated names across ten peoples, hold names over a wide area, and every fixed place, block and item name pass |
| 16-worlds | Worlds can be created, exported, imported and deleted; seeds typed as numbers are exact; only player changes are saved (automatic changes and flowing water add nothing) |

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

## Benchmark

`npm run bench` is a separate CPU benchmark (startup, chunk generation, streaming, meshing) that uses the same harness. It is not part of `npm test`. See `docs/PERF.md`.

## Adding a case

Create `tests/cases/NN-name.test.js`. It runs inside the game's scope with the starting world ready but the outer ring of chunks still queued; call `while(genQ.length)processGenQ();` if you need the whole window. Use `assert`, `info` and `snapshot`. Prefer `// @seed` so failures reproduce. `performance.now()` returns 0 in the harness; use `Date.now()` for timings. Add a row to the table above.
