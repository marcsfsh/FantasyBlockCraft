---
name: ruins-change
description: How to change the dwarven city ruins (src/js/ruins/*) in Fantasy BlockCraft without breaking walkability. Covers the connectivity guarantees (symmetric doorways, routes toward avenues, the north-wall rule, path clearing, the tidy pass) and the tests that enforce them.
---

# Ruins change

Also follow the `worldgen-change` skill: ruins are generation.

## How the city is planned (src/js/ruins/city-plan.js)
- The city is a grid of 16 x 16 cells (one per chunk) on two floors, `RUIN_Y=[64,82]`, `L` = 0 or 1. `ruinType(cx,cz,L)` gives the room type; `ruinActive`, `isAvenue`, `megaAt` (2 x 2 great structures), `inDelf` (the pillared hall) classify cells.
- Doorways are decided per edge by `edgeOpen(cx,cz,dx,dz,L)`, from the plan alone, never from blocks. Each chunk builds its own half of every opening with `dwOpening`.

## Guarantees (keep all of them)
1. **Symmetric doorways.** `edgeOpen(a,b,dx,dz,L) === edgeOpen(a+dx,b+dz,-dx,-dz,L)`. `edgeBase` normalises to the positive direction; `downDir`/`forcedDir` are checked from both sides. Any new rule must be evaluated identically from both cells.
2. **A route toward an avenue.** `avDist` (BFS over `cellLink`, up to `AVR=9` cells) and `downDir` open one edge per cell toward a cell one step closer to an avenue; `forcedDir` opens an edge for a room that would otherwise be sealed.
3. **North-wall rule.** Rooms in `NO_NORTH` (`hall`, `throne`, `shrine`, `crypt`) have their altar on the north wall and never open north: `northBlocked` in `edgeOpen`, `cellLink` and `forcedDir`, plus the explicit check before `dwOpening('n',...)` in `applyRuins`. Keep both in sync if you change the list.
4. **Path clearing.** After decay, `applyRuins` clears gravel, cobble and cracked brick in a 3-wide, 3-high strip from each open doorway to the room's middle. New decay or rubble must come before that pass, or respect it.
5. **Tidy pass.** `dwTidy` runs last: it walls in sunken water that meets air and removes floating or leaking leftovers. It can only see the current chunk (known issue: water leaks at chunk borders).

## Tests
- `03-ruin-graph`: every doorway symmetric (0 asymmetric edges); under 3% of rooms sealed.
- `04-doorways` (seed 4242): block-level walk test; every doorway passable, at most 2% blocked. Read its `INFO` lines: they name the blocked room pairs and edge kinds.
- `npm test -- --seed=777 ruin-graph` and similar to try other seeds; the known blocked doorway is seed 777, cistern to archive.
- `determinism`, `world-hash` as for any generation change.

Run `npm test -- ruin-graph doorways determinism world-hash` while iterating; full suite before committing. Quote the `rooms`, `sealed`, `edges`, `impassable` numbers before and after.

## In-game check to request
Give the seed and the world X/Z of the changed rooms (cell `cx,cz` is X = cx*16+8, Z = cz*16+8) at y 64 or 82, and say what the owner should be able to walk through.
