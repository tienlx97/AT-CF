# Golden Rules

<!--
Versioned quality standards (OpenAI harness style). Agents replicate patterns
they see — these rules define which patterns are allowed to exist.
Each rule states its ENFORCEMENT: the mechanical check that catches violations.
A rule with enforcement "manual" is a harness gap — plan to automate it.
Raising the version creates cleanup work: see harness/ENTROPY.md.
-->

## v1 — 2026-11-07

| # | Rule | Enforcement |
|---|---|---|
| 1 | No task is done without passing `./harness/verify.sh` | verify.sh exit code |
| 2 | Within each of `src/features/<feature>/` and `src/shared/`, dependencies flow types → config → api → hooks → components; no upward imports, no cycles | structural test (dependency-cruiser) |
| 3 | Features are isolated (no direct cross-feature imports) and reachable from outside only via their `index.js`; `src/shared/` must not import a feature | structural test |
| 4 | No dead or commented-out code; delete it, git remembers | lint |
| 5 | Every spec scenario has a corresponding test | manual → TODO: coverage-map script |
| 6 | Errors handled at boundaries; no empty catch | lint |
| 7 | One task per commit; diffs stay small and single-concern | review + PR size check |
| 8 | Copy patterns only from A-graded code (`harness/quality-grades.json`) | manual → cleanup agent scans |
| 9 | Quality claims are measurements against `openspec/project.md` thresholds, not adjectives | verify.sh quality step |
| 10 | Stale docs are bugs; updating `docs/`/`openspec/` is part of the task that made them stale | cleanup agent scan |
| 11 | Shared memory must not contain credentials or private keys | `harness/checks/memory-secrets.sh` |

## Changelog

- v1 (2026-11-07): initial rules for ANH-TU-COFFEE, carried over from the harness
  this project started from; rules tied to that project's screens and to its UI
  library were left out (UI library and styling are chosen in the first change).
