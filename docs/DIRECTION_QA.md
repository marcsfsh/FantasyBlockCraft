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
