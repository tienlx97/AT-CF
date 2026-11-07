# Entropy Management

<!--
Per OpenAI harness engineering: agents replicate the patterns they see — good
or bad — so code quality needs garbage collection that scales with generation
throughput. This file defines how.
-->

## Quality grades

Every source directory carries a grade in `harness/quality-grades.json`:

- **A** — canonical. Safe to copy patterns from.
- **B** — acceptable, minor drift. Copy with care.
- **C** — known debt. Do NOT replicate patterns from here; touching a C file
  includes bringing it toward the current golden rules.

Agents must check the grade before using a file as a pattern reference. A file
takes the grade of its longest matching unit (e.g. `src/shared/components/mdx/x.jsx`
→ `src/shared/components/mdx`).

Grades are measured, not judged: `node harness/quality-grades.mjs` (needs
`node_modules`, or `--eslint <eslint src --format json>` from the WSL gate clone)
counts per unit non-autofix ESLint warnings, autofixable
warnings, source files over 800 lines and test files, then applies the rubric stored in the JSON. `--check` reports drift.
`harness/tests/quality-grades.test.cjs` keeps grades consistent with the stored
metrics and the unit list. Rerun it in each cleanup session and after large changes.

## Cleanup agent (background duty)

Run periodically (cron/CI or a dedicated agent session) with this scope:

1. Scan for **stale docs**: `docs/`, `AGENTS.md`, `openspec/project.md` claims
   that contradict the code. Fix or flag.
2. Scan for **golden-rule violations** in B/C-graded code.
3. Scan for **pattern drift**: same problem solved two different ways.
4. Open ONE small PR per finding (≤ ~150 lines diff). Small PRs auto-merge on
   green verification; large refactors need an ADR first.
5. Rerun `node harness/quality-grades.mjs` and commit the new grades.

Cleanup sessions follow the same lifecycle as feature sessions (verify.sh
gates apply) but pick work from this list instead of `tasks.md`.

## Rule evolution

- Golden rules are versioned in `harness/GOLDEN_RULES.md`. Raising a rule
  version creates cleanup work: grade affected code C until it complies.
- When a human catches an agent mistake twice, the fix is a new mechanical
  rule (lint / structural test / verify step), not a note. Track pending ones
  in `harness/PROGRESS.md` under "Harness gaps".
