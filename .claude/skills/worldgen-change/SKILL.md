---
name: worldgen-change
description: Rules and procedure for any change that can alter Fantasy BlockCraft world generation (terrain, biomes, caves, underground sites, ruins, mines, features, ores, plants). Covers determinism, PW/GW, random-stream invariants, choosing tests, the world-hash snapshot update policy and the save key decision.
---

# World generation change

## Rules (from docs/ARCHITECTURE.md; never break them)
1. **Pure function of seed and world coordinates.** Use `hsh(a,b,c)`, `rngAt(a,b,c)` (a fresh stream per anchor), `fbm2`, `noise3`. Never `Math.random()`, never `wr`/`tr`, never module state that depends on which chunk ran first. Caches are fine only if they store pure results.
2. **Writes through `PW(X,Y,Z,id,mode)`**, reads through `GW` (returns -1 outside the chunk). World coordinates, not window coordinates. A structure crossing chunks is recomputed from its anchor in every chunk it touches; `features` already runs for the 3 x 3 neighbours.
3. **Random-stream invariants.** Each `rngAt` stream must yield the same sequence in every chunk that reads it. If you skip work early for a chunk that cannot be reached, still draw the same number of values (see `veinP`). New draws go at the end of a stream, or in a new stream with a fresh salt (`rngAt(WCX, <unused number>, WCZ)`); grep the salt first.
4. **Weakest write mode:** `MODE_AIR` over `MODE_FILL` over `MODE_STONE` over `MODE_SET`.
5. **Lighting stays exact:** do not change `lightChunk`/`genDone` gating without keeping 02-lighting at exactly 0 differing cells.

## Tests to choose
| Change touches | Run |
|---|---|
| anything in generation | `npm test -- determinism world-hash` while iterating |
| caves, water, surface openings | `05-underground` |
| biomes, climate, terrain | `06-biomes`, `05-underground` |
| ruins, city plan | `03-ruin-graph`, `04-doorways` (also the `ruins-change` skill) |
| emitters (lava, glow blocks) | `02-lighting` |
| always, before committing | full `npm test`, `npm run build` |

Use `info()` to print the metric you are changing, before and after, and quote both in the PR.

## Snapshot policy (09-world-hash)
- **Not meant to change generation:** every snapshot must still match. A mismatch is a bug in your change; the failing names say which layer moved. Do not update.
- **Meant to change it:** confirm only the expected names fail, then `npm run test:update-snapshots`, then `npm test`. Commit the snapshot with the code change. List changed names in the PR.
- Never update the snapshot in a commit without the generation change that caused it (exception: a Node upgrade alone, in its own commit).

## Save key decision
Saves keep only player edits by world coordinate (`SAVE_KEY` in `src/js/core/config.js`). If blocks move where players are likely to have built or dug (surface, caves, ruins), bump the version suffix (`-v1` to `-v2`) so old edits do not land in the wrong places. Adding rare decoration deep underground may not need it. Either way, add a `docs/DECISIONS.md` entry stating bump or no bump and why; note that old saves are retired if bumped.

## Done
Determinism and snapshot outcome as above, targeted metrics quoted, full suite and both builds passing, DECISIONS/CHANGELOG (and DESIGN if the world reads differently) updated, PR says where to look in-game (seed 123456789 and 4242 starting areas make good comparisons).
