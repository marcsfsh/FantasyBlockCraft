# Changelog

All notable changes to Fantasy BlockCraft. Newest first. Versions follow `package.json`.
Entries are grouped under **Game** (anything a player would notice) and **Tooling** (build, tests, CI, docs).

## Unreleased

### Tooling
- Imported the modular source into this repository.
- Added `CLAUDE.md` and this changelog.
- Added `.gitattributes` (LF line endings everywhere).
- Vendored three.js r128 in `vendor/`; the game folder build now runs offline. The single-file build is unchanged.
- Added `npm run check` and `npm run check:syntax`.
- Added a determinism test (08), a world-hash snapshot test for two seeds (09), `snapshot()` and multi-seed cases in the harness, and `npm run bench` with a baseline in `docs/PERF.md`.
- Added `.claude/settings.json`: permission rules for the project's scripts, node and git, and a post-edit syntax-check hook for `src/`.
- Added a content-tables test (10) and seven project skills in `.claude/skills/`.
- Added `docs/ROADMAP.md` (known work only) and `docs/ES_MODULES_PLAN.md` (plan, not started).
- Added GitHub Actions: CI (tests, both builds, downloadable artifacts) and Pages (publishes `main`, skips itself while Pages is off).

## 0.1.0 (2026-10-05)

### Game
- The single HTML file split into a modular source with two build targets. No gameplay changes.
