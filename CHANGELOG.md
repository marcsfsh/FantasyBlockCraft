# Changelog

All notable changes to Fantasy BlockCraft. Newest first. Versions follow `package.json`.
Entries are grouped under **Game** (anything a player would notice) and **Tooling** (build, tests, CI, docs).

## Unreleased

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
