# Known issues

- **One blocked doorway** found by the doorway test with seed 777, on the upper floor between cells (-3,1) and (-2,1): an atrium into a raised archive. Diagnosed 2026-10-08: wall-break decay leaves gravel on the wall line (k=h), and the path-clearing strip in `applyRuins` only covers k<h; the room's +2 floor offset already uses the one-block step. Fix in M0.
- **Isolated chambers.** About 1% of ruin rooms have no doorway because no neighbouring cell is part of the ruins. Reachable only through caves. By design for now.
- **Streaming hitch.** Generating one chunk takes about 20 ms, so the frame rate dips while new terrain streams in.
- **Sunken water leaks at chunk borders.** The tidy pass cannot see open air in the neighbouring chunk.
- **Single file needs the network.** The single-file build still loads three.js r128 from the CDN (see D-015), and both builds load the VT323 font from Google Fonts (the game falls back to a system font offline). The game folder uses the vendored three.js and otherwise runs offline.
- **Legacy code still bundled:** towns, roads, power tools, power network, trading and coins. Traders and mints are craftable in survival, and banned power blocks still appear in the creative menu's "Other" category and in generated rooms (lab, Machine Hall). Some of `legacy/` is still used by live code (`pick`, `dungeonP`, `showName`, `canCraft`, ...); see `docs/ROADMAP.md` before deleting anything.
- **Headless tests stub the browser.** `performance.now()` returns 0 in tests, so time budgets do not apply there; nothing is rendered.

## Found by a full code read (2026-10-08), scheduled in `docs/MILESTONES.md` M0

- **Saved edits above y127 land in the wrong place.** `wkey` packs y into 7 bits (`*128+y`) but the world is 384 tall, so `keyXYZ` decodes y as `y%128` and shifts Z. Every surface edit reloads deep underground; undo, waypoint beams and waypoint travel use wrong positions. Confirmed: `wkey(5,310,7)` decodes to `[5,54,9]`.
- **High Mountains always snow** (`updWeather`: `PL.y>90` from the old 128-tall world) and **Heath Moors and Barrow Hills never rain** (old desert biome ids).
- **Crops under a roof or underground never grow:** random ticks only touch the top block of each column.
- **"You starved" can never show** (starvation stops at 1 HP by design; the message is dead).
- **Explosions empty a grave into the player's inventory** wherever the player is; **crate loot that does not fit is lost**; in creative, opening crates and graves fills the survival inventory.
- **Held items take priority over using blocks:** holding food, seeds or a hoe stops right-click from opening lecterns and crates.
- **Streamed-in torches have no flames:** `lightChunk` never adds generated torches to `torches`.
- **The simulation runs while paused:** lit kegs, falling blocks and water flow keep updating.
- **Esc does not close the inventory**, and switching from gamepad to mouse mid-play leaves the game without pointer lock.
- **The ROG Ally X may be detected as a touch device** (`TOUCH` from `(pointer:coarse)` at load), which would give phone defaults. Not yet verified on the device.
- **Naming:** the HUD says "TNT" for the Blasting Keg; lore says "titanium" for Moonsilver; `RUIN_NAMES` has a duplicate `junction` key; decay can remove lecterns that hold lore.
- **The hold-name generator can produce Tolkien names** (Durin, Thrain, Mordor). Fixed by the naming module in M1.
- **Mesh geometry is heavy:** about 8 million vertices and 290 MB of buffers with all 196 chunks meshed (headless count). Addressed in M3.

