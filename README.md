# Fantasy BlockCraft

A voxel sandbox set in a long-abandoned, Tolkien-esque world: old lands on the surface, and a deep, layered underground that ends in the ruins of a dwarven city and its mines.

## Commands

Needs Node 18 or newer (CI uses Node 22). There are no packages to install: tooling uses Node built-ins only, and three.js r128 is vendored in `vendor/`.

| Command | What it does |
|---|---|
| `npm run build` | Builds both targets into `dist/` |
| `npm run build:single` | One self-contained HTML file: `dist/single/fantasy-blockcraft.html` |
| `npm run build:web` | A game folder: `dist/web/index.html` with `css/`, `js/`, `vendor/` and `assets/`. Uses the vendored three.js, so it runs offline; add `-- --three=cdn` to load it from the CDN instead |
| `npm run dev` | Builds the game folder, serves it at http://localhost:5173 and rebuilds on every change in `src/` |
| `npm test` | Runs every headless test in `tests/cases/` |
| `npm run test:quick` | Runs the smoke and lighting tests only |
| `npm run check` | Builds both targets, syntax-checks the bundle and the built files, runs the smoke test |
| `npm run check:syntax` | Syntax-checks the bundle only (well under a second) |

## Layout

| Path | Contents |
|---|---|
| `src/html/index.template.html` | Page markup with `{{STYLE_BLOCK}}` and `{{GAME_SCRIPT}}` placeholders |
| `src/css/style.css` | All styles |
| `src/js/` | Game source, one file per system, bundled in the order given by `src/js/manifest.json` |
| `tools/` | Build, checks and dev server (no dependencies) |
| `vendor/` | three.js r128, committed so builds never need the network |
| `tests/` | Headless test harness and test cases |
| `docs/` | Design, architecture, decisions, testing notes and known issues |

See `docs/ARCHITECTURE.md` before changing code, and `docs/DESIGN.md` before changing content.
