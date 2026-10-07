# Roadmap

Only work that is already known: entries from `docs/KNOWN_ISSUES.md` and the refactors named in `docs/ARCHITECTURE.md` and `docs/DECISIONS.md`. No new features. Order is a suggestion; each item is its own PR with a task packet (`.claude/skills/task-packet`).

## 1. Known issues

| Issue (from KNOWN_ISSUES) | Next step | Guarded by |
|---|---|---|
| One blocked doorway, seed 777, cistern into archive | Reproduce with `npm test -- --seed=777 ruin-graph` and a 777 variant of the doorway walk; find which pass blocks it (cistern shape, decay, tidy); fix without changing other rooms. Generation change: snapshot and save key decision | 03, 04, 08, 09 |
| Isolated chambers (about 1% of rooms, no doorway) | By design for now. Revisit only if the owner asks; any change goes through `ruins-change` | 03 |
| Streaming hitch (about 20 ms per chunk in the browser) | See section 4 | `npm run bench` |
| Save key not bumped after the latest biome tuning | Owner decides: bump `SAVE_KEY` (retires all current saves) or accept the mix. Log either as a decision. Best folded into the next generation change that needs a bump anyway | 09 |
| Sunken water leaks at chunk borders | The tidy pass sees only its own chunk. Make the rule decidable from the plan or from pure functions of neighbouring columns, never from neighbour blocks | 05, 08, 09 |
| Single file needs the network (three.js CDN, VT323 font) | Owner decides whether the single file should inline three.js (about +600 KB) and the font; D-015 records the current choice | `npm run check` |
| Legacy code still bundled | See section 2 | 01, 10 |
| Headless tests stub the browser | No action planned; time budgets are tested with `npm run bench` instead | |

## 2. Delete the legacy code safely

`src/js/legacy/` (towns, roads, power tools, power network) is switched off but still bundled, and parts of it are used by live code. Measured references from outside `legacy/` (2026-10-07):

| File | Still used by live code |
|---|---|
| `towns.js` | `pick` (ruins and underground sites generation), `townPlan`, `townAt`, `TR`, `applyTown` (all return nothing or no-ops) |
| `roads.js` | `dungeonP`, `spikeP`, `flatOK` (live features), `roadAt`, `applyRoads` (off) |
| `power-tools.js` | `showName` (UI toast used everywhere), `mineTick`, `mineI`, `powerExtras` |
| `power-network.js` | `canCraft`, `craft`, `elecRecipe` (crafting), `CONDUCT`, `powerTick`, `powerStatus`, `useGenerator` |

Steps, one PR each, every one with the single-file build compared and `09-world-hash` unchanged:
1. **Move live helpers out**, unchanged, to the files that own them: `pick` to `core/noise.js`, `dungeonP`/`spikeP`/`flatOK` to `world/features.js`, `showName` to `ui/menus.js`, `canCraft`/`craft` to `gameplay/crafting.js` (keeping `elecRecipe` behaviour). Keep manifest order valid: function declarations hoist, but `pick` is a `const`, so it must be defined before generation first runs; `core/noise.js` is early enough. Expect the world hash to stay identical.
2. **Replace calls to switched-off functions** with their constant results (`townPlan` returns `null`, `townAt` false, `roadAt` false, `applyTown`/`applyRoads` nothing), removing dead branches only where the result is provably constant. World hash must stay identical; `01-smoke` assertions about towns and roads change to "the functions no longer exist", with a decision logged.
3. **Remove power items from play entirely**: blocks and items in `BANNED` stay defined (saves may contain their ids; `10-content-tables` guards ids) but their ticks, UI and recipes go. Decide what a saved power block becomes (keep, or show as an inert block) and log it.
4. **Delete the `legacy/` files** and their manifest entries; update the ARCHITECTURE module table, D-007, KNOWN_ISSUES and CHANGELOG.

## 3. Convert to ES modules, one system at a time

Plan in `docs/ES_MODULES_PLAN.md`. Do section 2 first: it removes the most tangled cross-file references.

## 4. Reduce the streaming cost

Baseline in `docs/PERF.md`: on the cloud VM one streamed chunk costs about 13 ms of CPU (genChunk about 11 ms, the rest lighting and the map), against a 5 ms frame budget in `processGenQ` that cannot split a chunk.
1. Measure where `genChunk` spends its time, pass by pass (column fill, worms, shafts, POIs, mines, ruins, 3 x 3 features, plants), by extending `tools/bench.mjs`. Record it in PERF.md.
2. Attack the largest passes first, without changing output: the world-hash and determinism tests must pass untouched. Known candidates from the pipeline shape: `features` runs for all 3 x 3 neighbours per chunk, so most of each neighbour's work is clipped away; work done per column across all 384 heights.
3. Then consider spreading one chunk's work across frames (generate in one frame, light in the next) so no frame exceeds the budget; streaming lighting must stay exactly equal to a full recompute (02).
4. Each step: before and after `node tools/bench.mjs --runs=3` in the PR, and a browser check by the owner (fly in a straight line on seed 123456789 and watch for hitches).
