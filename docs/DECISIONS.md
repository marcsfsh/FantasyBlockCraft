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

