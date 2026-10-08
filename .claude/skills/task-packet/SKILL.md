---
name: task-packet
description: Turn a rough Fantasy BlockCraft request into a task packet (scope, constraints, acceptance criteria, tests to run, docs to update, what to check in-game) before any code is written. Use at the start of any change bigger than a one-line fix.
---

# Task packet

Write the packet in the conversation (not a file) before touching code, then follow it. If the request is ambiguous on something only the owner can decide (look, feel, balance), ask once; otherwise pick the option most in line with `docs/DESIGN.md` and say so.

## Read first
- `docs/DESIGN.md` for content and setting; `docs/ARCHITECTURE.md` for code; `docs/KNOWN_ISSUES.md` and `docs/ROADMAP.md` in case the request is already known.
- The files named in the module table for the system involved.

## Packet template

```
Goal:        one sentence, in the player's terms
Scope:       files/systems that will change; explicitly out of scope
Constraints: setting pillars that apply; generation rules that apply (determinism, PW/GW,
             random-stream invariants, save key, exact lighting); no new dependencies
Generation:  does this change the generated world? yes/no. If yes: snapshot update and
             save key bump needed (use the worldgen-change skill)
Acceptance:  numbered, checkable criteria (test names, metrics, thresholds)
Tests:       exact commands, e.g. npm test -- doorways ruin-graph, then npm test
Docs:        which of DECISIONS / KNOWN_ISSUES / CHANGELOG / DESIGN / ARCHITECTURE / TESTING
Check in-game: seed, where to go (coordinates or depth), what should look different,
             what must look the same
```

## Rules
- Acceptance criteria must be verifiable headlessly; anything only visible in-game goes under "Check in-game".
- Name the specialised skill to use next: `worldgen-change`, `ruins-change`, `add-block-or-item`, then `test-pass` and `decision-log`.
- Keep the packet under about 25 lines.
