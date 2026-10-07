# Fantasy BlockCraft

A voxel sandbox set in a long-abandoned, Tolkien-esque world: old lands on the surface, and a deep, layered underground that ends in the ruins of a dwarven city and its mines.

## Play the latest build

**With GitHub Pages (once enabled).** Every push to `main` runs the Pages workflow, which tests, builds and publishes:

- `https://<owner>.github.io/<repository>/` (for this repository, `https://marcsfsh.github.io/FantasyBlockCraft/`) : the game folder (three.js included, works on any device with a modern browser)
- `https://<owner>.github.io/<repository>/fantasy-blockcraft.html` : the single-file build

One-time setup: repository **Settings > Pages > Build and deployment > Source: GitHub Actions**, then re-run the latest Pages workflow from the Actions tab (or push to `main`). Until Pages is enabled the workflow skips itself and stays green. Pages on a private repository needs a paid plan; without it, use the artifacts below.

**From any branch or pull request (artifacts).** Every push and pull request runs the CI workflow. Open the run from the Actions tab (or the checks on the pull request), scroll to **Artifacts**, and download:

- `fantasy-blockcraft.html` : the single-file build as a plain HTML file. Double-click it to play; it needs an internet connection for three.js and the font.
- `fantasy-blockcraft-web` : a zip of the game folder, with three.js included. Unzip it and open `index.html`. If a browser refuses to run it from disk, serve the folder instead, for example `python -m http.server` inside it, and open the address it prints.

Artifacts are kept for 30 days. Saves live in the browser's local storage, separately for each address you play from.

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
