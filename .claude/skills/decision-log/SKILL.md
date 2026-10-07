---
name: decision-log
description: When and how to record Fantasy BlockCraft changes in docs/DECISIONS.md, docs/KNOWN_ISSUES.md and CHANGELOG.md. Use at the end of any change that alters behaviour, generation, tooling or a known issue.
---

# Decision log

## docs/DECISIONS.md: a decision a later change could undo
Add an entry when you choose between real alternatives, set or change a threshold, bump or decide not to bump `SAVE_KEY`, change the build output, add a dependency, or change a rule in `docs/ARCHITECTURE.md`. Not for routine fixes.

Format (newest last, next free number, today's date):
```
### D-0NN Short title (YYYY-MM-DD)
What was decided. Why, including the rejected alternative. What it constrains from now on.
```
Never rewrite an old entry; supersede it: "Supersedes D-0xx" in the new one, and add "(superseded by D-0NN)" to the old title.

## docs/KNOWN_ISSUES.md: the current list of problems
- Found a bug you are not fixing: add a bullet with how to reproduce (seed, place, test).
- Fixed one: delete the bullet and mention the fix in CHANGELOG.
- Changed one: edit it so it stays true. The list describes now, not history.
- Keep `docs/ROADMAP.md` in step: it lists known issues as work items.

## CHANGELOG.md: what changed, for the owner
Under `## Unreleased`, in `### Game` (anything a player would notice: world, blocks, controls, performance) or `### Tooling` (build, tests, CI, docs). One line each, plain words, no internal names unless needed. Generation changes say so and say whether old saves were retired.

## Checklist before the PR
- Generation changed: DECISIONS entry with the save key decision, CHANGELOG Game line.
- Threshold or snapshot changed: DECISIONS entry with the reason.
- Known issue found or fixed: KNOWN_ISSUES and ROADMAP updated.
- New file, command or rule: ARCHITECTURE, TESTING, README or CLAUDE.md updated as fits.
- The PR description lists which of these files changed.
