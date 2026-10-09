# Changelog

All notable changes to Fantasy BlockCraft. Newest first. Versions follow `package.json`.
Entries are grouped under **Game** (anything a player would notice) and **Tooling** (build, tests, CI, docs).

## Unreleased

## 0.15.0 (2026-10-09): M6a, lands groundwork

Old saves do not load: the world is generated anew, and the save key is now `fantasy-blockcraft-save-v10`.

### Game
- **A new map of lands.** The world is laid out from a registry of 37 lands in seven families, on a transition map that keeps unlikely neighbours apart (no winter land beside a desert). Common lands now stretch over several hundred blocks, and no land is smaller than 215 x 215 blocks. The old lands keep their looks; lands still to be built (forests in M6b, and so on) show as an old land until their family arrives, so their places will not move. See `docs/LANDS.md`.
- **Names for every stretch of land,** in the style of a people ("Elder Wood of Lirwen", "The Sea of Randbert"), shown when you arrive and written faintly on the world map.
- **Gorges in place of the cracks.** The hairline ravines (1 to 3 blocks wide, up to 66 deep) are gone. Gorges are about a third as many, at least 7 blocks wide at the floor, step back in ledges of 5 to a rim 16 to 40 across, and run up to about 60 deep; the deepest still reach the caves. None cut beside water or the sea.
- **New worlds start on open land** of an old land near the middle of the world (a cell of Green Hills, Elder Wood, the moors or the like), never at sea.
- **Retired saves are cleared** from browser storage when the game starts (worlds from save keys before v10).
- **Creative land tour:** a list of every land in the pause menu (planned ones marked); Go takes you to the heart of the nearest stretch.

### Tooling
- **Two bytes per block:** the world holds block ids above 255 (blocks 0 to 199 and from 1024; items 200 to 1023).
- **`npm run lands`** (`tools/lands.mjs`) draws the land layout and writes `docs/LANDS.md` from the registry, for the owner's approval.
- New test `36-lands`; `06-biomes` and others follow the new layout; the world-hash snapshot is updated on purpose.

## 0.14.0 (2026-10-09): M5b, maps and creative tools

Old saves do not load: the save format gained the explored map, places and markers, and the save key is now `fantasy-blockcraft-save-v9`. The world itself is unchanged.

### Game
- **World map:** press M (D-pad up on the controller) for a map of everywhere you have explored, with the places you have found, your waystones and your own markers. Drag to move it, zoom with the wheel or the buttons; tap to place a marker or remove one. It is saved with the world. In survival it needs a map. The minimap zoom moved to J.
- **Layer view:** underground, the minimap shows the passages and rooms at your depth instead of the land far above.
- **Creative:**
  - Search the block menu.
  - Brushes up to 13 blocks wide.
  - The Fill Tool: break for one corner, place for the other, then fill the box with a hotbar block, replace one kind of block, or clear it.
  - In the pause menu: set the time of day, bring rain or clear skies, go to coordinates, and build a test structure (watchtower, keep, castle, barrow, stone ring, waystone, dungeon room) where you look. Undo takes it away.
  - On the world map, tap a spot and travel there.

### Tooling
- New test 35-maps-creative; 33-survival-systems and 34-controls adjusted (D-037).

## 0.13.0 (2026-10-09): M5a, controls and interface

No change to the world or the save format: 0.12 worlds keep working.

### Game
- **Rebind your controls:** a Controls panel in the pause menu lists every action with its keyboard keys and controller button. Tap one, then press the new key or button; Esc or B cancels; Reset brings back the defaults. A key you take for one action is freed from the one that had it.
- **Better defaults:** on the controller, travel moved to D-pad down and D-pad up now opens the map, so a slip no longer moves you. I turns the readout on and off.
- **Hints:** short one-time notes the first time something happens in survival (your first mining, ore, a pickaxe too weak, hunger, darkness, a lectern, a waystone, a chest, climbing, a grave). They name the right key or button for what you are using. Turn them off in the pause menu.
- **Help that fits:** the pause menu's help now shows the keys you have set, for the keyboard, controller or touch, and only what applies to survival or creative.
- **Readout switch:** the readout (fps, position, place name) is on by default and can be turned off with I or in the pause menu.
- **Worlds:** rename a world, and see when each was last played.

### Tooling
- New test 34-controls (defaults, rebinding and conflicts, saved bindings, capture, help by mode and device, hints, readout, renaming) (D-036).

## 0.12.2 (2026-10-09): crisp textures on Windows desktops

No change to the world or the save format.

### Game
- **Textures are crisp again on Windows.** Close-up blocks showed smoothed, blurry textures on desktop browsers because of anisotropic filtering, which Direct3D applies to near textures too. It is turned off; every block now shows its square pixels, as on phones (D-035).

## 0.12.1 (2026-10-09): sharper textures on desktop

No change to the world or the save format: 0.12.0 worlds keep working.

### Game
- **Sharp textures on high-resolution desktop screens.** The game now draws at the screen's full pixel density (it was capped at 1.25 times on desktop, which blurred textures on screens scaled to 150% or 200%).
- **Resolution** in the pause menu: Auto (default; full density, lowered only if frames slow down, after the view distance), Sharp (always full density) and Fast (one pixel per screen point, for slower machines).
- The readout shows the resolution in use.

### Tooling
- 29-view checks the resolution choices and how Auto gives way under load and comes back (D-034).

## 0.12.0 (2026-10-09): M4b, storage, the worn lamp, earned travel and food

Old saves do not load: the world changed (foraging plants) and the save key is now `fantasy-blockcraft-save-v8`.

### Game
- **Chests:** build an Oak Chest (8 planks) and keep things in it. Supply crates, dwarven chests and barrels in the world now keep whatever you leave in them instead of vanishing. Open a container with the place button; the inventory screen shows it above your pack, and tapping a slot moves that stack across. A container must be empty before you can break it.
- **More room:** a Woven Pack (+9 slots) and a Sturdy Pack (+18, made from a woven one) for the pack slot, and a Satchel (+9) for the bag slot, up to 63 slots.
- **The worn lamp:** a Miner's Lantern in the belt slot lights the way without taking up your hand. It burns Lamp Oil (20 minutes, pressed from wheat seeds) or Pitch Candles (8 minutes, plant fibre and coal) only while it is dark, taking more from your pack as it runs out. Without it there is no light around you in survival; a torch in hand still lights a smaller circle. The deep caves are darker the further down you go. Creative keeps its lamp.
- **Earned travel:** R no longer teleports in survival. Touch an Ancient Waystone to attune it; a Carved Waystone (expensive: diamonds, platinum, stone bricks, a rune stone) works as soon as you place it. Stand by a waystone and use it (or T, or the map) to choose where to travel; only waystone to waystone. Creative travels freely as before.
- **Food:** turnips and beans to plant (as they are) and harvest with the sickle; bilberry bushes on the moors and in the woods, brown mushrooms in the woods, and wild turnips in open country to forage; tall grass sometimes gives beans. Cook roast turnips, pottage, bilberry tart and roast mushrooms at a furnace.
- The Caves setting's middle option is now called Normal.
- Fixed: the survival inventory could show the creative block menu after using creative mode (0.11.0).

### Tooling
- New test 33-survival-systems (containers, packs, lantern fuel, depth light, travel rules, crops, sickle, foraging). 13-survival updated for containers that keep leftovers; 32-items counts the new wild plants. New world-hash snapshot (surface band only).

## 0.11.0 (2026-10-09): M4a, tools, climbing and finding the way

No change to the world or the save format: 0.10.0 worlds keep working.

### Game
- **The metal ladder:** wood, stone, copper, bronze, iron, steel and moonsilver pickaxes, each faster and longer lasting than the last. Each one is the first that can mine the next metal: a stone pickaxe for copper, copper for tin and gold, bronze for iron, iron for platinum and diamonds, steel for moonsilver, moonsilver for obsidian.
- **Axes and shovels** in every metal: an axe cuts wood two to ten times faster than bare hands depending on its metal, and a shovel does the same for earth and sand.
- **Bronze shears** keep leaves, cobwebs, grass and flowers whole. The **gold sickle** cuts every plant within two blocks in one stroke and harvests ripe wheat and potatoes, replanting them. The **platinum pickaxe** is the fastest made pickaxe and soon worn.
- **Climbing:** ladders (sticks), iron pitons (one iron ingot makes 8), and rope (plant fibre from grass and bracken). Jump climbs, down or sprint climbs down, letting go holds you in place; no fall damage while climbing. Ladders need a wall and ground below; pitons go into rock at any height; rope unrolls down from where you place it as far as you carry.
- **The grapnel** replaces the grappling hook: throw it at a wall below a ledge (up to 24 blocks away) and it catches the top edge and hangs your rope down to the ground. Break the hook to take it back with all its rope.
- **Finding the way in survival:** the minimap shows only while you carry a **map**; a **compass** shows X, Z and which way you face; a **depth gauge** shows your height and how far below the surface you are. Creative shows everything as before.
- **Signal flares** replace fireworks: a flare climbs about 60 blocks, then burns red as it drifts down, visible from far away. Made from a stick, a glow mushroom cap and coal.
- **The Blasting Keg** looks like a dwarven keg now; its side no longer says TNT.
- **The Blueprint Tool is creative only.**
- **A starting kit** for new survival worlds: a wooden pickaxe and axe, a map, 8 torches and 4 bread.
- Supply crates can hold rope, ladders, flares and a grapnel; smithies and armouries hold axes, shovels and pitons.
- Fixed: cold sconces, burnt-out torches and dim glowstone could not be broken in survival.

### Tooling
- New test 32-items (tool ladder, recipes reachable from the starting kit, climbing, rope, grapnel, navigation, sickle, flares). 10-content-tables checks every block has a hardness, material and tier.

## 0.10.0 (2026-10-09): M3.5b, a natural surface

Old saves do not load: the world changed and the save key is now `fantasy-blockcraft-save-v7`.

### Game
- **Rivers in valleys.** Rivers rise in the hills and run to the sea or a lake in valleys that widen with the land around them, shelving into sandy or gravel banks. River ravines with 20 to 30 block walls are gone.
- **Mountain ranges** with ridgelines, valleys between them, saddles to cross, and peaks along the ridges. Far fewer sheer drops.
- **Smoother ground:** gentle lands are about half as bumpy. Moors, mountains, the Shadowed Forest and the fens keep their character.
- **Lands blend** over a wide border: trees, ground cover and snow mix in patches instead of stopping on a line.
- **Barrows** only on the Barrow Hills, in clusters (burial grounds and beside old roads), facing every way, round or long, small to large, some with the roof fallen in.
- **Trees in groves** with clearings between, thicker in valleys and by water.
- **Boulders** on the moors, in the mountains and on slopes; rare on gentle ground. The stray little stone towers and wells are gone.
- **Ruined towers, keeps and castles** stand on commanding ground (towers and castles on high ground, keeps by rivers), on an earth bank that slopes down to the land instead of a stone plinth.
- Ruined stairways stand at the foot of a slope.

### Tooling
- New test 31-natural-surface; 06-biomes, 07-gamepad and 16-worlds adjusted (D-031). New world-hash snapshot.

## 0.9.1 (2026-10-09): M3.5a.2, noclip

No change to the world or the save format: 0.9.0 worlds keep working.

### Game
- **Noclip in creative mode:** fly straight through blocks. **N** on the keyboard, the **Clip** button on touch, or **Noclip** in the pause menu (for the controller). Turning it on also turns flying on; turning it off inside rock lifts you up to the first place you fit. Survival mode refuses it and switching to survival turns it off. The info panel shows "Noclip" while it is on.

### Tooling
- New test 30-noclip.

## 0.9.0 (2026-10-09): M3.5a, the underground rewritten

Old saves do not load: the world changed and the save key is now `fantasy-blockcraft-save-v6`.

### Game
- **Cave systems instead of noise caves.** Each area of about 160 x 160 blocks has one to three systems: a main passage that winds down from an entrance through the depths, branches that end in chambers, loops back, and shafts. Passages only meet at junctions and never cut through each other or through rooms.
- **Far less hollow rock** (about 1.5% of the rock under spawn, against about 28%), in fewer, bigger, connected caves that get roomier the deeper you go: passages 3 to 6 wide near the surface, halls up to 38 across in the deep.
- **Chambers with shape:** domed halls with natural pillars, tall rifts with ledges (some with an opening high in the wall), stepped halls going down to a lake, and stalagmites, stalactites and columns.
- **Ways down:** cave mouths at the foot of slopes and sinkholes with a ramp spiralling down, walkable descents, shafts, streams of pools stepping down a passage, links between the deepest halls of neighbouring areas, and passages from the caves into the mines of a nearby hold.
- **The Fire Below:** smooth islands and great pillars that flare at both ends; most areas' caves reach it by a causeway of fallen rock to an island, and some deep halls have a gorge with lava at the bottom or a lava fall pouring into a pool.
- **No floating lava:** lava follows the same rule as water and lies only in sound rock.
- Old mineshafts and ruined stairways are much rarer; dungeon rooms and points of interest open onto the new passages.

### Tooling
- `npm run map` (`tools/map.mjs`): height, cave and section maps of the generated world, for before and after comparisons.
- Tests 21-deep and 23-entrances rewritten for cave systems (no passage crossings, depth profile, sound water and lava, walkable entrances and hold links); 24-places checks eight windows; 28-meshing's vertex check changed (D-029). New world-hash snapshot.

## 0.8.0 (2026-10-09): M3b sky light and a livelier look

No change to the world or the save format: 0.7.0 worlds keep working (the moon phase starts from the first day in an older save).

### Game
- **Sky light spreads sideways** under overhangs and into cave mouths, fading over about 15 blocks, instead of stopping at the edge of the roof above.
- **Animated water and lava.** Water is a deeper blue, shimmers slowly and catches glints of sun; the lava sea rolls, with brighter crests.
- **Lamps and glowing blocks show through fog** from further away and pulse slightly. **Plants sway.**
- **Blocky clouds** that stay put in the world and drift slowly, coloured at sunset and dark at night.
- **Moon phases:** eight, one per day; the day count is saved with the world.
- Fixed: distant water and leaves showed grid lines (texture edges bleeding into each other).
- Fixed: the sky showed at the far edge of the lava sea and other big caverns.

### Tooling
- `npm run shots` (`tools/shot.mjs`): screenshots of set views in headless Chromium, failing on shader errors (D-026).
- 02-lighting and 27-streaming require exact sky light too; 02-lighting also relights after about 800 edits. D-027.

## 0.7.0 (2026-10-08): M3a performance

No change to the world or the save format: 0.6.0 worlds keep working.

### Game
- **Smoother streaming.** New terrain is built a little each frame (about half a millisecond per frame on the test machine) instead of a whole chunk in one frame, which caused the stutter when moving.
- **Lighter meshing.** Above ground, cave interiors far below the surface are no longer meshed (about 77% fewer vertices at spawn, chunks mesh four to five times faster). Underground, meshing reaches as far as the cave fog setting lets you see.
- **No long freeze on waypoint travel** or respawning far away: the area right around you appears at once and the rest streams in.
- **Auto view distance**, the new default (Near, Normal and Far are still there): it starts from your device and adjusts to keep the frame rate up.
- The info panel shows frame time (average, worst, and the game's own work), the auto view distance and how much terrain is still streaming.
- The minimap redraws ten times a second, autosave no longer rewrites the save every 5 seconds, and the explored map's memory is capped.
- Fixed: after loading or travelling, some light deep underground could be a level too dark.

### Tooling
- `GEN_STEPS` and `genJob` (staged generation), worm points indexed by chunk, `meshFloor` and `MESH_DEEP`, `AUTO_VIEW` and `autoView`; the benchmark gains a per-frame streaming step.
- New tests 27-streaming, 28-meshing, 29-view. D-025.

## 0.6.0 (2026-10-08): M2b world restructure, part two

Old saves do not load: the world changed and the save key is now `fantasy-blockcraft-save-v5`.

### Game
- **Hold gates.** Each hold has up to three gates on the highest ground above its outer ring: a terrace with pillars and braziers over a spiral stair down to the hold's upper floor (y82). Plaza waymarkers point to the nearest gate (reading them no longer fails).
- **Ways down from open land:** cave mouths in steep slopes that wind down into the caves, small ruined stairways on level ground, and deeper ravines. One is usually within about 80 to 90 blocks.
- **Dungeon rooms are rarer and varied** (Forgotten Crypt, Old Storeroom, Old Cells, Sunken Chapel), and **points of interest are rarer**. Every one opens onto a cave; crystal geodes and fossils stay sealed in the rock.
- **Remains of other peoples** in the deep caverns away from the holds: goblin warrens, gnome workshops, drow halls and nameless ruins older than the holds, some only as scattered leftovers.
- **Ruined watchtowers, keeps and castles** on the surface, each with a name, linked by **old roads** that also lead to the hold gates.
- **Ancient waystones** (a new block) at some ruined sites and at the first gate of every hold. Attuning to them comes in a later update.
- **Underground water no longer floats.** Every underground pool, lake and river sits in sound rock, with nothing floating under or beside it; there is much less of it, and ceiling springs are gone.
- The location display names gates, ruined stairways, old roads, sites, waystones, dungeon rooms and remains.

### Tooling
- New `world/remains.js` and `world/surface-sites.js`; `caveAnchor`, `caveMouth`, `deepRim` in `world/caves.js`; `deepOpenAt`, `deepWaterAt` in `world/deep-caves.js`; ruined stairways, dungeon rooms, `tunnelTo` and `surfTaken` in `world/features.js`; `drainCaveWater` in `world/chunk-generation.js`.
- New tests 23-entrances, 24-places, 25-remains, 26-surface; 05-underground and 21-deep require sound underground water. D-024.

## 0.5.0 (2026-10-08): M2a world restructure, part one

Old saves do not load: the world changed and the save key is now `fantasy-blockcraft-save-v4`.

### Game
- **The world is 512 blocks tall.** Sea level is unchanged, so there are about 200 blocks of sky and the hearts of mountain ranges rise far higher than before. The underground keeps its depth.
- **Dwarven holds are rare and vast.** The city no longer runs under the whole world: each region of about 2560 x 2560 blocks has one hold, 400 to 575 blocks across, with one name. About 3 in 10 holds are inhabited: kept up and lit, though their people only arrive in a later update. None lies under the spawn area; the nearest is usually 1500 to 2500 blocks away.
- **Mines belong to holds,** running under each hold and thinning out around it.
- **The deep is natural** away from the holds: large caverns in two tiers, underground lakes and rivers (all at y64), and caverns dressed in their region's character (The Crystal Deeps, The Fungal Deeps, The Mossy Deeps, The Dripstone Deeps, The Deep Caverns). The location display names them, and names a hold's deeps and mines after the hold.
- **The Fire Below is a lava sea:** open lava (surface at y8) with rock pillars and islands under most of the land.
- **The old lights are out.** Lanterns, sconces, torches and glowstone found in ruins, mines, camps and towers are cold: new blocks Cold Lantern, Cold Sconce, Burnt-out Torch and Dim Glowstone. Coal relights a cold lantern, sconce or torch. Rune stones, crystals and glowing fungi still shine, and inhabited holds keep their lamps lit.
- The Hall of a Thousand Pillars is rarer: a few per hold.

### Tooling
- New `world/deep-caves.js`; holds, `holdNear` and `holdReach` in `ruins/city-plan.js`; mines follow `holdReach`; `PW` writes cold lights unless `genLit`.
- New tests 20-holds, 21-deep, 22-old-lights. 03-ruin-graph, 04-doorways and the city plan in 09-world-hash now check the hold of region (0,0). The world-hash snapshot was re-recorded. D-023.

## 0.4.0 (2026-10-08): M1b foundations, part two

No change to the world or the save format: 0.3.0 worlds keep working.

### Game
- No visible changes. Controls, menus and the world play as in 0.3.0.

### Tooling
- Entity registry (`engine/entities.js`): moving things register once and are shifted, cleared and updated by the registry.
- Input action layer (`input/actions.js`): keyboard, controller and touch dispatch named actions through bindings that `settings.binds` can override, ready for the M5 rebinding screen.
- Equipment slots (belt, pack, bag) in the player model, saved with the world, ready for M4.
- New tests: 17-entities, 18-actions, 19-equipment. ES modules are deferred until after M2 (D-022).

## 0.3.0 (2026-10-08): M1a foundations, part one

Old saves do not load: the save format changed (key `fantasy-blockcraft-save-v3`), and the world itself changed.

### Game
- **Several worlds.** New world no longer replaces your world: the pause menu lists your worlds to play, export to a file, delete, or import from a file. Give a new world a name and, optionally, a seed.
- A seed typed as a whole number is used exactly (777 used to give seed 778).
- **Removed for the setting:** power (wire, generators, water wheels, solar panels, batteries, electric lamps and furnaces, chargers, drills, jackhammers, chainsaws), trading counters, coin mints, coins in loot, ore processing (crusher, gold pan, sluice, crushed ores, nuggets), and rails in the mines and the city. The alchemist's lab, the outpost, the mine junctions and the Machine Hall have period-fitting objects in their place.
- Hold, king and queen names come from a new dwarven name style and never match Tolkien's names (the old generator could produce Durin, Thrain and Mordor).
- The leftover Town and Sky Island labels and map markers are gone.
- Saves no longer grow on their own: flowing water, spreading grass and snow are saved only where you changed things yourself. Crops you plant still keep their growth.

### Tooling
- The town, road, power, trading and ore-processing code is deleted (`legacy/` is gone); mining moved to `gameplay/mining.js`, crafting and `BANNED` to `gameplay/crafting.js`.
- New `core/names.js` with name styles for ten peoples (dwarf, plus drafts for the others) and a Tolkien-name blocklist.
- New tests: 15-names and 16-worlds; the content test refuses removed content.

## 0.2.0 (2026-10-08): M0 bug sweep

Old saves do not load: the save format changed (key `fantasy-blockcraft-save-v2`), and the retired v1 save is deleted from browser storage.

### Game
- Fixed: everything built or dug above height 127 (that is, all surface work) reloaded deep underground and shifted sideways. Undo and waypoints used the wrong positions for the same reason.
- Fixed: crops under a roof or underground never grew. Lit farmland grows anywhere now, at the same rate as surface farms.
- Fixed: High Mountains snowed at every height; snow now starts at the mountain snow line. Heath Moors and Barrow Hills get rain again.
- Fixed: the seed 777 blocked doorway. Doorway clearing now reaches the wall line, and lecterns (lore) are no longer removed by decay.
- Crates, barrels and dwarven chests no longer lose loot that does not fit: with a full pack they stay closed and say so. In creative they show their contents without being emptied.
- Blasts no longer destroy graves or containers (a blast used to empty a grave into your pack wherever you stood).
- Right-clicking a lectern, crate, grave or counter now uses it even with food, seeds or a hoe in hand.
- Pausing (or opening the inventory) now pauses lit kegs, falling blocks and flowing water.
- Esc closes the inventory and shows the pause menu.
- Moving the mouse while playing with a controller now pauses cleanly instead of leaving the game without mouse control.
- New pause-menu setting Touch: Auto / On / Off. Auto only picks the touch layout when there is no mouse or trackpad.
- Banned power blocks no longer appear in the creative menu.
- Text: the HUD and help call the keg a Blasting Keg; lore says moonsilver, not titanium; the unreachable "You starved" message is gone (hunger stays non-lethal).
- Chunk generation is about 25% faster (the deepstone noise is computed once per column), with an identical world.

### Tooling
- New tests: 11-saves (world keys and a save round-trip), 12-weather-farming, 13-survival, 14-engine. The doorway walk test also runs seed 777.

## Project setup (2026-10-07 to 2026-10-08)

### Tooling
- Recorded the direction interview (`docs/DIRECTION_QA.md`, 76 questions) and the build order (`docs/MILESTONES.md`); logged D-019; listed the bugs found by a full code read in `docs/KNOWN_ISSUES.md`.
- The playable single-file build is now committed at the repository root (`fantasy-blockcraft.html`), so the latest game can be downloaded from GitHub without Actions. `npm run build` refreshes it; `npm run check` and a Claude Code Stop hook catch a stale copy.
- Imported the modular source into this repository.
- Added `CLAUDE.md` and this changelog.
- Added `.gitattributes` (LF line endings everywhere).
- Vendored three.js r128 in `vendor/`; the game folder build now runs offline. The single-file build is unchanged.
- Added `npm run check` and `npm run check:syntax`.
- Added a determinism test (08), a world-hash snapshot test for two seeds (09), `snapshot()` and multi-seed cases in the harness, and `npm run bench` with a baseline in `docs/PERF.md`.
- Added `.claude/settings.json`: permission rules for the project's scripts, node and git, and a post-edit syntax-check hook for `src/`.
- Added a content-tables test (10) and seven project skills in `.claude/skills/`.
- Added `docs/ROADMAP.md` (known work only) and `docs/ES_MODULES_PLAN.md` (plan, not started).
- Added GitHub Actions: CI (tests, both builds, downloadable artifacts) and Pages (publishes `main`, skips itself while Pages is off).

## 0.1.0 (2026-10-05)

### Game
- The single HTML file split into a modular source with two build targets. No gameplay changes.
