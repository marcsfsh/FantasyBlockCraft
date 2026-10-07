# Testing

`npm test` runs every file in `tests/cases/`. Each case is pasted into the game bundle at the `/*@test-hook*/` marker (in `src/js/engine/world-streaming.js`), so it runs inside the game's own scope right after the starting world is ready. The browser, three.js and audio are replaced by do-nothing stand-ins (`tests/harness/runner.cjs`); world generation, lighting, meshing, streaming and game logic run for real.

- `assert(condition, 'description')` records a pass or a failure. `info(...)` prints a metric.
- `// @seed 777` near the top of a case pins its world seed. Otherwise the seed is 123456789, or `--seed=N`.
- `npm test -- doorways` runs only cases whose file name contains `doorways`.
- Each case runs in its own Node process with up to 4 GB of memory; a full world takes several seconds to generate.

| Case | Checks |
|---|---|
| 01-smoke | The world generates, frames run, core tables and switches are intact |
| 02-lighting | Streamed lighting equals a full recompute, exactly |
| 03-ruin-graph | Doorways open on both sides; under 3% of rooms sealed |
| 04-doorways | Doorways can be walked through; at most 2% blocked |
| 05-underground | Underground water and surface openings stay under their targets |
| 06-biomes | Lands are wide and balanced |
| 07-gamepad | A simulated controller drives menus and play |

When a change alters generation on purpose, update the thresholds deliberately and record why in `docs/DECISIONS.md`.
