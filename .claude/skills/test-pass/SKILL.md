---
name: test-pass
description: Choose, run and report verification for a Fantasy BlockCraft change with actual command output. Use before calling any change done or writing a PR description. Never write "should work".
---

# Test pass

The cloud session has no browser. Evidence is test output and build output, quoted verbatim.

## 1. Choose
| Changed | Minimum while iterating |
|---|---|
| any `src/` edit | the post-edit hook already syntax-checks; `npm run check:syntax` if unsure |
| generation | `npm test -- determinism world-hash` plus the cases for that system (see `worldgen-change`) |
| ruins | `npm test -- ruin-graph doorways determinism world-hash` |
| lighting | `npm test -- lighting` |
| blocks, items, recipes, loot | `npm test -- content-tables smoke` |
| input, menus | `npm test -- gamepad smoke` |
| build, tools, template, CSS | `npm run check` |
| harness or tests | the changed case, plus deliberately breaking the code it guards once to see it fail |
| performance | `node tools/bench.mjs --runs=3` before and after (`docs/PERF.md`) |

## 2. Run, always, before saying done
```
npm test
npm run build
npm run check
```
Run them for real in this session. Do not reuse output from before the last edit. `npm run build` refreshes the committed root `fantasy-blockcraft.html`; commit it with the change (`npm run check` fails if it was stale).

## 3. Report
- Paste the summary lines exactly: each `ok`/`FAIL` line and the final `all N test files passed (M runs)` line, plus the `INFO` metrics relevant to the change, before and after.
- Paste the build lines (`single file ... KB`, `game folder ...`) and `check passed`.
- Say plainly what was skipped and why. A skipped check is never reported as passing.
- If something fails, show the failing lines, say whether it fails on the base commit too (`git stash`, rerun, `git stash pop`), and fix or report it. Never loosen a threshold or update a snapshot to get green without a logged decision.
- Things only a person can judge in-game go in a "Check in-game" list with seed and location.

Banned phrases: "should work", "looks good", "probably fine".
