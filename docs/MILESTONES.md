# Build order and milestones

The plan from the direction interview (`docs/DIRECTION_QA.md`, cited as Q1 to Q76). It replaces the ordering in `docs/ROADMAP.md`, which keeps its detail on known issues and legacy deletion.

## How milestones run

- **Order (Q53, Q56, Q61, Q62, Q74):** bugs, then foundations, then the world restructure. After that come performance, survival, controls, surface and lore, with audio last. Expansion phases follow, starting with wildlife (Q63).
- **One branch and one PR per milestone (Q54, Q55).** The owner reviews and playtests at the checkpoint, from the committed root `fantasy-blockcraft.html`. Large milestones may be split into a and b parts if a single PR becomes unreviewable; each part still ends in a checkpoint.
- **Saves break whenever needed (Q29, Q31).** Every generation or save-format change bumps `SAVE_KEY` without migration. Old worlds are not preserved.
- **Every milestone ends with:**
  - all tests green, plus new tests for what it adds
  - both builds, and the refreshed root file
  - `docs/DECISIONS.md`, `docs/KNOWN_ISSUES.md` and `CHANGELOG.md` updated
  - a version bump
  - a "Check in-game" list for the Ally X and the desktop (Q2)
- **Touch:** must keep working, but is not separately tested (Q75). Every new action gets a touch control.
- **Constraints:**
  - Single player only (Q50), so no multiplayer design constraints.
  - Peaceful creatures only until hostility is revisited (Q3, Q46).
  - Gentle survival (Q13, Q16).
  - No music (Q57).
  - Simple block physics (Q60).
  - Cosmetic weather (Q58).
- **Lore and setting text:** Claude drafts it into `docs/`, and the owner approves it in the milestone PR (Q28).

## Milestone overview

| # | Milestone | Goal |
|---|---|---|
| M0 | Bug sweep | Every known bug fixed before anything else |
| M1 | Foundations | Remove what is leaving, rebuild the save format, add the base systems later milestones need |
| M2 | World restructure | A 512-tall world: rare vast holds, natural deep caves, other peoples' remains, the lava sea, findable entrances |
| M3 | Performance and visuals | Smooth on the Ally X at the highest frame rate possible, with view distance scaled by device and a livelier look |
| M3.5 | Natural generation | Caves rebuilt as connected systems with flow, sound lava; natural rivers, mountains, borders and placement on the surface |
| M4 | Survival and items | Metal ladder, broader tool kit, storage, the worn lamp, earned fast travel, food |
| M5 | Controls and interface | Remapping, hints, maps, world management, creative tools |
| M6 | Surface enrichment and new lands | 30 new lands on a transition map, enriched old lands, ruin layouts, small structures, streams and falls, weather by land |
| M7 | Lore and chronicles | Hold chronicles, the journal, the discovery log |
| M8 | Audio | Ambient soundscapes, volume controls, positional sound |
| E1 | Wildlife | Entities in play: animals for atmosphere, resources, hunting, mounts |
| E2+ | Further expansions | Settlements and peoples, building and furniture, magic, new lands; order to be confirmed |

## M0: Bug sweep (Q56)

**Status: done in 0.2.0.** One reported bug was not real: torches in streamed chunks were already registered by `genChunk` (now guarded by 14-engine). The R and waypoint teleports are not bugs and move to M4.

Fix every known bug. Most were found by reading the code on 2026-10-08 and are listed in `docs/KNOWN_ISSUES.md`.

- **Saves**
  - Edit keys only store heights 0 to 127 (`wkey`/`keyXYZ`). Every surface edit reloads in the wrong place; undo and waypoints use the wrong position too.
  - Add a save round-trip test that would have caught this.
- **City**
  - The seed 777 blocked doorway. Decay leaves rubble on the wall line, and the path-clearing strip stops one block short of it (`k<h`).
  - The duplicate `junction` key in `RUIN_NAMES`.
  - Lecterns removed by decay.
- **Weather and farming**
  - High Mountains always snow: a leftover `PL.y>90` check.
  - No rain on Heath Moors and Barrow Hills: old desert ids.
  - Crops only grow on the top block of a column, so farms under a roof or underground never grow.
- **Survival**
  - The "You starved" death message can never appear. Hunger stays non-lethal (Q16).
  - Explosions empty a grave into the player's inventory wherever they are.
  - Crate loot that does not fit is silently lost.
  - In creative, opening crates and graves fills the survival inventory. Free mode switching itself stays (Q14).
  - Held food, seeds or tools take priority over opening lecterns and crates.
- **Engine**
  - Streamed-in torches have no flames: `lightChunk` never registers them.
  - The simulation keeps running while paused (kegs, falling blocks, water).
  - Esc does not close the inventory.
  - Switching from gamepad to mouse mid-play leaves the game with no pointer lock.
  - The ROG Ally X may be detected as a touch device: phone defaults, touch help, no pointer lock. Verify and fix.
- **Content**
  - Banned power blocks leak into the creative menu's "Other" category. Removing them entirely is M1.
  - The HUD says "TNT" for the Blasting Keg.
  - Lore mentions "titanium" (the metal is Moonsilver).
- **Free performance fix:** hoist the per-column deepstone noise out of the y loop in `fillCol`, with identical output.

**Checkpoint:**
- Survival edits on the surface survive a reload.
- Farms grow under a roof.
- Mountain weather is right.
- The seed 777 doorway is open.

## M1: Foundations (Q53)

**Split (D-021):** M1a (removals, save format v3, naming module) is done in 0.3.0. M1b (entity registry, input action layer, equipment slots) is done in 0.4.0; the ES module conversion moves to after M2 (D-022).

**Remove what is leaving.** Live helpers move out of `legacy/` first; see `docs/ROADMAP.md` section 2.

- Towns and roads code (Q6).
- Power blocks, items, ticks and UI entirely (Q41).
- Trading counters, mints and coins from survival (Q7). Coin items may stay defined for E2.
- Ore processing: crusher, gold pan, sluice (Q43).
- Rails (Q45).
- Generated off-theme blocks: the lab point of interest's batteries and wires, the outpost trader, the Machine Hall's water wheel and battery.
- Dead code found in the survey:
  - sky-island and oasis machinery
  - `houseP` and friends
  - `dwCorridor`, `canalEdge`, `ROOM_TYPES`
  - the gate and light-well stubs (M2 replaces them)

**Save format v3 (Q29 to Q32):**
- Correct world keys for any height.
- Only player changes are stored, plus minimal state (water sources, farms, containers).
- Several worlds per browser, each with a name, seed, mode and generator version.
- Export and import of a world to a file. The world list UI comes in M5; M1 adds a minimal list.

**Engine foundations:**
- An entity registry (done in 0.4.0; positions stay in window coordinates with a world-coordinate helper, D-022). It replaces the hand-patched arrays in `shiftWindow` (falling blocks, kegs, particles, rain, waypoints) and is the base for E1 wildlife.
- An input action layer: named actions bound to keyboard, mouse, gamepad and touch. This is the base for remapping in M5 (Q37).
- Equipment slots in the player model (belt lamp, pack, bag), the base for M4 (Q65, Q67).
- A naming module with one style per people, plus a test-enforced blocklist of Tolkien names (Q25, Q26). Dwarven is the first style; the others are stubs to be filled in later: goblin, gnome, human, orc, halfling, wood elf, drow, high elf, beastfolk.
- ES module conversion following `docs/ES_MODULES_PLAN.md`. It can happen here because legacy is gone; whether it happens here or alongside M2 is decided at the M1 task packet, depending on size.

**Checkpoint:**
- No power, trade, ore-processing or rail items anywhere.
- Several worlds can be created, and one can be exported and imported.
- Nothing else plays differently.

## M2: World restructure (Q61)

The biggest change, split (D-023) into **M2a**, done in 0.5.0: height, holds, mines, the natural deep, the lava sea and old lights; and **M2b**, done in 0.6.0: other peoples' remains, findable entrances, surface preparation, dungeons and waystones, plus sound underground water (owner's report, D-024).

- **Height 512 (Q69, Q73).** Done in M2a. The extra 128 blocks go above ground and sea level stays at 310 (D-023), so mountains get taller and the underground keeps its depth. This touches memory (about 77 MB of world data), saves, the mesh band and every height constant.
- **Dwarven holds become rare, vast structures that spawn (Q5, Q9).** Done in M2a.
  - Several hundred blocks across, a few thousand blocks apart.
  - The existing city plan, rooms, great structures, decay and connectivity rules are kept and placed per hold instead of everywhere.
  - The plan supports an inhabited variant (Q11); inhabitants arrive with settlements in E2.
- **Mines tied to holds (Q12).** Done in M2a. They spread from each hold and fade with distance, replacing the endless straight gallery grid.
- **Natural deep caves fill the deep layers by default (Q10).** Done in M2a. Large caverns, underground rivers and lakes, and crystal and fungal regions.
- **Remains of other peoples (Q10, Q70).** Done in M2b. Goblin warrens, gnome workshops, drow halls, and older, nameless ruins. Rarer than natural caves, sometimes only as leftovers inside caves.
- **The Fire Below as a real lava sea (Q21).** Done in M2a.
- **Findable entrances (Q22, Q72).** Done in M2b. Cave mouths in cliffs, ravines that reach caves, ruined stairways, and hold gates on mountainsides above holds.
- **Surface preparation for settlements (Q72).** Done in M2b. Old roads and paths linking ruins, and ruined surface keeps and watchtowers in varied sizes.
- **Dungeons and points of interest (Q24).** Done in M2b. Rarer and varied, always connected to a cave or passage.
- **Old lights mostly dead (Q8).** Done in M2a. Generated lanterns and torches are unlit. Rare eerie lights remain: runes, crystals, fungi.
- **Ancient waystones placed in the world (Q71).** Done in M2b. Attunement comes in M4.
- **Tests:**
  - The world-hash snapshot is re-recorded.
  - New tests: hold spacing and size, mine extent around holds, the lava sea (M2a: 20-holds, 21-deep, 22-old-lights); entrance frequency, reachability of points of interest (M2b: 23-entrances, 24-places, 25-remains, 26-surface).
  - The doorway and ruin-graph tests target hold areas.

**Checkpoint:**
- M2a: a seed and coordinates for a hold; the lava sea.
- M2b: a route from the surface down through a findable entrance; one example of each kind of remains.

## M3: Performance and visuals (Q74)

Split (D-025) into **M3a**, done in 0.7.0 (staged streaming, lighter meshing, travel without the freeze, throttles, auto view distance, frame readout), and **M3b**, done in 0.8.0 (sky light spread and the livelier look; smaller vertex formats left for after the owner's frame-rate check, D-027).

- **Frame rate as high as possible on the Ally X and desktop (Q33).**
  - Spread chunk generation and lighting across frames.
  - Cut mesh geometry: skip faces enclosed in caves, smaller vertex formats, possibly greedy meshing.
  - Remove the vertical mesh-band rebuild hitch and the freeze on waypoint travel.
  - Throttle the minimap and autosave.
  - Cap the explored-map memory.
- **View distance scales by device automatically, with manual override (Q34).**
- **Sky light spreads sideways into overhangs and cave mouths (Q36).** The lighting tests are extended to keep streamed light exactly equal to a full recompute.
- **Livelier look (Q35):**
  - animated water and lava
  - better clouds
  - moon phases
  - swaying plants
  - glow on emitters
- **A new `docs/PERF.md` baseline,** and an in-browser frame-time readout for the owner's checks.

**Checkpoint:**
- Fly in a straight line on the Ally X with no visible hitch.
- Compare frame rate and view distance before and after.

## M3.5: Natural generation (Q77 to Q100, D-028)

Added after the owner played 0.8.0: generation feels disjointed and random, the caves most of all. M3.5 comes after M3 and before M4; the number only marks its place. Two PRs, underground first, each ending in a checkpoint.

**M3.5a: the underground, rewritten (Q78 to Q88, Q97, Q99).** Done in 0.9.0 (D-029).
- **A planned cave-system generator** replaces the worm caves and the deep cavern noise. Each system is a trunk you can follow downward, with side branches and some loops back into the trunk (Q81). Passages meet only at real junctions and never cut through each other or partly through a chamber (Q82).
- **Much less open space, in fewer and bigger systems (Q80).** Digging through solid rock matters again.
- **Size grows with depth (Q79, Q84, Q86):** near the surface, passages mostly 3 to 6 wide, sometimes 2 to 4; deeper, grander and more open, down to vast halls, chasms and river gorges in the deep. No hard layer bands; each depth keeps its own stone, decoration and finds.
- **Chambers with shape (Q85):** smooth domed halls, tall rifts with wall ledges, stepped floors that descend toward water or the next exit, and natural pillars, stalactites, stalagmites and flowstone.
- **Ways between depths (Q83):** natural descents (steep passages, ramps, spiral drops), shafts and chasms, underground rivers that run downhill through the depths, and built ways (old stairs, mine inclines, ruined lifts).
- **Lava follows the water rule (Q87):** no floating lava; every lava block sits in sound rock. Lava only very deep (the Fire Below and deep vents). Lava falls where source and pool are both sound, and a few slow lava rivers in deep gorges feed the lava sea.
- **Entrances as often as now, better shaped (Q88):** about one way down within 80 to 90 blocks, mouths fitted to the hillside.
- **Re-attached to the new systems:** cave mouths, ruined stairways, points of interest, dungeon rooms, remains of other peoples, underground water (still in sound basins, D-024). Holds and their mines stay; natural systems reach their edges at a few places (Q99).
- **Tests:** connectivity (every chamber reachable from its system's trunk; every entrance reaches a system), no crossings that cut a chamber, open-space share within target by depth, sound water and sound lava (zero unsound blocks), streaming equality and determinism as before.
- **Mid-way checkpoint (Q100):** after the cave prototype, stop so the owner can play it before the rest of M3.5a is finished.

**M3.5a.2: noclip** (owner's request, before M3.5b). Done in 0.9.1 (D-030): a creative-mode toggle to fly through blocks.

**M3.5b: the surface (Q77, Q89 to Q96).** Done in 0.10.0 (D-031).
- **Rivers follow valleys** from the hills to the sea or a lake, with gentle banks; a short gorge with sloped sides only where a river meets high ground (Q89).
- **High Mountains as ranges:** ridgelines with fewer, grander peaks, valleys between them, walkable passes, cliffs only at crags and gorges (Q90).
- **Smooth with character:** small-scale roughness only where the land calls for it (moors, mountains, the Shadowed Forest) (Q91).
- **Wide blends between lands** over 50 to 100 blocks (Q92).
- **Placement that makes sense:** boulders and tors on moors, mountains and slopes only; fewer ruined stairways, fitted into hillsides; small ruins and walls grouped into places; nothing stray that belongs to no place or land (Q93). Barrows only on the Barrow Hills (and a few on neighbouring downs), in clusters along ridges and old roads, facing varied ways, in varied sizes, some broken open (Q94). Trees in groves and clearings, denser in valleys and by water (Q95). Surface ruins on strategic spots (towers on hilltops and ridges, keeps by rivers or passes, castles on high ground), with the ground shaped around them instead of a plinth (Q96).
- **Tests:** river bank height (no ravine walls above the water outside gorges), slope and roughness by land, border blend width, placement rules (no boulders outside their lands, barrow facing varies), plus the existing ones.

**Checkpoint (both parts, Q100):** a seed tour with coordinates for each cave system, river valley and mountain range to visit, and top-down height and cave maps of a large area before and after. Saves break (`SAVE_KEY` bump) in each part.

## M4: Survival and items

- **The metal ladder rebalanced (Q19):** wood, stone, copper, bronze, iron, steel, moonsilver, each strictly better. Gold and platinum become decoration, special tools, and later currency and magic ingredients (Q68).
- **The broader kit (Q18, Q66):** axe, shovel, shears, sickle, rope and grapnel (replacing the hook, Q45), ladders, pitons, compass, depth gauge, and a map item.
- **Storage (Q20, Q67):** craftable chests that keep items; world chests keep leftovers instead of vanishing; craftable pack upgrades; an equippable bag. Pack animals come in E1.
- **The worn lamp (Q36, Q65):** a belt-slot lantern that burns oil or candles. The always-on carried lamp goes away and deep layers get darker; torches still work in hand. Darkness stays atmosphere, not damage (Q13).
- **Earned fast travel (Q15, Q71):**
  - No free R respawn teleport in survival.
  - Attune ancient waystones by touch; craftable waystones cost a lot; travel only between attuned stones.
  - Free teleport stays in creative.
- **Signal flares replace fireworks (Q45).** The Blasting Keg keeps its role as a dwarven mining charge with one consistent name (Q44).
- **The Blueprint Tool becomes creative-only (Q42).**
- **Food (Q52):** more crops, simple cooking and foraging.
- **A small starting kit for new survival worlds (Q59).**
- **Tests:** content tables, recipes reachable from the start, tier ladder ordering, lamp fuel, waystone rules.

**Checkpoint:** start a new survival world on the Ally X and play from the starting kit to a steel pickaxe.

**Split (D-032):**
- **M4a, items (done in 0.11.0):** the metal ladder with axes and shovels, shears and the gold sickle, climbing gear (ladders, pitons, rope, the grapnel), map, compass and depth gauge, signal flares, the keg's name, the creative-only Blueprint Tool, the starting kit. Its checkpoint is the one above.
- **M4b, survival systems (done in 0.12.0):** storage (chests, world chests that keep leftovers, pack upgrades, the bag), the worn lamp and darker deeps, earned fast travel at waystones, food (crops, cooking, foraging). Checkpoint: attune two waystones and travel between them; light a deep cave with the worn lamp.

## M5: Controls and interface

- **Remapping (Q37):** better defaults (for example, teleport moves off D-pad up), and a rebinding screen for keyboard and controller built on the M1 action layer.
- **Context hints (Q38):** one-time hints on firsts (first ore, first hunger, first lectern, first waystone), and help rewritten per mode and device.
- **The HUD readout is on by default and can be turned off (Q39).**
- **Maps (Q40):** the minimap, an underground layer view at your depth, and a full explored world map saved with the world, with your own markers and discovered place names.
- **A world list screen** for the M1 save format, with export and import (Q30).
- **Creative upgrades (Q76):** a searchable block menu, larger brushes, fill and replace, a noclip spectator camera, teleport to coordinates, time and weather controls, and structure placement for testing.

**Checkpoint:** rebind a control on the Ally X; find a marker you placed on the world map after a reload.

**Split (D-036):**
- **M5a, controls and interface (done in 0.13.0):** rebinding with better defaults, context hints, help by mode and device, the readout switch, renaming worlds. Checkpoint: rebind a control on the Ally X.
- **M5b, maps and creative tools (done in 0.14.0):** the underground layer view, the explored world map with markers and place names, and the creative upgrades. Checkpoint: find a marker you placed on the world map after a reload.

## M6: Surface enrichment and new lands (Q101 to Q136, D-038)

Widened after the round-21 interview: M6 enriches every land and adds 30 new ones, so the surface stops feeling stale (Q101). Strong enrichment, the look mixed by land (gentle lowlands, wild highlands and coasts), and the M3.5b terrain kept in spirit but held to the same standard (Q102, Q103). One PR per part, each with a checkpoint played through a creative land tour (Q117, Q136). Keep 60 fps on the Ally X (Q135).

**Rules for every part:**
- **Transition map (Q108):** each land lists the lands it may border; no winter land next to a desert. Lands are chosen from climate, height, damp and region fields so the map holds everywhere.
- **Sizes and tiers (Q118):** common lands large, most new lands uncommon, the strange ones rare. No land smaller than 215 x 215 blocks (or the same area), and never narrower than 115 blocks. Existing land sizes are re-evaluated.
- **Signatures (Q124):** each land has a signature landmark structure and a signature natural feature; any one stretch of the land shows one of them, or neither in 40% of stretches where that keeps the land's identity.
- **Names (Q131):** each stretch of a land has its own name in the people's style ("Silverwood of Aelmere"), shown on arrival and on the world map.
- **Resources (Q130):** new woods, new stones, rare finds (useful later for magic), and wild food and dyes, by land.
- **Water (Q126, Q129):** streams, falls, rapids, springs and ponds are shaped still water that looks flowing: always sound, never floods or leaks.
- **Weather (Q127, Q128):** fog and mist, storms, dust and ash, and land-tinted skies, by land; still cosmetic; fog never closer than about 30 to 40 blocks.
- **No cracks (Q137):** a cut into the land is a gorge you can see into and climb down: at least 5 blocks across at the floor and 12 or more at the top, walls stepping back in ledges, ends sloping out. Gorges are fewer than today's ravines and keep their job as ways down (about a third reach the caves). Lands may have more (Karst Crags, Fjords) or none (meadows, farmland). Tested: no ravine column narrower than 7 blocks at the surface.

**Parts (Q117, Q133):**
- **M6a, groundwork (done in 0.15.0, D-039; land list awaiting approval):** two bytes per block in the world (Q120); a land system (registry, transition map, tiers, minimum sizes); land names; a creative land tour; the land list and transition map as a document with a map picture for the owner to approve before any family is built (Q134). Existing lands keep their look, except for the ravines (Q137): the hairline cracks become proper gorges.
- **M6b, forests (done in 0.16.0, D-040):** Autumn Woods, Birch Glades, Pine Highlands, Ancient Giant Wood, Willow Vales (the Fens rework into them, Q119), Yew Wood, Silverwood. New woods.
- **M6c, highlands and cold (done in 0.17.0, D-041):** Alpine Meadows, Glacier Fields, Cloud Forest Heights, Karst Crags (sinkholes into the caves, Q132), Frozen Tundra (the Northern Fells rework into it); enrich the High Mountains; mountain waterfalls.
- **M6d, coasts and waters (done in 0.18.0, D-042):** Chalk Cliffs, Rocky Isles, Fjords, Black Sand Shores, Kelp Shallows, Raised Bogs; enrich the Western Sea, Grey Shore and Lake.
- **M6e, dry and fiery (done in 0.19.0, D-043):** Southern Drylands (the kept desert blocks), Golden Steppe (the Windswept Plains rework into it), Volcanic Wastes (a hotter deep below, lava sound), Blighted Lands.
- **M6f, strange lands (done in 0.20.0, D-044):** Crystal Barrens, Glowcap Hollows, Petrified Forest, Starfall Craters (rare finds); rare tier.
- **M6g, old lands of men (done in 0.21.0, D-045):** Overgrown Farmland, Wild Orchards, Flower Meadows, Old Terraces; small structures (bridges, farmsteads, shrines and cairns, abandoned camps, beacon hills, mills and jetties, chapels and graveyards, dykes and boundary walls).
- **M6h, ruins, water and weather (done in 0.22.0, D-046):** 3 to 5 layouts each for watchtowers, keeps and castles, varied by size, decay and facing (Q122); hillside streams, river falls and rapids, springs and ponds everywhere; weather and skies by land; land-flavoured caves near the surface (Q132); enrichment (plants, landmarks, tree variety, small finds) for any old land not yet reached (Q121).

**Checkpoint (each part):** take the creative land tour through the part's lands on the Ally X.

## M7: Lore and chronicles (done in 0.23.0, D-047)

- **Hold chronicles (Q27):** each hold has an ordered history (founding, prosperity, the fall, or the present day for inhabited holds), drafted for owner approval (Q28).
- **The journal:** collects pages in order as you read them. Rune Tablets become readable.
- **The discovery log (Q17):** lands, layers, holds, remains and relics found. The game still works with no goal at all.
- **Names for every people** in the naming module, so places from other peoples read consistently (Q26).

**Checkpoint:** read three pages in one hold and see them ordered in the journal.

## M8: Audio (last, Q62; done in 0.24.0, D-048)

- Ambient soundscapes by land and layer (Q57).
- Volume sliders: master, effects, ambience.
- Positional sound.
- No music.

**Checkpoint:** walk from a forest into a cave on the Ally X with headphones.

## Expansion phases

These are planned now so refinements leave room for them.

- **E1 Wildlife (Q47, Q48, Q63).**
  - Built on the M1 entity registry.
  - Animals for atmosphere, resources (wool, milk, eggs, hides), hunting for food, mounts, companions and pack animals (Q67).
- **E2 Settlements and peoples (Q4, Q5, Q11, Q26, Q46).**
  - Inhabited places: hamlets, camps, travelers, inhabited dwarven holds.
  - Peoples: dwarves, humans, halflings, gnomes, goblins, orcs, wood elves, drow, high elves, beastfolk and more.
  - Orcs and goblins are neutral, not violent; hostility is revisited later.
  - NPC trading brings coins back (Q7, Q68), and NPCs give quests (Q17).
  - New worlds start near a settlement with the starting kit (Q59).
  - Built on the M2 roads, keeps and gates.
- **E3 Building and furniture (Q51).** Stairs, slabs, fences, doors, windows, roof shapes, timber framing; beds that set spawn; tables and workstations; crafting stations (anvil, loom, carpenter's bench); banners, carpets, signs and other decoration.
- **E4 Magic (Q49).** Player magic: runes, enchanting, spells. Gold and platinum become ingredients (Q68).
- **E5 New lands (Q23).** For example a desert; more to be chosen.

The order of E2 to E5 is not yet decided; confirm it before E1 ends.
