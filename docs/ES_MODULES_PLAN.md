# Plan: converting the source to ES modules

Status: **plan only, not started.** Each numbered step is its own PR. Do roadmap section 2 (delete legacy code) first.

## Where we are

- `src/js/*.js` are classic scripts concatenated in `manifest.json` order inside one strict-mode IIFE. Every top-level name is visible to every file; top-level code runs in manifest order.
- Tests depend on that shared scope: each case is pasted at `/*@test-hook*/` inside `generate()` and reads internals by name (`world`, `genChunk`, `edgeOpen`, ...).
- Both builds and the harness consume `bundleJS()` from `tools/lib.mjs`.
- No dependencies (D-016), so there is no off-the-shelf bundler.

## Goals and constraints

- Explicit `import`/`export` per system, so dependencies are visible and dead code can be found.
- **Behaviour unchanged at every step.** The strongest check available: the bundle produced from converted files is **byte-identical** to the bundle before conversion, so the single-file build, the world hash and every test are unchanged by construction.
- Convert one file per step; the game builds and passes `npm test` after every step.
- The single-file build remains possible.

## Approach: modules in source, the same classic bundle out

Convert files to real ES module syntax, but keep building the same single classic script by **stripping** module syntax at build time: `import ... from '...';` lines are removed whole, and a leading `export ` is removed from `export function`, `export const`, `export let`. Converted and unconverted files can then coexist, and the output can be compared byte for byte. Native browser modules come only at the very end (step 7), once the code no longer relies on the shared scope.

## Steps

### 0. Tooling (no source changes)
1. In `tools/lib.mjs`, `bundleJS()` strips module syntax from manifest entries marked `"module": true`. Unmarked files pass through untouched, so the bundle is identical until a file is converted.
2. Add `tools/check-modules.mjs` and a test that, for each module file, compares the names it uses from other files with what it imports, and its exports with what others use. This needs a JavaScript parser to find free identifiers. Options, to be decided and logged: write a small scope analyser using Node built-ins only, or add `acorn` as the single dev dependency with a SessionStart hook (amending D-016). Recommendation: `acorn`; a hand-written scope analyser for this dense code is a project of its own.
3. Extend `npm run check` to assert the stripped bundle equals the bundle from the previous commit for conversion PRs (compare `dist/single/fantasy-blockcraft.html` against a build of the base commit).

### 1. Leaves first: core and blocks
`core/config.js`, `core/noise.js`, `blocks/blocks.js`, `blocks/items.js`, `blocks/atlas.js`. Add `export` to what other files use and `import` lines for what each file uses. Acceptance: single file byte-identical, `npm test` green, check-modules clean for these files.

### 2. World generation
`world/terrain.js`, `world/caves.js`, `world/underground-sites.js`, `world/cave-life.js`, `world/features.js`, `world/mines.js`, `world/chunk-generation.js`. Shared mutable generation state (`gx0`, `gz0`, `OX`, `OZ`) is reassigned across files; with stripping that still works, but list every such binding in the PR, because step 7 must replace them.

### 3. Ruins
`ruins/city-plan.js`, `ruins/holds-and-lore.js`, `ruins/pillared-deep.js`, `ruins/rooms.js`, `ruins/megastructures.js`. They reference each other heavily (and `ROOM_LOOT` is read by `world/underground-sites.js`); cycles are allowed in ES modules but note them.

### 4. Engine
`engine/lighting.js`, `engine/renderer.js`, `engine/chunk-mesher.js`, `engine/editing-and-physics.js`, `engine/audio.js`, `engine/particles.js`, `engine/world-streaming.js` (which holds the test hook).

### 5. Gameplay, input and UI
`gameplay/*`, `input/*`, `ui/*`.

### 6. Main loop
`core/main-loop.js` last; it touches everything.

### 7. Native modules (a separate decision)
Only once every file is a module and check-modules is clean:
1. Replace cross-file reassignment of `let` bindings (imports are read-only) with state objects, e.g. `export const win={OX:0,OZ:0}`, one system per PR. This changes code, so the bundle is no longer byte-identical; the world hash and all tests must still pass.
2. Make top-level side effects explicit: an `init()` per system called in today's manifest order from one entry module.
3. Give the harness a test entry point that imports what the cases need (or a `debug` namespace module), replacing the paste-at-hook mechanism; port the cases.
4. `dist/web` loads `<script type="module" src="js/main.js">`; the single file keeps a stripped bundle (the strip build already orders files).
5. Update ARCHITECTURE, CLAUDE.md, TESTING and log the decision.

## Per-step checklist

- Only module syntax added; no renames, no reformatting, no logic changes (D-017).
- `npm run check`, full `npm test`; single file byte-identical to the base commit (steps 1 to 6).
- `docs/ARCHITECTURE.md` module table notes which files are modules; CHANGELOG Tooling line.

## Risks

- **Load order.** Stripping keeps manifest order, so nothing moves until step 7. Do not reorder the manifest during steps 1 to 6.
- **Name collisions.** Some files declare short helper names locally (for example `I` inside functions shadows the global `I`); the scope check must treat shadowing correctly.
- **Test access.** Until step 7 tests keep working unchanged; after it, every case needs the names it uses exported somewhere.
