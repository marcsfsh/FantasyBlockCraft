# Known issues

- **Isolated chambers.** About 1% of ruin rooms have no doorway because no neighbouring cell is part of the ruins. Reachable only through caves. By design for now; the city is restructured in M2.
- **Streaming hitch.** Streaming one chunk (generate, light, map) costs about 10 ms of CPU on the cloud VM and more in a browser, against a 5 ms per-frame budget that cannot split a chunk, so the frame rate dips while new terrain streams in. M3.
- **Mesh geometry is heavy:** about 8 million vertices and 290 MB of buffers with all 196 chunks meshed (headless count). M3.
- **Sunken water leaks at chunk borders.** The tidy pass cannot see open air in the neighbouring chunk. M2.
- **Single file needs the network.** The single-file build still loads three.js r128 from the CDN (see D-015), and both builds load the VT323 font from Google Fonts (the game falls back to a system font offline). The game folder uses the vendored three.js and otherwise runs offline.
- **Free teleports in survival:** R returns to spawn and waypoints teleport anywhere. Replaced by earned fast travel in M4.
- **ROG Ally X input detection is unverified on the device.** Since 0.2.0 the touch layout is chosen automatically only when no precise pointer exists, and the pause menu has Touch: Auto / On / Off to force it (D-020). Confirm on the Ally which Auto picks.
- **Headless tests stub the browser.** `performance.now()` returns 0 in tests, so time budgets do not apply there; nothing is rendered, and DOM event handlers (keys, pointer lock, menus) cannot be exercised.
- **Mining drops can be lost when the pack is full** (`mineTick` ignores what does not fit, with a toast). M4 storage.
- **Sand that falls on its own** after a save is not tracked as a player change, so it can reappear at its old height after a reload (D-021). Rare: falling sand is almost always player-caused.
