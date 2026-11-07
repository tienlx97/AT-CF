---
name: project-task
description: 'Run one OpenSpec task end to end under the repository harness: bounded context, one task, layer rules, the verification gate (WSL on Windows), fresh evidence, then tasks/PROGRESS/commit. Use whenever asked to implement, continue, fix or finish work in this repository, or to "do the next task" of an OpenSpec change. Not for questions that change no files.'
license: MIT
---

# Project task workflow

`AGENTS.md` is the operating manual; this skill is its lifecycle as steps. If the
two ever disagree, `AGENTS.md` wins — report the drift under "Harness gaps".

## Inputs

- `CHANGE`: the active OpenSpec slug (`openspec/changes/<CHANGE>/`). If the user
  did not name one and it is not obvious from the request, ask. Never invent one.
- Optional task id; otherwise the first unchecked task in `tasks.md`.

## Shell rules (Windows, PowerShell)

- Repo Bash scripts: `node harness/sh.mjs <script> [args]`. Never call bare
  `bash`: in PowerShell it is WSL's `C:\Windows\System32\bash.exe`.
- Gate: `node harness/verify-wsl.mjs --change CHANGE`. On Linux/WSL:
  `./harness/verify.sh --change CHANGE`.

## Steps

1. `node harness/task.mjs context CHANGE` — read only its source pointers and
   history excerpts; open more files on demand, not the whole repo.
2. Open the memory session (see "Memory (Engram)"): `mem_current_project`,
   `mem_session_start`, `mem_context`, then `mem_search` with the change name and
   key terms before re-deriving anything. Results are hints; repo files are the truth.
3. Setup once per session: `node harness/sh.mjs ./init.sh` (Linux: `./init.sh`).
4. Implement exactly the selected task inside `src/features/<feature>/` layer rules
   (`types → config → api → hooks → components`) and `harness/GOLDEN_RULES.md`.
   Out-of-scope findings go to PROGRESS under "Discovered"; do not fix them.
5. Fast feedback while editing: targeted tests/lint only. They never mark done.
6. Run the gate (see Shell rules), then `node harness/task.mjs status RUN_DIR`.
   UI tasks also need the browser checks named in the task.
7. Only with a passing, fresh status and required UI evidence: check the task in
   `tasks.md`, append a PROGRESS entry (what, evidence run dir, gaps), then close
   the memory session (`mem_save` for each reusable lesson, `mem_session_finalize`,
   `engram sync`) and commit `.engram/` together with the task:
   `feat(<CHANGE>): task N.N <summary>` on a feature branch.

## Memory (Engram)

Engram is recall, the lowest tier (openspec → ADR → PROGRESS → memory). A fact
saved only in Engram is lost knowledge: it must also be in a repo file, and the
observation points to that file. Tools are `mcp__engram__<name>` (Engram 3.6.2; ADR-0004); the project
is `anh-tu-coffee` (detected from the Git remote; pass `project: anh-tu-coffee` if detection differs).

- **Start:** `mem_current_project` (confirm `anh-tu-coffee`); `mem_session_start` with
  `id: <CHANGE>-<task>-<yyyymmdd-hhmm>` and `directory` = repo root; `mem_context`;
  `mem_search` (`query`: change slug, feature name, error text). After a
  `git pull` that brought new `.engram/` chunks, run `engram sync --import` first.
- **Save** (`mem_save`, only at step 7, never mid-task guesses): one observation
  per reusable lesson — a gotcha, a pattern that worked, a harness gap, a decision
  and where it is recorded. Not for things the code or PROGRESS already say
  plainly. Fields: `title` (short, searchable), `type` (`decision`, `bugfix`,
  `pattern`, `discovery`, ...), `topic_key: <CHANGE>/<topic>` (same key updates
  the same topic instead of duplicating it), `content` in the tool's
  What / Why / Where / Learned format, with `Where` naming the repo file
  (`harness/PROGRESS.md` entry, ADR, `tasks.md` id). Use repo-relative paths:
  chunks are shared, and Engram warns about absolute ones.
- **Fix a saved observation:** prefer `mem_save` with the same `topic_key` (an
  upsert, history kept). `mem_update` / `mem_delete` need `id` and
  `expected_project: anh-tu-coffee` (Engram 3.x refuses them otherwise).
- **End:** `mem_session_finalize` with `session_id` = the start `id` and `summary`
  in the tool's Goal / Instructions / Discoveries / Accomplished / Next Steps /
  Relevant Files format: it saves the summary and ends the session in one step
  (a retry is safe). Then `engram sync` (writes chunks to `.engram/`; never
  `--include-prompts`, prompts may hold pasted secrets). The gate's `memory-secrets` step
  scans them; commit `.engram/` with the task. `.engram/engram.db*` stays ignored.
- **Never in memory:** secrets, tokens, passwords, `.env*` or `.ai-login.local.md`
  contents, customer data, personal data. Describe a credential by where it
  lives, never by value.
- **Engram unavailable** (no `mcp__engram__*` tools, server error): continue the
  task without it and report it under "Harness gaps"; the repo files carry the
  knowledge anyway.

## Output

Report: task id, files changed, gate run directory and its `fresh` value, UI
evidence, Engram observations saved (titles) and whether `.engram/` was synced,
anything skipped and why. Never claim done without that run directory.

## Failure handling

- Gate fails: read the failing step log under the run dir, fix, rerun. Same failure
  twice → stop and report; do not weaken a check or skip a step.
- `status` not fresh: inputs changed after the run; rerun the gate.
- `verify-wsl` exit 3: WSL prerequisites or a foreign gate directory — report it;
  do not delete directories to make it pass.
- Missing credentials, approvals or backend access: stop and ask.

## Never

- Push, merge, deploy to LAN/production, or edit `openspec/archive/` (AGENTS.md
  hard rules; dev API deployment only under its standing exception).
- Write secrets, tokens or `.env*` / `.ai-login.local.md` contents into code,
  memory, commits or messages.
