---
name: release-build
description: Cut a Fantasy BlockCraft release - build both targets, confirm CI, bump the version, write the changelog entry, and tell the owner how to get the build onto their devices (GitHub Pages or CI artifacts).
---

# Release build

## 1. Verify
```
npm test
npm run build
npm run check
```
All must pass (see `test-pass`). Then confirm CI is green on the branch head: list the latest CI run for the branch with the GitHub tools and check its conclusion and that both artifacts (`fantasy-blockcraft.html`, `fantasy-blockcraft-web`) exist. A red or missing run blocks the release.

## 2. Version
Semantic version in `package.json` (`"version"`): patch for fixes, minor for new content or generation changes, major only if saves are retired in a way players must know about. Edit the file directly; do not run `npm version` (it tags and commits on its own).

## 3. Changelog
Rename `## Unreleased` in `CHANGELOG.md` to `## X.Y.Z (YYYY-MM-DD)`, add a fresh empty `## Unreleased` above it, and make sure Game lines come first and say if old saves no longer load (save key bumped).

## 4. Commit and PR
Commit "Release X.Y.Z" with only the version and changelog. The release reaches players when the PR merges into `main`.

## 5. Tell the owner how to get it
- **Pages enabled:** after the merge, the Pages workflow publishes `https://marcsfsh.github.io/FantasyBlockCraft/` (game folder) and `.../fantasy-blockcraft.html` (single file). On a phone, tablet or handheld, open that address; reload to update. Saves are per address and per browser.
- **Pages not enabled:** Actions tab > CI run for the merge commit > Artifacts: `fantasy-blockcraft.html` (open directly; needs internet for three.js) or `fantasy-blockcraft-web` (zip; unzip and open `index.html`, works offline). Artifacts expire after 30 days.
- Optionally the owner can attach both files to a GitHub Release by hand; there is no release workflow.

Say in the PR which seed and places are worth a look for the changes in this release.
