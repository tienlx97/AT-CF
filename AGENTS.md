# AGENTS.md — Map, Not Manual

> Per OpenAI harness engineering: this file stays ~100 lines and is a MAP.
> It points to deeper sources of truth; it never duplicates them.

## What this project is

ANH-TU-COFFEE is the website of Anh Tú Coffee: a Next.js App Router app written
in JavaScript (UI library and styling approach are chosen in the first change). It uses a
feature-based `src/` architecture, mechanical quality gates, and change tracking
under `openspec/changes/`. Product scope (pages, content, design) comes from the
owner's design brief and is recorded in `openspec/project.md` and each change's
`proposal.md` — never invented by an agent.

## Map of truth

| Question | Source of truth |
|---|---|
| Architecture & system diagram | `docs/architecture.md` |
| Why past decisions were made | `docs/adr/` (one ADR per decision, versioned) |
| Project conventions, stack, thresholds | `openspec/project.md` |
| What are we building now? Why? | `openspec/changes/<change>/proposal.md` |
| Requirements & scenarios | `openspec/changes/<change>/specs/` |
| Execution plan (current work) | `openspec/changes/<change>/tasks.md` (template: `openspec/changes/_template/`) |
| Harness design and upstream models | `docs/harness-design.md` (ADR-0003) |
| Gate commands, evidence and troubleshooting | `harness/README.md` |
| Quality standards (golden rules) | `harness/GOLDEN_RULES.md` |
| Entropy management & cleanup duty | `harness/ENTROPY.md` |
| Session history & handoffs | `harness/PROGRESS.md` (last 14 days, newest first; older: `harness/progress/<YYYY-MM>.md`) |
| Agent runtime (DeepSeek Harness) | `dsh web --patch harness/dsh/project.cordis.patch.yml` (+ `--patch harness/dsh/project.subagents.cordis.patch.yml` for Codex/Claude Code subagents); the driver model is each person's choice in Settings → Models (never set in repo overlays) — see `docs/adr/0004-deepseek-harness.md` |
| New machine setup (dsh, Engram, WSL gate, models) | `docs/agent-setup.md` |
| Recall of past work | Engram MCP tools (`mcp__engram__*`), shared via `.engram/` |
| Run locally | `.env.example` → `.env.local`, `pnpm dev -p 3000` |

## Architectural constraints (mechanically enforced)

Feature-based: `src/features/<feature>/{types,config,api,hooks,components}`
and `src/shared/{types,config,api,hooks,components}`. Within each tree,
dependencies flow one direction — `types → config → api → hooks →
components`. Features are isolated (no importing another feature directly;
share via `src/shared/`) and reachable from outside only through their
`index.js`. Full detail: `docs/architecture.md`.

`./harness/verify.sh` runs structural tests that FAIL the build on violations.
Error messages tell you how to fix them — read them; do not work around them.

## Session lifecycle (packaged as the `project-task` skill)

1. Read this map → `node harness/task.mjs context CHANGE` → its source pointers
   and relevant `harness/PROGRESS.md` entries. CHANGE is the active OpenSpec slug.
2. Run `./init.sh` (Windows: `node harness/sh.mjs ./init.sh`).
3. Select the first unchecked task in `tasks.md`. One task at a time.
4. Implement within the layer rules above and `harness/GOLDEN_RULES.md`.
5. Run `./harness/verify.sh --change CHANGE` (Windows: `node harness/verify-wsl.mjs
   --change CHANGE`), then `node harness/task.mjs status RUN_DIR`.
   Done requires current passing evidence and the task-specific browser checks.
6. Update `tasks.md`, append to `harness/PROGRESS.md`, close the Engram session and
   `engram sync` (steps in the `project-task` skill), commit (`feat(<change>): task N.N ...`).

## Verification & observability (evidence, not opinion)

- Quality thresholds are numbers, not adjectives — see `openspec/project.md`.
  Claiming "fast" or "works" requires a measurement or a test.
- For UI work: take a screenshot / run the e2e flow; do not assert visual
  correctness from code alone. Check desktop and mobile widths.
- Logs and metrics for your task run go to their own dated directory under
  `harness/runs/` so a reviewer can replay evidence.

## Failure protocol — every agent mistake is a harness gap

When you (or a reviewer) catch a mistake, do NOT just patch the output:

1. Fix the instance.
2. Ask: what tool, lint, structural test, or golden rule would have made this
   mistake impossible?
3. Add it (or log it in `harness/PROGRESS.md` under "Harness gaps" if out of scope).

Writing the same fix twice by hand is a harness failure.

## Hard rules

- Never mark a task done without `./harness/verify.sh` passing.
- Never push, merge or deploy without the owner's approval.
- Never expand scope beyond the selected task; log findings under "Discovered".
- Never edit `openspec/archive/`. A change whose tasks are all checked moves there
  with `git mv`, and paths pointing to it are updated in the same commit.
- Prefer existing patterns; you replicate what you see, so only replicate what
  `harness/quality-grades.json` grades as A.
- **Shared memory is files, not agent memory.** Durable knowledge lives ONLY in
  repo files: `harness/PROGRESS.md`, `docs/adr/`, `openspec/`. Engram (ADR-0004)
  is recall only, never the sole home of a fact; share it with `engram sync`
  into `.engram/` and review it like code — never store secrets or credentials.
- **Windows:** run repo Bash scripts as `node harness/sh.mjs <script>` (never
  bare `bash`: in PowerShell it is WSL); the gate is `node harness/verify-wsl.mjs`.

## Commands

```bash
./init.sh                    # setup + verify environment
./harness/verify.sh          # full gate: lint, typecheck, tests, structure, build
./harness/audit-harness.sh   # validate the harness itself
node harness/task.mjs context CHANGE  # bounded context for the first open task
node harness/task.mjs handoff RUN_DIR # read-only evidence and follow-up report
```

## UI workflow

UI design and review follow the `design-taste-frontend` skill
(`.agents/skills/design-taste-frontend/SKILL.md`): plan from the owner's brief, then
check the page with the skill's browser checker at desktop and mobile widths.
