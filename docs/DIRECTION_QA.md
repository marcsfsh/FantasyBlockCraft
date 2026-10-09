# Direction interview (2026-10-08)

The owner's answers to 76 questions about where Fantasy BlockCraft goes next. They were asked after a full read of the code, before any refinement work. This file is the record; `docs/MILESTONES.md` turns it into a build order. When a later decision changes one of these answers, log it in `docs/DECISIONS.md` and note it here under the question.

Answers are quoted or closely paraphrased from the owner. Where the owner typed their own answer, it is quoted as written, apart from obvious typos.

## Summary

- **The game:** a Minecraft-style game in a medieval fantasy world, not unlike Tolkien or a typical tabletop fantasy setting. It is private, for the owner only. Single player, always.
- **Balance:** an equal mix of exploration, survival and building.
- **Platforms:** ROG Ally X and desktop first. Phone play is casual: keep touch working, but it does not need dedicated testing.
- **Setting:** a dwindling age, much like Tolkien's late Third Age. There are ancient ruins and long-abandoned places, but also lived-in settlements, camps and travelers. "Long abandoned" is no longer the default.
- **Creatures:** peaceful only, for now. Wildlife comes first. Orcs and goblins are neutral rather than violent, and hostility will be revisited later.
- **Dwarven holds:** rare and vast structures that spawn, not a layer under the whole world. Some holds are inhabited. Mines spread out from holds.
- **Survival:** gentle. Death and hunger stay forgiving. Fast travel must be earned.
- **Saves:** always break when needed. Updates take precedence 100% of the time.
- **Process:** bugs first, then foundations, then refinement milestones, with milestone-sized PRs reviewed at each milestone checkpoint.

## Round 1: what the game is

**Q1. What should the heart of the game be?**
Options: exploration and discovery; survival challenge; building sandbox; equal mix.
**Answer:** Equal mix.

**Q2. Which device should the game feel best on?**
Options: ROG Ally X; desktop PC; phone or tablet; all equally.
**Answer:** "ROG Ally X and Desktop; touch controls aren't totally necessary to be strictly tested BUT i do like playing it on my phone when im bored. this game is private for me only"

**Q3. Should the world ever have living creatures?**
Options: yes, eventually; yes, soon; wildlife only; never.
**Answer:** "Peaceful creatures only (whether animals or humanoids or other)"

**Q4. How strict is the "long abandoned" pillar about people?**
Options: no living people ever; rare wanderers allowed; small survivor camps later.
**Answer:** "More on this later. I do want this to not be an entirely wilderness-only world. there will be settlements, encampments, travelers, etc."

Background the owner added: "this is (obviously) a minecraft knock-off game meant to take place in a medieval fantasy world, not unlike tolkien or a stereotypical DnD setting."

## Round 2: setting and leftovers

**Q5. With settlements, camps and travelers coming, how should "long abandoned" be reframed?**
Options: ancient past with a sparse present; recovering frontier; mostly empty with rare outposts.
**Answer:** "'long abandoned' is no longer the default assumption. dwarven ruins no longer span the entire underground/below ground world but rather, like other settlements, they can spawn. It is not unlike the late Third Age of tolkien, where the once high fantasy world has been dwindling away (in a sense, not as a default rule of thumb). There are certainly ancient ruins and long abandoned structures, settlements, etc. but also lived in and actively used ones."

**Q6. What should happen to the disabled town and road generator (`legacy/towns.js`, `roads.js`)?**
Options: delete now, rebuild later; keep and repurpose later; look at it first.
**Answer:** Delete now, rebuild later.

**Q7. Trading counters, coin mints and coins can be crafted in survival. What should happen to trading?**
Options: remove now, return with NPCs; keep coins, remove the blocks; keep everything.
**Answer:** Remove now, return with NPCs.

**Q8. Ruins contain lit lanterns, torches and glowstone after centuries. How should old light sources look?**
Options: mostly dead with a few eerie ones; all dead; keep as is.
**Answer:** Mostly dead, a few eerie ones (rare magical lights such as glowing runes, crystals and fungi remain).

## Round 3: dwarven holds and the deep

**Q9. How big and how common should a dwarven hold be?**
Options: rare and vast; medium and regular; mixed sizes.
**Answer:** Rare and vast. A hold is a major discovery, several hundred blocks across and a few thousand blocks apart.

**Q10. What fills the deep layers where there is no hold?**
Options: natural deep caves; other civilisations' ruins; mostly solid rock.
**Answer:** "sometimes there can be other civilisations (im thinking goblins, gnomes, etc) but more often - natural, deep caves (sometimes with leftover remains of when the aforementioned civilisations settled into them)"

**Q11. Should some dwarven holds be lived in today?**
Options: yes, some are inhabited; ruins only for dwarves; decide later.
**Answer:** Yes, some are inhabited.

**Q12. Should the dwarven mines stay an everywhere layer?**
Options: tied to holds; separate mining sites; keep as a layer.
**Answer:** Tied to holds. Mines spread out from each hold and fade with distance.

## Round 4: survival rules

**Q13. With peaceful creatures only, where should survival danger come from?**
Options (several allowed): environment; darkness; hunger and supplies; keep it gentle.
**Answer:** Keep it gentle.

**Q14. Should survival and creative stay freely switchable mid-world?**
Options: chosen per world with a cheat toggle; free switching with separate inventories; keep as is.
**Answer:** Keep as is.

**Q15. How should fast travel work in survival? Today R teleports to spawn and waypoints teleport for free.**
Options: earned fast travel; creative only; keep as is.
**Answer:** Earned fast travel. There is no free respawn key. Waystones must be found or built at a cost and only link to each other.

**Q16. How punishing should death and hunger be?**
Options: keep gentle; moderate; harsh; difficulty setting.
**Answer:** Keep gentle. Starvation stops at 1 HP and graves keep everything; only the related bugs get fixed.

## Round 5: progression

**Q17. What should give a survival world long-term direction?**
Options (several allowed): discovery log; lore chronicle; quests from NPCs later; no goal needed.
**Answer:** All four: discovery log, lore chronicle, quests from NPCs later, and no goal needed. In the owner's words: "'no goal needed' chosen because even though i selected the other answers, you can still play with no goal needed".

**Q18. Should the tool set grow beyond pickaxes and a hoe?**
Options: add axe and shovel; pickaxe only; broader kit.
**Answer:** Broader kit (see Q66 for the list).

**Q19. How should metals progress, given the current tier oddities?**
Options: rebalance into a clean ladder; fix the obvious bugs only; simplify.
**Answer:** Rebalance into a clean ladder: wood, stone, copper, bronze, iron, steel, moonsilver, each strictly better. Gold and platinum become special-purpose metals (see Q68).

**Q20. What should storage look like?**
Options: craftable chests; chests plus a pack; not needed.
**Answer:** Chests plus a pack (see Q67).

## Round 6: the world below and above

**Q21. What should the bottom of the world be?**
Options: build the lava sea; rare lava lakes; leave as is.
**Answer:** Build the lava sea.

**Q22. How should the surface connect to the deep world?**
Options: findable entrances; more open caves; keep sealed.
**Answer:** Findable entrances. Caves stay mostly sealed, but there are discoverable cave mouths, ravines that reach caves, ruined stairways and hold gates.

**Q23. Which surface refinements matter most?**
Options (several allowed): enrich thin lands; vary repeated structures; new lands later; rivers and water.
**Answer:** All four.

**Q24. What should happen to the dungeon rooms (20% of chunks, identical, often unreachable)?**
Options: rarer, varied, reachable; remove them; keep as is.
**Answer:** Rarer, varied and reachable.

## Round 7: names and lore

**Q25. How should names be fixed? The generator can produce real Tolkien names such as Durin, Thrain and Mordor.**
Options: new syllables plus a blocklist; blocklist only; hand-written lists.
**Answer:** New syllables plus a blocklist, with a test that fails if any generated name matches a Tolkien name.

**Q26. Should each people get its own naming style, set up now?**
Options: yes, a name system per people; only dwarven for now.
**Answer:** "Yes. and your list (goblins, gnomes, humans) is not all encompassing. there shall be orcs, halflings, elves (wood, drow, high), beastfolk, etc."

**Q27. How should lore work?**
Options: chronicles you collect; more templates; world history.
**Answer:** Chronicles you collect. Each hold has an ordered chronicle; pages you read go into a journal in order.

**Q28. Who writes lore and setting text?**
Options: Claude drafts, owner approves; owner supplies; case by case.
**Answer:** Claude drafts in the docs, and the owner reviews and edits in PRs.

## Round 8: saves

**Q29. Are there saved worlds to keep?**
Options: no, retire them; keep what can be kept; yes, one I care about.
**Answer:** "No, and let me be clear: saves will never outweigh updates. Updates take precedent 100% of the time. The assumption is that saves will probably break with each update."

**Q30. What should world management look like?**
Options: multiple worlds plus export; multiple worlds only; export and import only.
**Answer:** Multiple worlds plus export and import to a file.

**Q31. How should save-breaking changes be released?**
Options: batch them; whenever needed; keep old versions playable.
**Answer:** Whenever needed.

**Q32. Should saves store only player changes?**
Options: player changes only; keep everything.
**Answer:** Player changes only, plus the minimum needed to restore water, farms and similar state.

## Round 9: performance and look

**Q33. What frame rate should the Ally hold, including while terrain streams?**
Options: steady 60; 30 locked; as high as possible.
**Answer:** As high as possible.

**Q34. How far should you see on the surface?**
Options: further than now; about the same; scale by device.
**Answer:** Scale by device.

**Q35. What visual direction for the procedural pixel art?**
Options: keep the style and add life; upgrade texture art; hand-made texture files; leave alone.
**Answer:** Keep the style and add life: animated water and lava, better clouds, moon phases, swaying plants, glow on emitters.

**Q36. Which lighting refinements?**
Options (several allowed): proper sky light spread; darker deep layers with a lamp item; shadows or sun rays; keep current.
**Answer:** Proper sky light spread, and darker deep layers. "You should be able to affix a lamp item to your person so you dont have to wield it in place of your tool." (See Q65.)

The owner also asked here for at least 24 more questions, and for all questions and answers plus a build order and milestone sheet to be committed at the end.

## Round 10: controls and interface

**Q37. Should controls be remappable?**
Options: remappable with an action layer; better defaults only; keep as is.
**Answer:** "better defaults + remappable"

**Q38. How should the survival systems be taught?**
Options: context hints; better help panel only; guide book item.
**Answer:** Context hints: short one-time hints when something first happens, plus an updated help panel.

**Q39. What should the HUD show by default (fps and XYZ are always on today)?**
Options: clean with a debug toggle; keep coordinates, hide fps; keep as is.
**Answer:** "On by default, can be toggled off"

**Q40. What should the map become?**
Options: explored world map; minimap plus layer view; map items; keep as is.
**Answer:** "minimap plus layer view plus explored world map"

## Round 11: off-theme content

**Q41. Which off-theme items should be removed or reworked?**
Options (several allowed): power blocks entirely; fireworks and grappling hook; desert blocks; rails and minecarts.
**Answer:** Power blocks entirely; fireworks and grappling hook; rails and minecarts. Desert blocks were not chosen, so they stay (useful for a future desert land).

**Q42. What should happen to the Blueprint Tool?**
Options: creative-only tool; keep in both modes; remove.
**Answer:** Creative-only tool.

**Q43. Keep ore processing (crusher, gold pan, sluice)?**
Options: keep and retheme; keep as is; remove.
**Answer:** Remove. Ore smelts directly.

**Q44. Does the Blasting Keg fit the setting?**
Options: keep as a dwarven mining charge; replace with magic; remove.
**Answer:** Keep as a dwarven mining charge, named consistently (the HUD still says TNT).

## Round 12: rework, peoples and animals

**Q45. Remove the fireworks, hook and rails outright, or rework them?**
Options (several allowed): hook becomes rope and grapnel; fireworks become signal flares; rails become old cart tracks; remove all three.
**Answer:** The hook becomes a rope and grapnel; fireworks become signal flares. Rails were not chosen for rework, so they are removed.

**Q46. How do traditionally hostile peoples such as orcs and goblins fit, with peaceful creatures only?**
Options: all peoples peaceful; neutral, not violent; revisit hostility later.
**Answer:** "neutral, not violent. and we will revisit hostility later in development"

**Q47. Which living things come first?**
Options: wildlife first; people first; both together.
**Answer:** Wildlife first.

**Q48. What role should animals have?**
Options (several allowed): atmosphere; resources; hunting for food; mounts and companions.
**Answer:** All four.

## Round 13: future systems

**Q49. Should the game ever have magic?**
Options: low, ancient magic; player magic later; no magic.
**Answer:** Player magic later.

**Q50. Will the game ever be multiplayer?**
Options: no, single player always; maybe someday; yes, planned.
**Answer:** No, single player always.

**Q51. Which building and crafting depth matters most?**
Options (several allowed): more building blocks; functional furniture; crafting stations; decoration.
**Answer:** All four.

**Q52. Should food and cooking grow?**
Options: moderate variety; deep cooking; keep minimal.
**Answer:** Moderate variety: more crops, simple cooking, foraging.

## Round 14: how the work runs

**Q53. When should the foundation refactors happen?**
Options: foundations first; interleave; content first.
**Answer:** Foundations first.

**Q54. How big should each pull request be?**
Options: small and focused; milestone-sized; mixed.
**Answer:** Milestone-sized.

**Q55. How should the owner be involved while milestones are built?**
Options: review each PR and merge on request; merge small fixes freely; checkpoint per milestone.
**Answer:** Checkpoint per milestone.

**Q56. When should known issues be fixed?**
Options: all bugs first; critical only first; alongside.
**Answer:** All bugs first.

## Round 15: sound, weather, start, physics

**Q57. What should audio become?**
Options (several allowed): ambient soundscapes; procedural music; volume controls; positional sound.
**Answer:** Ambient soundscapes, volume controls and positional sound. No music.

**Q58. Should weather and seasons matter?**
Options: fix and enrich, still cosmetic; weather affects play; add seasons.
**Answer:** Fix and enrich, still cosmetic.

**Q59. What should a new survival world start you with?**
Options: empty-handed in the wild; near a settlement later; small starting kit.
**Answer:** "small starting kit, near a settlement (once settlements exist)"

**Q60. Should blocks behave more physically?**
Options: keep it simple; cave-ins underground; structural building.
**Answer:** Keep it simple. Only sand and gravel fall.

## Round 16: build order

**Q61. After bugs and foundations, which refinement milestone comes first?**
Options: world restructure; survival and items; performance and visuals; controls and interface.
**Answer:** World restructure.

**Q62. Which refinement area comes last?**
Options: audio; surface enrichment; lore and names; controls and interface.
**Answer:** Audio.

**Q63. Which future feature does the first expansion phase deliver?**
Options: wildlife; settlements and peoples; building and furniture; magic.
**Answer:** Wildlife.

**Q64. Done with questions?**
**Answer:** "12 more questions - you pick"

## Round 17: survival details

**Q65. How should the worn lamp work?**
Options: belt slot with fuel; belt slot without fuel; off-hand slot.
**Answer:** Belt slot, needs fuel. A lantern in an equipment slot burns oil or candles slowly; torches still work in hand.

**Q66. Which tools belong in the broader kit?**
Options (several allowed): axe and shovel; shears and sickle; climbing gear (rope and grapnel, ladders, pitons); navigation (compass, depth gauge, map item).
**Answer:** All four.

**Q67. How should extra carrying capacity work?**
Options: craftable pack upgrades; equippable bag item; pack animal later.
**Answer:** "all of the above."

**Q68. What should gold and platinum be for?**
Options (several allowed): decoration and building; currency later; magic later; special tools.
**Answer:** All four.

## Round 18: world restructure details

**Q69. Keep the 384-block height and the layers?**
Options: keep 384 and the layers; taller world; revisit layers.
**Answer:** Taller world (see Q73).

**Q70. Besides dwarven holds, which underground civilisation remains should appear first?**
Options (several allowed): goblin warrens; gnome workshops; drow halls; older, nameless ruins.
**Answer:** All four.

**Q71. How should earned fast travel work?**
Options: find and attune ancient waystones; build your own; both.
**Answer:** Both: ancient waystones in the world, plus craftable ones at a high cost.

**Q72. Which surface structures should the restructure prepare, so later settlements fit?**
Options (several allowed): old roads and paths; ruined surface keeps; hold gates on the surface; reserved settlement sites.
**Answer:** Old roads and paths; ruined surface keeps; hold gates on the surface. Reserved settlement sites were not chosen.

## Round 19: final details

**Q73. How should the extra height be spent?**
Options: 512 tall with more sky; 512 split above and below; much taller with vertical chunks.
**Answer:** 512 tall, more sky. The extra 128 blocks go above ground for taller mountains; the underground keeps its depth.

**Q74. In what order should the middle milestones go?**
Options: survival, performance, controls, surface, lore; performance, survival, controls, surface, lore; survival, lore, surface, performance, controls; Claude decides.
**Answer:** Performance, survival, controls, surface, lore (audio last, per Q62).

**Q75. How much should phone and touch play be maintained?**
Options: keep it working, untested; best effort; full parity.
**Answer:** Keep it working, untested. New actions get a touch control and layouts must not break.

**Q76. Should creative mode get its own refinements?**
Options: light upgrades; keep as is; world-editing tools.
**Answer:** "world editing tools and light upgrades." Light upgrades: a searchable block menu, larger brushes, fill and replace. World-editing tools: noclip spectator camera, teleport to coordinates, time and weather controls, structure placement for testing.

## Round 20: natural generation (2026-10-09, after playing 0.8.0)

The owner's feedback before the round: the procedural generation "feels disjointed, random, and less like a natural landscape/underground and more like a glitched out computer generation. sometimes there are areas that look nice, but especially underground - cave generation is so chaotic and has absolutely no flow to it." This round planned M3.5, which comes after M3 and before M4.

**Q77. On the surface, what looks most like glitched generation?**
Options (several allowed): bumpy small-scale noise; odd cliffs and chunks; land borders; placement of things.
**Answer:** All four, and: "Rivers often cut through tall landscape like a ravine - sometimes 20-30 blocks of a ravine cliff before water level. barrow downs all face the same way. there's weird stone structures all over multiple woodland and grassland biomes. mountainous biomes are way too chaotic."

**Q78. Underground, what makes the caves feel chaotic?**
Options (several allowed): too many tunnels; no direction; ugly shapes; layers don't connect.
**Answer:** All four, and: "totally disjointed. lava has the same issue that we addressed earlier with water. cave's are intersected many times, lead to nowhere too often, and it usually just feels like im trying to find the next open area of the cave by going trough a maze of massive rooms with tunnels that partially cut through them. its extremely noisy, they have no flow or structure in practice."

**Q79. Which picture is closest to the underground you want?**
Options: real cave systems; modern Minecraft caves; mix by depth; fantasy epic.
**Answer:** Fantasy epic, mixed by depth: tight natural passages near the surface, grander and more open the deeper you go.

**Q80. How much open space should the underground have compared to now?**
Options: much less, bigger; about the same; less near the surface; more.
**Answer:** Much less open space, in fewer, bigger and more connected systems.

**Q81. How should one cave system be laid out?**
Options: trunk and branches; chain of chambers; network with loops.
**Answer:** Trunk and branches, with some loops: a main passage to follow down, side branches, and passages that rejoin.

**Q82. Should cave tunnels ever cross each other?**
Options: only real junctions; rarely; never.
**Answer:** Only at real junctions. Passages never slice through each other or partly through a chamber.

**Q83. How should you travel from one depth to the next?**
Options (several allowed): natural descents; shafts and chasms; rivers lead down; built ways.
**Answer:** All four.

**Q84. How tight should the shallow caves be?**
Options: 2 to 4 wide; 1 to 2 wide; 3 to 6 wide.
**Answer:** "mostly 3-6 wide, sometimes 2 to 4 wide".

**Q85. What should the big chambers look like?**
Options (several allowed): smooth domed halls; tall rifts; stepped floors; pillars and formations.
**Answer:** All four.

**Q86. Should the depth layers stay as distinct bands?**
Options: blend, keep character; keep distinct bands; fewer layers.
**Answer:** Blend: cave size and style change gradually with depth, and each depth keeps its own stone, decoration and finds.

**Q87. How should underground lava behave?**
Options (several allowed): same rule as water; lava only very deep; lava falls allowed; lava rivers.
**Answer:** All four. No floating lava: every lava block sits in sound rock like underground water. Lava only very deep (the Fire Below and deep vents). Lava falls are allowed where the source and the pool are both sound. A few slow lava rivers in deep gorges feed the lava sea.

**Q88. How often should you find a cave entrance on the surface?**
Options: rare and obvious; same as now, better looking; common.
**Answer:** Same as now (about one way down within 80 to 90 blocks), better looking and shaped to fit the land.

**Q89. How should rivers fit the land?**
Options: follow valleys; shape the valleys; fewer, bigger rivers.
**Answer:** Follow valleys: rivers run along the low ground from hills to the sea or a lake, with gentle banks. A gorge only where a river meets high ground, short and with sloped sides.

**Q90. What should the High Mountains look like?**
Options (several allowed): ridges and valleys; fewer, grander peaks; walkable passes; cliffs only in places.
**Answer:** All four.

**Q91. How strong should the small-scale bumpiness of the ground be?**
Options: smooth with character; very smooth; keep per land, tone down.
**Answer:** Smooth with character: mostly smooth slopes, roughness only where the land calls for it (rocky moors, mountains, the hummocky Shadowed Forest).

**Q92. How should neighbouring lands meet?**
Options: wide gradual blend; natural edges; both.
**Answer:** A wide gradual blend over 50 to 100 blocks.

**Q93. What should happen to the stray stone structures in woods and grassland?**
Options (several allowed): boulders and tors; ruined stairways; small ruins and walls; remove the random ones.
**Answer:** All four. Boulders and tors only on moors, mountains and slopes (rare elsewhere). Ruined stairways rarer and fitted into hillsides. Small ruins and walls fewer and grouped into places that make sense. Anything that does not belong to a named place or a land's character goes.

**Q94. How should barrows and stone rings be placed?**
Options (several allowed): varied facing; grouped in clusters; varied sizes; only on Barrow Hills.
**Answer:** All four.

**Q95. How should trees and plants be spread?**
Options: groves and clearings; even spread; land-specific patterns.
**Answer:** Groves and clearings: denser in valleys and by water, thinner on ridges and slopes.

**Q96. Should surface ruins be placed with more sense?**
Options (several allowed): strategic spots; level the site naturally; keep as is.
**Answer:** Strategic spots (towers on hilltops and ridges, keeps by rivers or passes, castles on high ground, never in a hollow), and the ground shaped around them so they sit in the land rather than on a plinth.

**Q97. How far should M3.5 go with the cave generator?**
Options: rewrite from scratch; rework in place; rewrite underground, rework surface.
**Answer:** Rewrite from scratch: a planned cave-system generator (trunks, chambers, junctions, descents), with mouths, places, remains and water re-attached to it.

**Q98. Which half comes first?**
Options: underground first; surface first; one PR.
**Answer:** Underground first. M3.5a is the underground, M3.5b the surface.

**Q99. What happens to the dwarven holds and their mines?**
Options: keep, connect better; keep untouched; revisit them too.
**Answer:** Keep them, and let natural cave systems reach their edges at a few places so they can be found from below.

**Q100. How should the owner check the result?**
Options (several allowed): screenshots in the PR; seed tour; map images; checkpoint mid-way.
**Answer:** A seed tour (coordinates for each cave system, river valley and mountain range to visit), top-down height and cave maps of a large area before and after, and a checkpoint mid-way: stop after the cave prototype so the owner can play it before the rest is finished.

## Round 21: surface enrichment and new lands (2026-10-09, after 0.14.0)

Asked before planning M6. The owner widened M6 from enriching the thin lands to adding many new lands, with a transition map so neighbours make sense.

**Q101. Which parts of M6 matter most?**
Options (several allowed): enrich thin lands; vary structures; streams and waterfalls; weather by land.
**Answer:** All four, and "New biomes. the current biomes lack variety, uniqueness, and feel stale."

**Q102. How much should the surface change?**
Options: strong enrichment; light polish; dramatic rework.
**Answer:** Strong enrichment: every land gets clear features of its own and a walk feels new; the M3.5b terrain shapes stay in spirit, but are brought up to the same standard as the rest of the milestone.

**Q103. What overall look should the surface aim for?**
Options: natural and muted; storybook; epic and dramatic; mixed by land.
**Answer:** Mixed by land: gentle lowlands, wild and dramatic highlands and coasts.

**Q104. Should new lands come in M6?**
Options: later, as planned; one new land; several new lands.
**Answer:** Several new lands.

**Q105. New lands, first set.**
Options (several allowed): Southern Drylands; Autumn Woods; Birch Glades; Pine Highlands.
**Answer:** All four.

**Q106. New lands, second set.**
Options (several allowed): Blighted Lands; Chalk Cliffs; Rocky Isles; Karst Crags.
**Answer:** All four.

**Q107. How many new lands in total?**
Options: 3 to 4; 5 to 6; all picked.
**Answer:** All picked, and at least two more rounds of options to add.

**Q108. Where should lands sit relative to each other?**
Options: climate logic; loose mix; themed regions.
**Answer:** "A 'transition map' needs to be created. I wouldn't expect a winter biome next to a desert one, for example. This transition map will label what each biome can be connected to."

**Q109. More lands, waters and wetlands.**
Options (several allowed): Saltmarsh Estuary; Misty Glens; Raised Bogs; Tidal Flats.
**Answer:** Raised Bogs.

**Q110. More lands, high ground.**
Options (several allowed): Alpine Meadows; Glacier Fields; Red Canyons; Tablelands.
**Answer:** Alpine Meadows and Glacier Fields, and something else (asked in Q114).

**Q111. More lands, forests.**
Options (several allowed): Ancient Giant Wood; Willow Vales; Yew Wood; Silverwood.
**Answer:** All four.

**Q112. More lands, open wilds.**
Options (several allowed): Golden Steppe; Volcanic Wastes; Frozen Tundra; Boulder Fields.
**Answer:** Golden Steppe, Volcanic Wastes and Frozen Tundra.

**Q113. More lands, coasts and seas.**
Options (several allowed): Fjords; Dune Coast; Black Sand Shores; Kelp Shallows.
**Answer:** Fjords, Black Sand Shores and Kelp Shallows.

**Q114. More lands, other high ground.**
Options (several allowed): Basalt Highlands; Granite Peaks; Cloud Forest Heights; Scree Slopes.
**Answer:** Cloud Forest Heights.

**Q115. More lands, strange places.**
Options (several allowed): Crystal Barrens; Glowcap Hollows; Petrified Forest; Starfall Craters.
**Answer:** All four.

**Q116. More lands, old lands of men.**
Options (several allowed): Overgrown Farmland; Wild Orchards; Flower Meadows; Old Terraces.
**Answer:** All four.

**Q117. How should 30 new lands roll out?**
Options: families, one PR each; favourites first; all at once.
**Answer:** Families, one PR each: groundwork first, then one PR per family, each with its own checkpoint.

**Q118. How big and how common should each land be?**
Options: tiers; all smaller; bigger world, same sizes.
**Answer:** Tiers, and re-evaluate the sizes of the existing lands. "No land/biome should be smaller than 215x215 blocks (or equivalent area; but not narrower than 115 blocks at any point)."

**Q119. Where new lands overlap old ones (Golden Steppe and Windswept Plains, Willow Vales and Fens, Frozen Tundra and Northern Fells)?**
Options: rework old into new; keep both and sharpen; case by case.
**Answer:** Rework the old land into the new one.

**Q120. The world stores each block in one byte with about 130 block types free. How to handle it?**
Options: two bytes per block; be frugal; tinted blocks.
**Answer:** Two bytes per block.

**Q121. What should enrichment add to the existing lands that stay?**
Options (several allowed): plants and ground; landmarks; tree variety; small finds.
**Answer:** All four.

**Q122. How should the named ruins (watchtowers, keeps, castles) vary?**
Options: several layouts each; procedural; both.
**Answer:** Several hand-designed layouts per kind (3 to 5), each also varied by size, decay and facing.

**Q123. Which new small surface structures?**
Options (several allowed): bridges; farmsteads; shrines and cairns; abandoned camps.
**Answer:** All four, and "I bet you could think of 3-4 more" (asked in Q125).

**Q124. Should each new land have its own landmark?**
Options: one signature each; only some lands; none.
**Answer:** Each land gets both a signature landmark structure and a signature natural feature. In any one stretch of the land, either one of them appears, or, where that is practical and keeps the land's identity, a 40% chance of neither.

**Q125. More small structures.**
Options (several allowed): beacon hills; mills and jetties; chapels and graveyards; dykes and boundary walls.
**Answer:** All four.

**Q126. Streams and waterfalls.**
Options (several allowed): hillside streams; mountain waterfalls; river falls and rapids; springs and ponds.
**Answer:** All four.

**Q127. Weather by land (still cosmetic).**
Options (several allowed): fog and mist; storms; dust and ash; land-tinted skies.
**Answer:** All four.

**Q128. How thick should fog get at its worst?**
Options: moody but playable (30 to 40 blocks); thick (12 to 20); light (60 or more).
**Answer:** Moody but playable.

**Q129. Moving water or shaped still water for streams and falls?**
Options: shaped, looks flowing; truly flowing; both.
**Answer:** Shaped still water that looks flowing: always sound, never floods or leaks.

**Q130. Should new lands bring new resources?**
Options (several allowed): new woods; new stones; rare finds; food and dyes.
**Answer:** All four.

**Q131. How should lands be named in-game?**
Options: land plus place name; land type only; mixed.
**Answer:** Land plus place name, in the people's naming style, shown on arrival and on the map.

**Q132. Should new lands reach underground?**
Options (several allowed): karst and sinkholes; volcanic depth; land-flavoured caves; surface only.
**Answer:** Karst and sinkholes, volcanic depth, and land-flavoured caves.

**Q133. Which family comes first after the groundwork?**
Options: forests; highlands and cold; coasts and waters; dry, fiery and strange.
**Answer:** Forests.

**Q134. Approve the land list and transition map before building?**
Options: yes, in M6a; draft now; no.
**Answer:** Yes, in M6a: the transition map and land list (families, sizes, tiers) as a document with a map picture, approved before the families are built.

**Q135. How much speed may richer lands cost on the Ally X?**
Options: keep 60 fps; some cost; looks first.
**Answer:** Keep 60 fps, cutting detail or view distance automatically where needed.

**Q136. How should each family be checked?**
Options (several allowed): land tour in creative; map pictures; screenshot tour; seed and coordinates.
**Answer:** A land tour in creative: a pause-menu list of lands that takes the player to the nearest of each.

**Q137. (Owner's note after the interview, with a screenshot near X 9, Z -599 in the Barrow Hills.)**
**Answer:** "Something else to address in M6, I keep seeing these cracks in the landscape." They are the M2b ravines (`terrain.js`, the `rvBot` noise line): on seed 123456789 about 0.28% of land columns, half of them 1 block wide and nine in ten 3 or less, with a median depth of 27 and a deepest of 66. Planned for M6a: fewer, wider gorges with stepped walls and sloping ends, still ways down (D-038).
