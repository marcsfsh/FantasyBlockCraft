# Known issues

- **Isolated chambers.** About 0.5% of hold rooms have no doorway because no neighbouring cell is part of the hold (3 of 585 in the hold of region 0,0 on seed 123456789). Reachable only through caves or by digging.
- **Streaming hitch.** Streaming one chunk (generate, light, map) costs about 10 ms of CPU on the cloud VM and more in a browser, against a 5 ms per-frame budget that cannot split a chunk, so the frame rate dips while new terrain streams in. M3.
- **Mesh geometry is heavy:** about 8 million vertices and 290 MB of buffers with all 196 chunks meshed (headless count). M3.
- **Underground water near chunk borders drains.** The drain pass cannot see the next chunk, so outside the deep lake level and hold floors, a pool touching a chunk edge is drained rather than risk a wall of water (D-024). Underground pools are therefore small, or deep lakes at y64.
- **Single file needs the network.** The single-file build still loads three.js r128 from the CDN (see D-015), and both builds load the VT323 font from Google Fonts (the game falls back to a system font offline). The game folder uses the vendored three.js and otherwise runs offline.
- **Free teleports in survival:** R returns to spawn and waypoints teleport anywhere. Replaced by earned fast travel in M4.
- **ROG Ally X input detection is unverified on the device.** Since 0.2.0 the touch layout is chosen automatically only when no precise pointer exists, and the pause menu has Touch: Auto / On / Off to force it (D-020). Confirm on the Ally which Auto picks.
- **Headless tests stub the browser.** `performance.now()` returns 0 in tests, so time budgets do not apply there; nothing is rendered, and DOM event handlers (keys, pointer lock, menus) cannot be exercised.
- **Mining drops can be lost when the pack is full** (`mineTick` ignores what does not fit, with a toast). M4 storage.
- **Sand that falls on its own** after a save is not tracked as a player change, so it can reappear at its old height after a reload (D-021). Rare: falling sand is almost always player-caused.
- **Holds are far away and the climb is long.** The nearest hold is usually 1500 to 2500 blocks from spawn. Its gates stand on the highest ground over its outer ring, often a mountainside, so the spiral stair can climb 250 to 350 blocks; old roads lead to them from the nearest ruined site.
- **Generated names are drafts.** Human, goblin, gnome and drow names on sites and remains come from the draft styles in `core/names.js`, waiting for the owner's approval (Q28).
- **Inhabited holds are empty.** They are tidy and lit, but their people arrive with settlements in E2.
- **Chunk generation and streaming are slower** since M2a (median 0 to 30% depending on the seed, measured back to back with 0.4.0 on the cloud VM; `docs/PERF.md`): the deep pass and the taller columns. M3.
- **The test suite is slow:** about 7 minutes on the cloud VM since M2b, mostly 23-entrances regenerating the window at each route it walks. Run single cases while working (`npm test -- name`).
- **Points of interest can lose a piece of furniture** where the passage to their cave runs through the room.
