# Fantasy BlockCraft

A voxel sandbox set in a long-abandoned, Tolkien-esque world: old lands on the surface, and a deep, layered underground that ends in the ruins of a dwarven city and its mines.

## Commands

Needs Node 18 or newer. There are no packages to install yet.

| Command | What it does |
|---|---|
| `npm run build` | Builds both targets into `dist/` |
| `npm run build:single` | One self-contained HTML file: `dist/single/fantasy-blockcraft.html` |
| `npm run build:web` | A game folder: `dist/web/index.html` with `css/`, `js/` and `assets/` |
| `npm run dev` | Builds the game folder, serves it at http://localhost:5173 and rebuilds on every change in `src/` |
| `npm test` | Runs every headless test in `tests/cases/` |
| `npm run test:quick` | Runs the smoke and lighting tests only |

## Layout

| Path | Contents |
|---|---|
| `src/html/index.template.html` | Page markup with `{{STYLE_BLOCK}}` and `{{GAME_SCRIPT}}` placeholders |
| `src/css/style.css` | All styles |
| `src/js/` | Game source, one file per system, bundled in the order given by `src/js/manifest.json` |
| `tools/` | Build and dev server (no dependencies) |
| `tests/` | Headless test harness and test cases |
| `docs/` | Design, architecture, decisions, testing notes and known issues |

See `docs/ARCHITECTURE.md` before changing code, and `docs/DESIGN.md` before changing content.
