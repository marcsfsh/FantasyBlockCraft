---
name: release-build
description: Cut a Fantasy BlockCraft release - build both targets, refresh the committed root fantasy-blockcraft.html, confirm CI when Actions minutes allow, bump the version, write the changelog entry, and tell the owner how to get the build onto their devices.
---

# Release build

## 1. Verify
```
npm test
npm run build
npm run check
```
All must pass (see `test-pass`); `npm run check` also confirms the committed root `fantasy-blockcraft.html` matches the source. If GitHub Actions is running (the owner's monthly minutes can run out), confirm the latest CI run for the branch head is green and has both artifacts. If runs fail in about 2 seconds with no logs, the minutes are used up: say so, and rely on the local results.

## 2. Version
Semantic version in `package.json` (`"version"`): patch for fixes, minor for new content or generation changes, major only if saves are retired in a way players must know about. Edit the file directly; do not run `npm version` (it tags and commits on its own).

## 3. Changelog
Rename `## Unreleased` in `CHANGELOG.md` to `## X.Y.Z (YYYY-MM-DD)`, add a fresh empty `## Unreleased` above it, and make sure Game lines come first and say if old saves no longer load (save key bumped).

## 4. Commit and PR
Commit "Release X.Y.Z" with the version, the changelog and, if the build changed, the refreshed root `fantasy-blockcraft.html`. The release reaches players when the PR merges into `main`.

## 5. Tell the owner how to get it
- **Always available:** after the merge, `fantasy-blockcraft.html` at the root of `main` is the release. On GitHub: open the file, **Download raw file**, open it in a browser (needs internet for three.js). Saves are per browser and per file location.
- **Pages, if enabled and Actions has minutes:** `https://marcsfsh.github.io/FantasyBlockCraft/` (game folder) and `.../fantasy-blockcraft.html`.
- **CI artifacts, if Actions has minutes:** Actions tab > CI run for the merge commit > Artifacts. They expire after 30 days.

Say in the PR which seed and places are worth a look for the changes in this release.
