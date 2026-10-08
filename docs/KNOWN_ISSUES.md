# Known issues

- **Isolated chambers.** About 0.5% of hold rooms have no doorway because no neighbouring cell is part of the hold (3 of 585 in the hold of region 0,0 on seed 123456789). Reachable only through caves or by digging.
- **Streaming is spread over frames since M3a**, at about 0.4 to 0.7 ms per frame (median, cloud VM). Still to confirm on the Ally X: worst steps are about 5 to 8 ms (a step in a hold or one that builds worm lists after travel), and meshing a chunk in a cave (wider band) costs more than at the surface.
- **Mesh geometry:** at spawn the surface floor cuts the vertices meshed by about 77% (5.1 million to 1.2 million for the inner chunks, headless count). Unchecked in a browser: looking into a deep shaft or a cave mouth from the surface should show darkness below 24 blocks under the lowest ground around it; if it shows sky colour or holes, report it (D-025). Smaller vertex formats are M3b.
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
- **Chunk generation CPU is unchanged by M3a** (about 12 to 17 ms per chunk on the cloud VM); M3a spreads it over frames rather than shrinking it.
- **The test suite is slow:** about 7 minutes on the cloud VM since M2b, mostly 23-entrances regenerating the window at each route it walks. Run single cases while working (`npm test -- name`).
- **Points of interest can lose a piece of furniture** where the passage to their cave runs through the room.
- **Auto view distance is unverified on a device.** It is simulated in 29-view; on the Ally X it should settle near the far end on the surface and pull in only when frames drop. Choose Near, Normal or Far in the pause menu to override it.
