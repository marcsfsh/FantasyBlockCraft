# Decision log

Newest last. Each entry: what was decided, why, and what it constrains. Add an entry for any decision that a future change could accidentally undo.

### D-001 Modular source, two build targets (2026-10-05)
The single HTML file was split by system into `src/`, bundled by a dependency-free Node build into either one HTML file or a game folder. Keeps the single-file option while letting the game grow past it.

### D-002 Deterministic, chunk-local generation (earlier)
Generation is a pure function of seed and world coordinates and writes only inside the current chunk. Required for endless streaming and for saves that store only edits. See ARCHITECTURE rules 1 to 4.

### D-003 Classic worm caves and gentle terrain (earlier; caves superseded by D-029)
Caves follow the pre-1.18 worm style; terrain is smooth with gentle transitions. The player prefers this over modern cave noise.

### D-004 Deep, layered world (earlier)
Height 384, sea level 310, about five times deeper underground than before, in six layers ending in the dwarven city and mines. Old saves were retired with a new save key.

### D-005 Ancient, decaying dwarven ruins that stay walkable (earlier)
Heavy decay with guaranteed connectivity: symmetric doorways, routes toward avenues, rooms with a north altar never open north, rubble cleared along doorway paths, a final tidy pass. Measured with the doorway and ruin-graph tests.

### D-006 No shafts from the city to the surface (earlier)
Surface gates and light wells were removed once the city sat 250 blocks down. `gateAt` and `lightwellAt` return false.

### D-007 Fantasy conversion: nothing modern (earlier)
Towns, roads, power tools and the power network are out of play. Their code is kept in `legacy/` (switched off) until it can be deleted safely. TNT became the Blasting Keg; titanium became Moonsilver.

### D-008 Original names (earlier)
Biomes and places use original names in the spirit of the setting rather than Tolkien's, which are under copyright.

### D-009 Large lands with soft borders (earlier)
Climate fields span roughly a thousand blocks; region fields several hundred. Borders use low-frequency jitter, and vegetation and terrain follow continuous weights rather than hard biome ids.

### D-010 Dry, sealed underground (earlier)
Underground water kept below about 0.5% of open cave space; most cavern lakes are dry. Few surface openings into caves.

### D-011 Lighting must stay exact (earlier)
Block light never enters ungenerated chunks, so streamed lighting equals a full recompute. The lighting test enforces equality.

### D-012 Mesh only near the player's height (earlier)
A band of about 120 blocks above and below the player is meshed, to keep the GPU load manageable with the deep world.

### D-013 Controller support (earlier)
Gamepad API support for Xbox-layout pads, aimed at the ROG Ally X in gamepad mode, including a menu pointer and play without pointer lock.

### D-014 Save key policy (earlier)
Bump `SAVE_KEY` whenever generation changes would misplace saved edits. Note: the last biome tuning did not bump it (see KNOWN_ISSUES).

### D-015 Vendored three.js r128 for the game folder; single file keeps the CDN (2026-10-07)
`vendor/three.min.js` is three.js r128 from npm `three@0.128.0`, byte-identical to the CDN copy. `npm run build:web` points the game folder at it so `dist/web` (and the Pages site) runs offline and does not depend on a third-party host. The single-file build keeps the CDN script tag, so it stays byte-identical and small (about 340 KB instead of about 930 KB). Inlining three.js into the single file is a possible later change; it would need its own decision because it changes the file players download. Constrains: upgrading three.js means updating `vendor/`, `tools/lib.mjs` and the template together.

### D-016 No runtime dependencies, no dev dependencies (2026-10-07)
The game ships only its own code plus vendored three.js. Tooling (build, tests, checks, benchmark) uses Node built-ins only, so a fresh cloud session or CI runner can run `npm test` with no install step and no network. Constrains: adding a dev dependency needs a logged decision and a SessionStart hook in `.claude/settings.json` that installs it.

### D-017 Proposed: gradual formatting and linting, not a mass reformat (2026-10-07, proposal, not applied)
The source is deliberately dense; reformatting it all would bury every future diff and `git blame`. If a formatter or linter is wanted later:
1. Start with a linter in **report-only** mode for real bugs only (undefined names across the shared scope, unreachable code, duplicate keys), with no style rules. Run it in CI as a non-blocking job. This needs a dev dependency (see D-016) or a small Node-only checker.
2. Make that bug-only lint blocking once it is clean.
3. Format only files that a change already rewrites substantially, ideally as part of the ES module conversion (`docs/ES_MODULES_PLAN.md`), one system per PR, in a commit separate from logic changes, and list the commit in a `.git-blame-ignore-revs` file.
4. Never format generation code in the same PR as a generation change, so the world-hash snapshot test isolates behaviour from layout.

### D-018 The single-file build is committed at the repository root (2026-10-07)
Every change that affects the build commits a fresh `fantasy-blockcraft.html` at the root, byte-identical to `dist/single/fantasy-blockcraft.html`. The owner plays the latest game by downloading that file from GitHub, which works without GitHub Actions minutes or Pages. `npm run build` refreshes it, `npm run check` fails if it was stale, and a Claude Code Stop hook blocks finishing a turn while it is stale. `dist/` stays uncommitted (D-001); this one file is the exception. Constrains: PRs that touch `src/`, the template, CSS or build tools include the regenerated file; nobody edits it by hand; `.gitattributes` keeps it LF so it stays byte-identical across platforms.

### D-019 New direction and milestone plan (2026-10-08)
The owner answered 76 direction questions (`docs/DIRECTION_QA.md`); `docs/MILESTONES.md` is the resulting build order (M0 bugs, M1 foundations, M2 world restructure, M3 performance, M4 survival, M5 interface, M6 surface, M7 lore, M8 audio, then expansions starting with wildlife). Main changes to earlier decisions:
- The setting is a dwindling age, not a long-abandoned world: ancient ruins alongside lived-in settlements, camps and travelers. Partly supersedes D-007 (towns and roads are deleted now and rebuilt later as medieval settlements; nothing modern remains the rule).
- Dwarven holds become rare, vast structures that spawn, some inhabited, with mines tied to them; the deep layers default to natural caves. Hold gates return as findable entrances. Supersedes D-006, and partly D-004 and D-010.
- The world becomes 512 tall, with the extra height above ground (M2). Will supersede D-004's height once built.
- Saves always yield to updates: bump `SAVE_KEY` whenever generation or the save format changes, with no migration. Supersedes D-014's caution.
- Creatures are peaceful only for now; orcs and goblins are neutral; hostility will be revisited.
- Work runs bugs first, then foundations, with one milestone-sized PR per milestone reviewed at a checkpoint.
Constrains: every milestone follows the sheet's order unless a new decision changes it; DESIGN.md is rewritten as each milestone lands, not before.

### D-020 M0 bug-fix behaviour (2026-10-08)
Choices made while fixing the M0 bugs that later work could undo:
- **Save keys:** y takes 9 bits (heights 0 to 511, ready for the 512-tall world in M2); `SAVE_KEY` is now `fantasy-blockcraft-save-v2` and the retired v1 save is deleted on load.
- **Crates:** taking loot is all or nothing. With too little room the crate stays closed (the roll depends only on its position, so it is the same later). In creative, crates show their contents and stay. Storage that keeps leftovers comes in M4.
- **Blasts** skip graves and containers rather than destroying them.
- **Pause** stops lit kegs, falling blocks, rockets and water flow, including while the inventory is open; cosmetic effects (weather, torch flames, particles) keep animating.
- **Esc in the inventory** shows the pause menu, because browsers refuse pointer lock from Esc; a refused lock always falls back to the pause menu. Leaving the controller for the mouse mid-play pauses for the same reason.
- **Touch layout:** Auto uses touch only with a coarse pointer and no precise pointer (`any-pointer:fine`); the Touch setting (Auto / On / Off) overrides it and reloads the page.
- **Doorway clearing** reaches the wall line (k <= h). Lecterns are no longer gutted by decay.
- **Hunger stays non-lethal** (Q16); the unreachable "You starved" message was removed.

### D-021 M1a: what was removed and how saves work now (2026-10-08)
- **M1 is split** into M1a (removals, save format v3, naming module; 0.3.0) and M1b (entity registry, input action layer, equipment slots, and the ES module decision), each with its own PR and checkpoint.
- **Removed for good:** the town and road generator, the power network and power tools, trading counters and coin mints, ore processing (crusher, gold pan, sluice, crushed ores, nuggets) and rails. `legacy/` is gone. Coins stay defined but out of play via `BANNED` (now in `gameplay/crafting.js`) for settlement traders in E2. `10-content-tables` refuses any removed kind of block or item.
- **Generated replacements** (no gaps where things were): the alchemist's lab gets barrels, books, flasks (glass) and stoves (furnaces); the outpost's counter is a barrel; the mine-junction crusher is a steel block; the Machine Hall's wheel and battery are copper and brass blocks; rails simply vanish, leaving the gravel and barrels that shared their rolls. Cave decoration in affected chunks shifts because it samples what is already in the chunk.
- **Save format v3:** a world index under `SAVE_KEY` and one entry per world; export files only load under the same `SAVE_KEY`; older keys are deleted on load.
- **Player changes only:** automatic changes are recorded only where the player already changed that block. Trade-off: water that flowed into a player-dug space is rebuilt on load by re-queuing water next to player changes, and sand that fell on its own is not tracked unless the player caused it.
- **Seeds:** a whole number typed as a seed is used exactly; other text is hashed.
- **Names:** `core/names.js` styles for ten peoples; dwarf is final for now, the others are drafts for owner approval (Q28). Generated names are redrawn if they match a Tolkien name, are one letter off one, or contain a distinctive Tolkien root.

### D-022 M1b foundations, and ES modules deferred (2026-10-08)
- **ES modules wait until after M2** (owner's choice). The world restructure will decide which files survive, so converting first would be redone. No dev dependency is added yet; the plan in `docs/ES_MODULES_PLAN.md` stands.
- **Entity positions stay in window coordinates**, not world coordinates as MILESTONES first said: every collision and physics function works in window coordinates, so the registry shifts entities with the window instead, and `entityWorld` converts. Creatures that must outlive the loaded window (E1) will store their own world position when unloaded.
- **Input defaults are unchanged** in M1b; better defaults (Q37, such as moving waypoint travel off D-pad up) come with the M5 rebinding screen. Sticks, triggers and menu navigation are not remappable yet.
- **Equipment slots exist but nothing fits them** until M4; the inventory row stays hidden until then. Pack and bag capacity (more inventory rows) is M4 work: the inventory is still 36 slots.

### D-023 M2a: the 512-tall world, rare holds, the natural deep, cold lights (2026-10-08)
- **M2 is split** into M2a (height, holds, mines, the natural deep, the lava sea, cold lights; 0.5.0) and M2b (other peoples' remains, findable entrances and hold gates, old roads and ruined surface keeps, rarer reachable dungeons, ancient waystones), each with its own PR and checkpoint.
- **Height 512, sea level stays 310.** Q73 says the underground keeps its depth and the extra 128 blocks are sky, so sea level does not move (MILESTONES first said it would be raised; corrected). The hearts of mountain ranges gain peaks of up to about 110 blocks; the highest ground near spawn on seed 123456789 is about 430. Ore veins keep their old span (y1 to y382). From 60 blocks under sea level up, the mesh band reaches the top of the world. Supersedes the height in D-004.
- **Holds:** one per region of 160 x 160 chunks (2560 blocks), its centre 44 to 116 chunks into the region, radius 12 to 18 chunks with a ragged edge. That gives holds about 400 to 575 blocks across and about 2000 blocks apart, never under the spawn area: the nearest to spawn is usually 1500 to 2500 blocks away. Inside, the old city plan is unchanged; its 8 x 8-chunk tiles are now the hold's quarters, each with avenues and a plaza, and the whole hold has one name. The pillared hall is rarer (5% per 3 x 3 block instead of 14%) so a hold has a few, not a dozen.
- **Inhabited holds:** about 30% of holds. They are kept up (decay under 0.25, so no structural damage) and their lamps burn; their people arrive with settlements in E2. Until then they are empty but tidy.
- **Mines** run under the whole hold and thin out to nothing by about twice its radius (Q12). The Machine Hall and other rooms are unchanged.
- **The natural deep:** the lava sea of the Fire Below is open under most land (lava y3 to y8, 4 to 16 blocks of headroom, pillars and islands), kept low (ceiling y13 at most) under the mines. Two tiers of large caverns (around y37 and y81) add to the existing worm caves outside holds. Every deep lake and river sits at one water level (y64), so no wall of water stands where two meet. The 05-underground water target (under 1% of open cave space) is unchanged and still met (0.4% on seed 4242).
- **Cold lights (Q8):** generation writes Cold Lantern, Cold Sconce, Burnt-out Torch and Dim Glowstone in place of lit ones everywhere except inhabited holds and their mines. Rune stones, crystals and glowing fungi and moss still shine. Coal relights lanterns, sconces and torches; dim glowstone stays decorative.
- **Tests:** 03-ruin-graph, 04-doorways and the city part of 09-world-hash now look at the hold of region (0,0), since the spawn area has no city. New 20-holds, 21-deep and 22-old-lights.
- **Saves:** `SAVE_KEY` is `fantasy-blockcraft-save-v4` and the world data version is 4; older worlds are deleted on load (D-019).
Constrains: anything placed per hold asks `holdNear`/`holdReach`; a generator that wants a lit lamp in an abandoned place must use another emitter or set `genLit`; new deep water must sit at `DEEP_WL` or be enclosed.

### D-024 M2b: ways down, places, remains, surface ruins, roads, waystones, and sound underground water (2026-10-08)
- **Hold gates:** up to three per hold, on avenues in the outer ring (0.5 to 0.95 of the radius) under the highest dry ground, at least eight cells apart. A 7 x 7 shaft with a spiral stair (one step up per block) climbs from the upper deep (y82) to a terrace raised to the highest ground around it. Gates are built last in `genChunk` so no other generator cuts the stair. The first gate of each hold carries an Ancient Waystone. This also restores the gate line in plaza lore, which M1a had left reading an undefined variable (a plaza lectern threw an error).
- **Ways down from open land (Q22):** cave mouths in steep slopes, ruined stairways on level ground, and deeper ravines (about 60 blocks at most, about a third reaching the crawlways). Mouths and stairways end on a point of a worm cave of their own chunk (`caveAnchor`), so they always connect; a mouth descends at most 0.85 blocks per block. A way down is usually within 80 to 90 blocks of open land.
- **Dungeons and points of interest (Q24):** dungeon rooms fall from 20% to about 4% of chunks in four kinds; points of interest from 32% to about 8.5%. Each built one sits about 9 to 13 blocks from a worm-cave point and gets a passage to it, on a floor that fills any gap. Geodes and fossils stay sealed (finding them by digging is the point). Places do not overlap: a point of interest yields to a higher-priority neighbour, and a dungeon to any point of interest.
- **Remains of other peoples (Q10, Q70):** about one region of 160 x 160 blocks in four, outside holds and their mines, on the floor of a natural deep cavern: goblin warrens, gnome workshops, drow halls, nameless ruins older than the holds; about a third are only leftovers. Floors are filled underneath so nothing floats. Names come from the draft goblin, gnome and drow styles (Q28: the owner approves them).
- **Surface sites and roads (Q72):** about two regions of 384 x 384 blocks in three have a ruined watchtower, keep or castle on level ground, on a stone plinth wherever the ground dips, named in the draft human style. Old roads (dirt path with stones and gravel) wander between each site and its two nearest neighbours and from each hold gate to the nearest site; they skip water, steep slopes, sites and gate terraces. The road function is `oldRoadAt`: the removed town and road generator stays removed (D-021).
- **Ancient waystones (Q71):** a new unbreakable block with a faint rune glow, at about a third of sites and at the first gate of every hold. Attunement and travel come in M4.
- **Underground water is sound (owner's rule, 2026-10-08):** no water floats underground and nothing that holds water floats. Every underground water block has water or a solid block under it and on each side, the block under it rests on another solid block or water, and each solid block holding it from the side has something under it. A final pass (`drainCaveWater`) drains anything else until stable. Because the next chunk cannot be seen, water at a chunk's edge drains too, except at the deep lake level (y58 to y64, built to meet across chunks; worm caves keep a sound rim around it in every chunk via `deepWaterAt`) and on hold floors. Ceiling springs are removed. Underground water near spawn fell from about 50 000 to about 12 500 blocks; 05-underground and 21-deep require zero unsound blocks.
- **Saves:** `SAVE_KEY` is `fantasy-blockcraft-save-v5`, world data version 5.
- **Tests:** 23-entrances, 24-places, 25-remains, 26-surface. The full suite now takes about 7 minutes on the cloud VM (23-entrances walks many routes).
Constrains: any generator that writes underground water must leave it in a sound basin or let the drain pass take it; a structure that should be reachable opens onto `caveAnchor`; surface structures keep off `surfTaken` columns.

### D-025 M3a: performance first, without a browser (2026-10-08)
- **M3 is split** into M3a (streaming, meshing, travel, throttles, auto view distance, frame readout; 0.7.0) and M3b (sky light spreading sideways, animated water and lava, better clouds, moon phases, swaying plants, glow on emitters, and further mesh savings such as smaller vertex formats). The cloud sessions cannot see or time a browser, so M3a was driven by headless CPU profiles and the benchmark; the owner's Ally X check decides what comes next.
- **Staged streaming:** chunk generation is a list of steps (`GEN_STEPS`) run within a per-frame budget (4 ms, 9 ms while more than two strips wait), then the chunk's light, then its map tile. A chunk counts as generated (`genDone`) only when complete; a chunk under way moves with the window or is dropped. Whole-chunk generation (`genChunk`) runs the same steps, so the world is unchanged.
- **Worm points are indexed per chunk** (`byChunk`), with identical output.
- **lightAll seeds one chunk at a time.** Seeding the whole window overflowed the 2-million-entry queue once the lava sea existed (about 300 000 emitters), leaving some deep light one level too dark after loading or travel. The result is now exact again.
- **Surface mesh floor:** above ground each chunk is meshed down to `MESH_DEEP` (24) blocks under the lowest sky-exposed ground in and around it, with a dark quad across the chunk at that depth so a deep shaft shows darkness, not sky. Underground the band follows the cave fog setting (48, 72 or 118 blocks each way). Surface or cave mode is judged against terrain height with hysteresis (surface above ground minus 6; back to surface above ground minus 2).
- **Travel and far respawn** make only the 3 x 3 chunks around the arrival at once, lit per chunk; the rest stream in.
- **Throttles:** the minimap redraws ten times a second; autosave writes within 5 s of a change, otherwise every 30 s while playing; the explored map keeps at most 6000 tiles, dropping the longest unvisited.
- **Auto view distance** (view -1, the new default; a saved manual choice stays): starts from the device and follows the median frame time against the best median seen, between 56 and 104 blocks of fog. The info panel shows frame times, the auto view and the stream queue.
Constrains: generation code stays split into steps that only touch their own chunk; anything that reads `genDone` must treat a chunk under way as not generated.

### D-026 Screenshots from headless Chromium (2026-10-09)
The cloud VM has Chromium and a global Playwright (set up by the environment, not by this project), and its software WebGL (SwiftShader) renders the game. `tools/shot.mjs` (`npm run shots`) builds a copy of the game folder with a hook at the test marker that moves the camera, fixes the time of day and View (Far), turns weather off and finishes streaming and meshing at once, then saves PNGs to `tests/.tmp/shots/` and fails on any page error or WebGL shader error. The shipped game is unchanged and the project still has no dependencies (D-016): the tool exits with a message when Playwright is missing. Sessions can now look at what a change does to the picture. Frame rates in that browser are meaningless (the GPU is emulated), so performance still comes from `npm run bench` and the owner's devices.

### D-027 M3b: sky light spread and the livelier look (2026-10-09)
- **Sky light spreads sideways (Q36).** A second light store, `SKL` (one byte per cell, about 25 MB for the 224 x 512 x 224 window), holds 15 in every open cell above its column's roof (`hm`) and spreads into covered cells one level per block, through anything that is not opaque, like block light. `sky()` returns the larger of the old height-map value and the spread (on the block light curve), so overhangs and cave mouths are lit from the side and nothing gets darker than before. Sources and spread are gated on `genDone` like block light, so streamed light stays exactly equal to a full recompute; 02-lighting and 27-streaming require that for sky light too, and 02-lighting also after about 800 edits. An edit relights a box 15 blocks around it that also covers every cell that changed between open and covered when the column's roof moved. Only open cells beside a covered column are queued, so lighting a chunk costs about the same as before.
- **Padded texture atlas on the GPU.** Each 16-pixel tile sits in a 32-pixel cell with 8 pixels of repeated edge around it, so mipmaps no longer blend neighbouring tiles: distant water and leaves lost their grid lines. The painted atlas and its colours are unchanged.
- **Blocky clouds:** flat boxes on a 12-block grid at sea level plus 150, drawn from the cloud texture's shapes, placed by world position so they stay put while you move and drift slowly; tinted at dusk and dark at night. **Moon phases:** eight, one per day, from a day counter saved with the world (`dn`). Sky, sun, moon, stars and clouds are hidden once you are well underground (they showed at the far edge of the lava sea).
- **Animated water and lava, glow, sway:** water is tinted deeper, shimmers slowly and catches sun glints; the lava sea rolls with brighter crests; light-giving blocks pulse slightly and show through fog from further away; plant tops sway. All of it is in the chunk shader; meshes are unchanged apart from two vertex flags (sway, lava).
- **Not done in M3b:** smaller vertex formats. The M3a meshing cuts already removed most of the vertex load at the surface; the owner's frame-rate check on the Ally X decides whether it is still needed.
Constrains: anything that changes which cells are open to the sky (`calcHM`) outside `setBlock` must relight the cells between the old and new roof; generation code never touches `SKL`.

### D-028 M3.5: natural generation before M4 (2026-10-09)
After playing 0.8.0 the owner found generation disjointed and random, the caves most of all: tunnels crossing everywhere and cutting partly through rooms, passages that lead nowhere, a maze of big rooms with no flow, floating lava, rivers in ravines 20 to 30 blocks deep, barrows all facing one way, stray stone structures in woods and grassland, and chaotic mountains. A new milestone, M3.5, comes before M4 (round 20 of `docs/DIRECTION_QA.md`, Q77 to Q100).
- **M3.5a rewrites the underground from scratch:** a planned cave-system generator (trunks, branches, some loops, real junctions, chambers with shape, descents between depths) with much less open space, sizes growing with depth, and no hard layer bands. Lava gets the sound-basin rule of D-024. Holds and mines stay. Mouths, stairways, places, remains and water are re-attached to the new systems.
- **M3.5b reworks the surface:** rivers in valleys, mountain ranges with passes, smoother ground with roughness by land, wide land blends, and placement rules for boulders, stairways, small ruins, barrows, trees and surface ruins.
- **Review:** a mid-way checkpoint after the cave prototype; each part ends with a seed tour and top-down height and cave maps before and after.
Constrains: the M2 layer table in `docs/DESIGN.md` becomes a gradient by depth; the existing determinism, chunk-local writes, staged streaming and exact lighting rules still hold for the new generator.

### D-029 M3.5a: cave systems in place of noise caves (2026-10-09)
- **Planned systems (Q78 to Q86, Q97):** the worm caves and the deep cavern noise are gone. Each region of 10 x 10 chunks (160 blocks) plans up to three cave systems as a pure function of the region (`caveBase`): a main one that winds from an entrance down to the deep and usually on to the lava sea, often a second reaching the middle depths or the deep, sometimes a third, shallow one. A system is a trunk of nodes joined by curved passages (ramps, steeper passages, spirals), with branches that end in chambers, loops back into the trunk, shafts, and chambers: domed halls (natural pillars in the big ones), rifts (ledges, sometimes a high window where a passage looks down into them) and stepped halls (terraces down to a lake). Passages only meet at nodes: every new path keeps three blocks of rock from all others and from chambers, which 21-deep checks over 3 to 4 million pairs of passage pieces per seed. Regions wander around a point off their middle so they do not show as a grid. Open rock under spawn is about 1.2 to 1.7% (about 28% before), more in the depths than near the surface.
- **Sizes by depth (Q84):** passage half-width 1.6 to 2.9 near the surface (1.1 to 1.9 in a quarter of them), up to 2.8 to 5.2 in the deep; rooms of 4 to 8 near the surface, halls of 8 to 17 in the middle depths, 18 to 38 across in the deep.
- **Ways between depths (Q83):** walkable descents throughout the trunk (entrances lead on foot 60 to 200 blocks down), shafts on loops, chasms (rift windows), streams of pools stepping down a run of the trunk (each pool sunk two deep under the lowest floor around it), gorges from the deepest hall down to the lava sea, links between neighbouring regions' deepest halls (about one region side in eight), and links from systems near a hold into the upper gallery (y44) of its mines (Q99), ending level with the gallery and kept out of its pits.
- **Lava (Q87):** the lava sea keeps its place under the land with smooth islands and pillars on a jittered grid that flare at both ends. Lava no longer appears in caves except in gorges that open onto the sea, small pools under lava falls (a slot in a deep hall's wall, its only open face) and the holds' forges. The drain pass now applies the water rule to lava outside holds, their mines and the sea; worm caves carving lava below y8, cavern lava pools and hanging lava columns are gone.
- **Water:** lakes only in stepped halls and pools along streams, both shaped to be held by rock. `plannedWater` lets the drain trust them at a chunk edge; a lake or pool is left dry wherever something could open it in one chunk and not the next: its own passage running low beside it, a gorge, a ravine, or a place built later (`placesTouch`).
- **Entrances (Q88):** the main system of a region always gets one if there is dry land (a mouth at the foot of a slope rising at least 4 in 7 blocks, else a sinkhole with a ramp spiralling down its wall); other systems in about one case in seven. Surface features keep off them (`caveMouthNear` in `surfTaken`). The median distance from open land to a way down is 54 to 64 blocks (seed 123456789, 4242).
- **Places:** ruined stairways, dungeon rooms and points of interest still open onto a passage of their own chunk (`caveAnchor`, now on the passage's real floor and outside chambers). With far fewer passages, stairways fell to about 0.3 per 1000 chunks; dungeon rooms (chance raised from 5% to 14%) are about 1.1 to 1.3 per 100 chunks and points of interest (40% to 60%) about 5.5, most of the built ones' share now going to sealed geodes and fossils, which need no passage. Remains stand in a great hall the plan marks (one region in about three). Old mineshafts are about one in twelve of what they were (their grid showed on the maps).
- **Tests:** 21-deep and the cave half of 23-entrances are rewritten for systems; 24-places checks eight windows to keep at least 8 rooms (built places are rarer); 28-meshing no longer asks the surface floor to halve the vertices at spawn (there is little cave left to skip: 1.25 million vertices in the whole band against 5.1 million in 0.7.0) and instead requires under 1.3 million with the floor. The world-hash snapshot changed in every block layer, column data and light; terrain and the city plan are unchanged.
- **Tools:** `npm run map` (`tools/map.mjs`) draws height, cave and section maps of generated windows, for the owner's before and after comparisons (Q100).
- **Saves:** `SAVE_KEY` is `fantasy-blockcraft-save-v6`, world data version 6.
Constrains: any new underground generator plans in `caveBase`/`cavePlan` (or stays clear of their elements) rather than carving its own tunnels; anything that opens rock after the caves must be visible to `placesTouch` or stay away from planned water.

### D-030 M3.5a.2: noclip in creative (2026-10-09)
The owner asked for a noclip toggle before M3.5b. It is a creative-only action (`noclip`, `toggleNoclip`): `collide` returns false while `PL.noclip` is set, so movement passes through blocks; it implies flying, and turning flying off turns noclip off first. Leaving noclip inside rock moves the player up to the first place they fit. Keyboard N, a touch button, and a pause-menu switch; the controller has no free button, so it uses the pause menu until rebinding arrives (M5). The noclip flag is saved with the player's position (`p[6]`) and only restored in creative.
Constrains: anything else that tests the player against blocks must go through `collide` (or check `PL.noclip`).

### D-031 M3.5b: a natural surface (2026-10-09)
- **Rivers in valleys (Q89):** the river band now lowers the land into a valley whose width grows with the height of the land beside it (up to about 65 blocks a side). The channel shelves into its banks, and rivers fade out where the land rises more than about 35 to 60 blocks or into a range. River columns with land more than 8 above the water within 5 blocks fell from 34% to about 1.3%. Ravines (the separate ravine noise) are unchanged.
- **Mountain ranges (Q90):** a ridged field at scale 230 replaces the small-scale ridge noise in the mountains, with saddles from a slower field and peaks only on the high ridges. The ranges still reach 463 to 479; mountain columns with a step of 4 or more fell from 1.2% to about 0.3%.
- **Smoothness (Q91):** the hill field is two octaves at scale 110 (was three at 90) with a smaller amplitude; green hills and elder wood use softer swells; the fine jitter on land borders is gone. High-frequency roughness roughly halved in most lands (green hills 0.66 to 0.37, moors 0.90 to 0.37, mountains 0.76 to 0.47).
- **Blends (Q92):** the land of a column is decided against a patchy threshold instead of 0.5, so borders mix over a wide band. 06-biomes now counts a change of land only once the new land holds for 40 blocks, so the mixing does not read as narrow lands.
- **Placement (Q93 to Q96):**
  - Boulders by land (moors, mountains, barrow downs) and on slopes of 2 or more, rare elsewhere.
  - The stray towers (`towerP`) and wells (`wellP`) are removed.
  - Barrows and rings only on the Barrow Hills, in clusters (99% have a neighbour within 70 blocks), in four facings and sizes 0.7 to 1.4, a third of them long, a fifth broken open (`barrowAt`).
  - Trees in groves: about 75 trunks per 1000 columns in groves against about 5 in clearings, on seed 123456789's spawn window.
  - Ruined stairways at the foot of a slope (chance raised from 0.9% to 15% of chunks to keep a few, about 0.8 per 1000 chunks).
  - Sites on commanding ground: towers and castles stand on average 4 to 5 blocks above the land around them, keeps by rivers, none in a hollow. They sit on an earth bank instead of a stone plinth.
- **Tests:** new 31-natural-surface. 07-gamepad moves the player in open sky, and 16-worlds picks an open dry spot, so neither depends on the terrain at the window's middle. 06-biomes as above.
- **Saves:** `SAVE_KEY` is `fantasy-blockcraft-save-v7`, world data version 7.
Constrains: rivers are tied to the land's relief, so a change to terrain heights changes where rivers run; surface features that should keep off cave entrances, roads and sites use `surfTaken`.

### D-032 M4a: tools, climbing and finding the way (2026-10-09)
M4 is split in two (the milestone sheet allows it). M4a is the items: the metal ladder, the broader kit, climbing gear, navigation, signal flares, the Blasting Keg's name, the creative-only Blueprint Tool and the starting kit. M4b is the survival systems: storage, the worn lamp and darker deeps, earned fast travel, food.
- **The ladder (Q19):** `TOOL_LADDER` in `items.js` makes a pickaxe, an axe and a shovel of each of wood, stone, copper, bronze, iron, steel and moonsilver (pickaxes keep ids 240 to 246; axes 300 to 306, shovels 310 to 316). Speed 2, 3, 4, 5, 6.5, 8, 10 and wear 60, 130, 200, 280, 400, 700, 1500 blocks rise strictly. Ore tiers follow it, so each pickaxe is the first that can mine the next metal's ore: coal 1, copper and zinc 2, tin and gold 3, iron 4, platinum and diamond 5, moonsilver 6, obsidian 7. Tin moved from 2 to 3 and iron from 3 to 4 so that copper and bronze are each needed.
- **Tools by material:** an item is a tool when its `ITEMS` entry has `{tool, tier, speed, dur}`; `toolFits` in `mining.js` decides what it speeds (pickaxe stone, ore and metal; axe wood; shovel earth and sand; shears leaves, cloth and soft plants). Only a pickaxe's tier lets ore drop. Durability comes from `dur` (`durOf`), replacing the `DUR` table. Wool has its own material, `cloth`.
- **Gold and platinum (Q68):** special tools. The platinum pickaxe is the fastest made pickaxe and wears out in 150 blocks; the gold sickle cuts every soft plant within two blocks in a stroke and harvests and replants ripe crops. Bronze shears keep leaves, cobwebs and plants whole.
- **Climbing (Q45, Q66):** ladders, iron pitons, rope and the grapnel are climbable blocks (`climb`). In one, jump climbs at 3.2 blocks a second, down or sprint descends, and no input holds the player still; climbing resets the fall height. Ladders need a wall and the ground or a ladder below; pitons go only into rock. Rope placed under something (or against a wall) unrolls downward as far as the carried rope and the open space allow (at most 48); taking a rope takes everything below it. The grapnel replaces the grappling hook: thrown at a wall up to 24 blocks away, it catches the first top edge within 10 blocks above the hit that has room to stand, becomes a `GRAPNEL` block and hangs the carried rope below it. Ladders, pitons and the grapnel are drawn as a panel on the wall beside them (`wall` in the mesher). Placing a non-solid block no longer pops a climbable block above it.
- **Finding the way (Q66):** in survival the minimap shows only while a map is carried; X, Z and the heading need a compass, the height a depth gauge. Creative shows everything. The map is made from birch parchment and coal, and is in the starting kit.
- **Signal flares (Q45):** replace fireworks. A flare climbs about 60 blocks and then burns red as it drifts down for 10 seconds, growing with distance so it can be seen from far off.
- **Blasting Keg (Q44):** its side texture spelled TNT; it is now a hooped keg with a red rune (same random draws, so no other tile changes).
- **Blueprint Tool (Q42):** no recipe and refused in survival; the blueprint list is hidden in the survival inventory.
- **Starting kit (Q59):** a new survival world starts with a wooden pickaxe and axe, a map, 8 torches and 4 bread. `32-items` checks every recipe can be reached from the kit and the natural world.
- **Fixed on the way:** cold sconces, burnt-out torches and dim glowstone had no hardness, so survival could never break them; 10-content-tables now requires a hardness, material and tier on every block.
- **Saves:** the world and the save format are unchanged (`fantasy-blockcraft-save-v7`); the hook and fireworks drop out of saved hotbars.
Constrains: new tools are `ITEMS` entries with `tool`; new climbable blocks set `climb` and must not be popped by `setBlock`; anything that aims (`camDir`, `eyePos`) works from `PL.yaw`/`PL.pitch`, not the camera, so tests can aim.

### D-033 M4b: storage, the worn lamp, earned travel and food (2026-10-09)
- **Containers (Q20, Q67):** the new Oak Chest and the world's supply crates, dwarven chests and barrels hold items by world position in `boxes` (`gameplay/storage.js`), saved as `cs`. A world container rolls its loot from its position (`lootOf`, the same roll as before) the first time it is opened and keeps whatever is left; it no longer vanishes. In survival the inventory screen shows the container above the pack, and tapping a slot on either side moves the stack across (tools keep their wear); creative only looks inside. A container that holds anything, or a world container never opened, cannot be broken. Left click now breaks containers (once empty) instead of opening them; the place button opens them.
- **More room (Q67):** the inventory has 36 slots, plus 9 with a Woven Pack or 18 with a Sturdy Pack (made from a woven one) in the pack slot, plus 9 with a Satchel in the bag slot: `INV_MAX` 63, `invCap()` in use. A smaller pack or bag is refused while the slots it would lose hold anything. Graves put equipment back on first.
- **The worn lamp (Q36, Q65):** in survival the light around the player (the shader's carried lamp) comes only from a Miner's Lantern in the belt slot (strength 1, reach 18) or a light held in the hand (a torch reaches about 11). The lantern burns only where the light at the player's eyes is under 0.4, 20 minutes per Lamp Oil and 8 per Pitch Candle, taken from the pack as it runs out (`lampTick`). Creative keeps the old carried lamp. In survival the ambient light in caves falls with depth (`depthDim`): full above y260, a quarter by y60. The Caves setting's middle option is renamed Normal and now also shortens (Dark) or lengthens (Bright) the lamp's reach.
- **Earned travel (Q15, Q71):** R refuses in survival (death still returns you to spawn). Using an Ancient Waystone attunes it (saved as `at`, with the name of its site or hold gate); a Carved Waystone (the old waypoint block, now 2 diamonds, 4 platinum, 6 stone bricks and a rune stone) counts as soon as it is placed. In survival T, the map and a waystone's travel list work only within 4.5 blocks of a waystone, and only to another. Creative travels from anywhere. Travel works from each stone's world key, not its beam's position.
- **Food (Q52):** turnips and beans are planted as they are and grow in three stages (`CROP_NEXT`, `PLANT_OF`); the sickle replants them. Generation places bilberry bushes (woods and moors, in patches), brown mushrooms (woods) and wild turnips (open country) in the plant pass from `hsh(X,7,Z)` (no stream draws). Tall grass sometimes gives beans. Four dishes cook at a furnace: roast turnip (5), pottage (9), bilberry tart (7), roast mushrooms (4).
- **Fixed:** since 0.11.0 a comment swallowed the end of a line in `openInv`, so the survival inventory could show the creative block menu after creative had been used.
- **Saves:** generation changed (foraging plants) and the save data gained `cs` and `at`: `SAVE_KEY` is `fantasy-blockcraft-save-v8`, world data version 8. The world-hash snapshot changed only in the surface band.
Constrains: anything that removes a container block goes through `setBlock` (which forgets its contents); light around the player in survival comes from `lampLevel`; travel in survival needs `canTravel`.

### D-034 0.12.1: render resolution follows the screen (2026-10-09)
The owner saw low-resolution, blended textures on the desktop and not on the phone. The renderer drew at no more than 1.25 pixels per CSS pixel on desktop (1.5 on touch), so on a desktop scaled to 150% or 200% the game drew 83% or 62% of the screen's pixels and the browser stretched the picture, blurring the 16-pixel textures; the lower resolution also made distant textures fall to blended mipmaps sooner. A phone's pixels are small enough that half resolution still looks sharp.
- **Resolution setting** (`settings.res`, pause menu): Auto (default) starts at the screen's full density, up to 2 on desktop and 1.5 on touch; Sharp uses the full density up to 3; Fast draws one pixel per CSS pixel.
- **Auto under load** (`autoView`, `resStep`): when frames are slow the view distance comes in to 72 blocks first, then the resolution drops in steps of 0.25 to 1, then the view to 56; when frames are smooth again the resolution comes back first, then the view.
- The info readout shows the resolution as a percentage of the screen's pixels.
- No change to the world or saves.
Constrains: anything that changes the renderer's pixel ratio goes through `setRes`.
