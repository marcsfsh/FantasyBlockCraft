# Design

> **Direction change (2026-10-08, D-019).** This file describes the game as built today; sections are rewritten as each milestone lands. Since 0.5.0 (M2a) the world is 512 tall, dwarven holds are rare and vast, the deep is natural caves over a lava sea, and old lights are cold. Since 0.6.0 (M2b) there are ways down, varied places underground, other peoples' remains, ruined surface sites, old roads and waystones. Still to come: the dwindling age's lived-in places and peoples, and more. See `docs/DIRECTION_QA.md` and `docs/MILESTONES.md`.

## Setting and pillars

- A Tolkien-esque world in a **dwindling age** (D-019): ancient ruins everywhere, a few dwarven holds still kept up, and lived-in places and travelers to come in later milestones. No machines or modern equipment.
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

## The world's height (D-023)

The world is 512 blocks tall and sea level is y310, so the underground keeps its old depth and there are about 200 blocks of sky above the sea. The hearts of the High Mountains rise far above the old limit; snow starts at the snow line (y343 and up).

## The underground (D-028)

The underground is made of **cave systems**, planned rather than noise: in each area of 160 x 160 blocks, one to three systems. Each has a main passage (the trunk) that starts at an entrance on the surface and winds down through the depths, with side branches that end in a chamber, some loops back into the trunk, and drops down shafts. Passages only meet at junctions and keep at least three blocks of rock from everything else. There is far less hollow rock than before 0.9.0 (about 1.2 to 1.7% of the rock under spawn, against about 28%).

Size and character change gradually with depth (no hard layers):

| Depth | y | What you find |
|---|---|---|
| Near the surface | ~240 up | Passages mostly 3 to 6 wide (sometimes 2 to 4), small domed rooms, stream pools; cave regions (mossy, crystal, dripstone, fungal) |
| The middle depths | ~150 to 240 | Wider passages, halls of 16 to 34 blocks, rifts; rare old mineshafts, camps, alchemists' cellars, old smithies, dungeon rooms |
| The great caverns | ~60 to 150 | Great domed halls with natural pillars, tall rifts with ledges and high windows, stepped halls going down to lakes; old stone ruins and shrines; deepstone begins about y100 |
| The deep | ~20 to 60 | The widest passages and largest halls, other peoples' remains, gorges with lava at the bottom, lava falls. Under and around a hold: its city (floors 64 and 82) and mines (galleries at 20, 32 and 44, inclines, great stepped pits) |
| The Fire Below | 3 to ~24 | An open lava sea (lava y3 to y8) under most of the land, with smooth islands and great pillars flaring at both ends; low under the holds' mines. The main system of most areas reaches it by a causeway of fallen rock to an island |

Ways between depths: ramps, steeper passages and spirals (all walkable), shafts and chasms to climb or drop, streams of pools stepping down a passage, and old built ways (stairs, mine inclines). The deepest halls of neighbouring areas are often linked, and near a hold a passage leads into the upper gallery of its mines.

**Underground water and lava are always held in sound rock** (owner's rule, D-024, Q87): water or solid under and beside every block, the floor under it resting on more rock, the walls beside it resting on something. Lakes lie in stepped halls, pools along streams. Lava lies only in the sea, in gorges that open onto it, in small pools under lava falls, and in the holds' forges; a lava fall pours from a slot in the rock into its pool, the only open face it has.

## Ways down (D-024, D-028)

- **Cave entrances**: a mouth at the foot of a slope, or a sinkhole on level ground with a ramp spiralling down its wall, into the trunk of a cave system.
- **Ruined stairways** stand on level ground: a broken stone shaft with a stair winding down to a cave passage (rarer since 0.9.0).
- **Ravines** cut up to about 60 blocks deep; about a third reach the upper caves.
- **Hold gates** lead down into the holds (below).
A way down is usually within 50 to 70 blocks of open land.

## Places underground (D-024)

- **Dungeon rooms** (about 1 chunk in 80): Forgotten Crypt, Old Storeroom, Old Cells, Sunken Chapel, each opening onto a cave passage.
- **Points of interest** (about 1 chunk in 18): miners' camps, alchemists' cellars, deep outposts, lava forges, crystal shrines, ancient ruins and mushroom groves open onto a cave passage; crystal geodes and fossils are sealed in the rock.
- **Remains of other peoples** stand in great halls away from the holds (about one area of 160 x 160 blocks in three): goblin warrens, gnome workshops, drow halls, and nameless ruins older than the holds. About a third are only leftovers.

## The surface (D-024)

- **Ruined sites** of the men of old, on level ground (about two areas of 384 x 384 blocks in three): round watchtowers, walled keeps with corner towers, castles with a curtain wall and a keep. Each has a name.
- **Old roads** of worn path, stones and gravel wander between neighbouring sites and up to the hold gates.
- **Ancient waystones** stand at about a third of sites and at the first gate of every hold. Attuning to them comes in M4.

## Old lights

The old peoples' lamps went out long ago. Lanterns, sconces, torches and glowstone in ruins, mines, camps and towers are found cold (Cold Lantern, Cold Sconce, Burnt-out Torch, Dim Glowstone); coal relights the first three. Rune stones, crystals and glowing fungi and moss still shine. Inhabited holds keep their lamps burning.

## Dwarven holds

- **Rare and vast** (Q9): one hold in each region of 2560 x 2560 blocks, about 400 to 575 blocks across and about 2000 blocks from the next. None lies under the spawn area; the nearest is usually 1500 to 2500 blocks away. Each hold has one name.
- **Some are inhabited** (about 3 in 10): kept up and lit, but empty until settlements and their peoples arrive (E2). The rest are ruins.
- A hold is made of quarters of 8 x 8 chunks, organised into districts (residential, industrial, sacred, royal) with themed rooms and loot, on two floors (y64 and y82).
- Avenues wind from each quarter's edge to a central plaza; plazas carry waymarkers.
- Great structures span 2 x 2 chunks; the Hall of a Thousand Pillars spans 3 x 3 and both floors, a few per hold.
- Decay is heavy in abandoned holds (ruin intensity 0.55 to 1) and light in inhabited ones. Despite that, every room must be reachable: doorways open on both sides, every room has a doorway route toward an avenue, rubble is cleared between each doorway and the room's middle, and a tidy pass removes anything floating or leaking.
- **Mines are tied to holds** (Q12): galleries and pits run under the whole hold and thin out to nothing by about twice its radius. Stairwells on lower-floor avenues lead down into them.
- **Hold gates** (up to three per hold) stand on the highest ground over the hold's outer ring: a terrace with pillars and braziers over a spiral stair that climbs from the upper floor (y82). Waymarkers in the plazas point to the nearest gate. The first gate has an Ancient Waystone.

## Look of the world (D-027)

Sky light reaches sideways under overhangs and into cave mouths, fading over about 15 blocks. Water shimmers and catches the sun, the lava sea rolls, plants sway, and lamps and glowing blocks show through fog. Clouds are flat blocky shapes that stay in place in the world and drift slowly, coloured by sunset and dark at night. The moon goes through eight phases, one per day.

## Controls

Keyboard and mouse, touch, and Xbox-layout controllers (including the ROG Ally X in gamepad mode). The help panel on the pause screen switches to whichever is in use. Creative mode has flying and noclip (fly through blocks: N, the Clip button, or the pause menu).
