# Fantasy BlockCraft

A voxel sandbox in a long-abandoned, Tolkien-esque world. Read `docs/DESIGN.md` before changing content and `docs/ARCHITECTURE.md` before changing code. Planned work is in `docs/ROADMAP.md`. This file only points the way; the docs are the source of truth.

## The game in one paragraph

Old lands on the surface; a deep, layered underground that ends in a ruined dwarven city, its mines and the Fire Below. Pillars (from `docs/DESIGN.md`):

- **Long abandoned.** No living towns, no roads, nothing modern: no machines, power or modern equipment.
- **Original names.** Evoke the setting; never use Tolkien's names.
- **Ancient and decaying.** Everything the old peoples built is broken, dusty and decrepit, yet the ruins stay walkable.
- **Deep and layered underground.** Going down feels like going back in time (layer table in `docs/DESIGN.md`).

## How sessions run

- Sessions run in a cloud VM with **no browser and no display**. Verification is headless (`npm test`) plus both builds. Never claim something "looks right"; you cannot see it.
- The owner playtests through GitHub Pages or the CI artifacts (see `README.md`). Every PR description must say **what to look at in-game**: where to go, which seed, what should be different, what should be unchanged.

## Commands

| Command | Use |
|---|---|
| `npm test` | All headless tests in `tests/cases/` (about 75 s on the cloud VM) |
| `npm test -- doorways` | Only cases whose file name contains `doorways` |
| `npm test -- --seed=777 ruin-graph` | Override the seed (cases with a `// @seed` line keep theirs) |
| `npm run test:quick` | Smoke and lighting only |
| `npm run test:update-snapshots` | Rewrite the world-hash snapshot; only for a deliberate generation change (`docs/TESTING.md`) |
| `npm run bench` | CPU benchmark, not part of `npm test`; compare against `docs/PERF.md` |
| `npm run build` | Both targets: `dist/single/fantasy-blockcraft.html` and `dist/web/` |
| `npm run build:single` / `build:web` | One target. The game folder uses `vendor/three.min.js`; the single file loads three.js r128 from the CDN |
| `npm run check` | Both builds, syntax check, smoke test: the quick gate before committing |
| `npm run check:syntax` | Bundle syntax only; reports the source file and line |

`tools/serve.mjs` (`npm run dev`) is a local dev server for people running the game on their own machine. It is useless in the cloud session; do not start it.

Details of the test harness: `docs/TESTING.md`.

`.claude/settings.json` pre-approves the npm scripts, `node` and `git` (force pushes are denied), and runs `tools/hook-syntax.mjs` after every edit to `src/`: a sub-second syntax check of the bundle that reports the source file and line. It does not run tests; run them yourself. No packages need installing, so there is no SessionStart hook (D-016).

## How the source works

- `src/js/*` is **classic script code, not modules**. `tools/build.mjs` concatenates the files in the order of `src/js/manifest.json` inside one strict-mode IIFE. Everything shares one scope.
- **Top-level code runs in manifest order.** Function declarations hoist across the bundle; `const`/`let` do not. Moving a file in the manifest can break load-time code.
- New source files must be added to `src/js/manifest.json` with an `about` line, and to the module table in `docs/ARCHITECTURE.md`.
- `src/html/index.template.html` holds `{{STYLE_BLOCK}}` and `{{GAME_SCRIPT}}`; `src/css/style.css` holds all styles.
- **Never edit or commit `dist/`.** It is build output and is git-ignored.
- `src/js/legacy/` is switched-off code (towns, roads, power). Do not extend it.

## Generation rules (from `docs/ARCHITECTURE.md`; keep them true)

1. **Determinism.** Generation is a pure function of the seed and world coordinates. Never use `Math.random()` in generation; use `hsh`, `rngAt`, `fbm2`, `noise3`. Never use stateful streams such as `wr` or `tr` in generation either.
2. **Chunk-local writes.** Write through `PW(X,Y,Z,id,mode)`, which clips to the chunk being generated (`gx0`, `gz0`), and read through `GW`. Only per-column passes that loop over the chunk's own columns (`fillCol`, `plants`) touch `world` directly. A structure spanning chunks is recomputed from its anchor by every chunk it touches.
3. **Random-stream invariants.** When a generator skips work for a chunk it cannot reach, it must still draw the same number of values from its stream (see `veinP` in `src/js/world/chunk-generation.js`), or every later structure from that stream shifts. Adding or removing a draw changes the world: treat it as a generation change.
4. **Write modes.** `MODE_SET`, `MODE_AIR`, `MODE_STONE`, `MODE_FILL`; pick the weakest that works.
5. **Save key policy.** Saves store only edits by world coordinate. If a change moves terrain or structures, bump `SAVE_KEY` in `src/js/core/config.js` and log it in `docs/DECISIONS.md`. If you decide not to bump it, log that decision and the reason too.
6. **Lighting stays exact.** Block light never enters chunks that are not generated (`genDone`), so streaming light equals a full recompute. `tests/cases/02-lighting.test.js` enforces exact equality; never loosen it.

## Workflow for every change

1. **Plan.** Restate scope, constraints and acceptance criteria. Name the tests you will run and the docs you will touch.
2. **Implement** the smallest change that does the job. Match the surrounding dense style; do not reformat code you did not change.
3. **Test.** Run the relevant cases while working, then the full `npm test`.
4. **Build both targets** (`npm run build`).
5. **Record durable changes:** `docs/DECISIONS.md` (decisions a later change could undo), `docs/KNOWN_ISSUES.md` (found, fixed or changed issues), `CHANGELOG.md` (anything a player would notice, plus tooling changes).
6. **PR description:** what changed and why, actual test output (pass lines and metrics), build output, docs updated, and a short "Check in-game" list.

## Project skills (`.claude/skills/`)

`task-packet` (start here for anything non-trivial), `worldgen-change`, `ruins-change`, `add-block-or-item`, `test-pass`, `decision-log`, `release-build`.

## Definition of done

- `npm test` passes in full, with the output quoted in the PR.
- `npm run build` succeeds for both targets.
- If generation was not meant to change, the world-hash snapshot still matches. If it was, the snapshot update is deliberate and explained, and the save key decision is logged.
- Docs and `CHANGELOG.md` updated where something durable changed.
- The PR says what to check in-game.

## Never

- Use `Math.random()` or other non-seeded randomness in generation.
- Write blocks during generation without `PW`, or read outside the chunk without `GW`.
- Loosen the lighting equality test, or raise a test threshold without a logged decision.
- Edit or commit `dist/`, or mass-reformat source files.
- Add runtime or dev dependencies without a logged decision (see D-016), or anything modern or named after Tolkien's works to the game.
- Say "should work" in place of test output.
