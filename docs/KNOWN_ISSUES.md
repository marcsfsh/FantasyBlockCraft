# Known issues

- **One blocked doorway** found by the doorway test with seed 777: a cistern into an archive. Not yet diagnosed.
- **Isolated chambers.** About 1% of ruin rooms have no doorway because no neighbouring cell is part of the ruins. Reachable only through caves. By design for now.
- **Streaming hitch.** Generating one chunk takes about 20 ms, so the frame rate dips while new terrain streams in.
- **Save key not bumped** after the latest biome tuning, so a world started before it mixes old edits with new terrain.
- **Sunken water leaks at chunk borders.** The tidy pass cannot see open air in the neighbouring chunk.
- **three.js from a CDN.** The game folder build needs the library vendored to run offline.
- **Legacy code still bundled:** towns, roads, power tools, power network, trading and coins (traders and mints exist only in creative).
- **Headless tests stub the browser.** `performance.now()` returns 0 in tests, so time budgets do not apply there; nothing is rendered.
