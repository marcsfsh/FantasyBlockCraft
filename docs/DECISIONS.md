# Decision log

Newest last. Each entry: what was decided, why, and what it constrains. Add an entry for any decision that a future change could accidentally undo.

### D-001 Modular source, two build targets (2026-10-05)
The single HTML file was split by system into `src/`, bundled by a dependency-free Node build into either one HTML file or a game folder. Keeps the single-file option while letting the game grow past it.

### D-002 Deterministic, chunk-local generation (earlier)
Generation is a pure function of seed and world coordinates and writes only inside the current chunk. Required for endless streaming and for saves that store only edits. See ARCHITECTURE rules 1 to 4.

### D-003 Classic worm caves and gentle terrain (earlier)
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
