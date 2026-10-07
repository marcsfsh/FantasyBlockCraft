# Design

## Setting and pillars

- A Tolkien-esque world, **long abandoned**. No living towns, no roads, no machines or modern equipment.
- **Original names only.** Places evoke the feel of that kind of setting without using Tolkien's names, which are still under copyright.
- Everything built by the old peoples is **ancient, decaying and decrepit**: broken walls, rubble, fallen pillars, dead lamps, dust and bones.
- The underground is deep and layered; going down should feel like going back in time.

## Lands (biome index, name, character)

| # | Name | Character |
|---|---|---|
| 0 | The Western Sea | Open sea |
| 1 | Grey Shore | Sand or grey gravel shores |
| 2 | Green Hills | Soft rolling green country, meadows, hedgerows, scattered trees |
| 3 | Elder Wood | Dense old forest of big branching oaks, bracken, bare leaf-litter clearings |
| 4 | Heath Moors | Open rocky uplands, heather, bracken, peat, boulder tors, very few trees |
| 5 | High Mountains | Coherent ranges, stone ridges, snow above the snow line |
| 6 | Northern Fells | Snowy spruce country |
| 7 | Barrow Hills | Smooth grassy downs with barrows and rings of standing stones |
| 8 | Shadowed Forest | Dark oaks with near-black leaves, cobwebs, bare dark earth, hummocky ground |
| 9 | Lake | Upland lakes with one water level and a raised shore |
| 10 | Windswept Plains | Wide grassland, no flowers or tall grass, lone oaks, long low waves |
| 11 | Fens | Flat wet ground, pools, mud, reeds, willows |

Lands are driven by large climate fields (warmth, damp) and region fields, with continuous weights (`dw`, `bw`, `pw`, `fen`, `sw`, `fwd`) so terrain, trees and ground cover blend across borders. Current balance: every land covers roughly 6 to 14% of the land surface.

## The underground (sea level is y310, the world is 384 tall)

| Layer | y | Contents |
|---|---|---|
| Crawlways | ~240 to ~286 | Narrow twisting tunnels |
| Old caves | 205 to 258 | Big older caves, rooms, rare cavern lakes; cave regions (mossy, crystal, dripstone, fungal) |
| Old workings | 155 to 202 | Mineshafts, camps, alchemists' cellars, old smithies, monster-room dungeons |
| Great caverns | 102 to 150 | Huge pillared caverns, older stone ruins and shrines; deepstone begins here |
| Dwarven city | 58 to 100 | Floors at 64 and 82 |
| Dwarven mines | 14 to 56 | Galleries at 20, 32 and 44, inclines, great stepped pits |
| The Fire Below | under 12 | The lava sea |

Targets: underground standing water under about 0.5% of open cave space; cave openings within five blocks of the surface under about 0.5% of land columns.

## The dwarven city

- Two floors per hold, organised into districts (residential, industrial, sacred, royal) with themed rooms and loot.
- Avenues wind from each hold's edge to a central plaza; plazas carry waymarkers.
- Great structures span 2 x 2 chunks; the Hall of a Thousand Pillars spans 3 x 3 and both floors.
- Decay is heavy everywhere (baseline ruin intensity 0.55 to 1). Despite that, every room must be reachable: doorways open on both sides, every room has a doorway route toward an avenue, rubble is cleared between each doorway and the room's middle, and a tidy pass removes anything floating or leaking.
- Stairwells on lower-floor avenues lead down into the mines.

## Controls

Keyboard and mouse, touch, and Xbox-layout controllers (including the ROG Ally X in gamepad mode). The help panel on the pause screen switches to whichever is in use.
