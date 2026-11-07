# ADR-0004: DeepSeek Harness as the agent runtime; Engram replaces memsearch

**Status:** accepted
**Date:** 2026-11-06
**Supersedes:** ADR-0002 (memory layer). **Amends:** ADR-0003 ("no new agent runtime").

## Context

The repository was worked by Claude Code, Codex and humans around a file-based
harness: AGENTS.md as the map, OpenSpec tasks, `harness/verify.sh` as the only
definition of done, PROGRESS/ADRs for durable decisions, and memsearch (ADR-0002)
for recall. The owner decided to run agent work on the open-source DeepSeek
Harness (`dsh`, github.com/deepseek-ai/deepseek-harness, MIT).

Facts verified in `dsh` 0.2.2-rc.1 source (developer preview, "not security
audited", breaking changes announced):

- It loads `AGENTS.md` and `CLAUDE.md` (plus `AGENTS.local.md`) and project skills
  from `.agents/skills/` natively; config is layered YAML, so a project overlay
  can live in Git (`dsh … --patch <file>`).
- It has MCP, subagents, schedules, compaction and SQLite session search, but no
  long-term memory; its docs offer Engram, Memorix or MCP Reference Memory via MCP.
- On Windows the shell tool is PowerShell only. There, `bash` resolves to
  `C:\Windows\System32\bash.exe` (WSL), not Git Bash.
- The Windows sandbox restricts writes only: reads, network and `.git` are open.
  Approval is `ask | never`; there is no command deny-list, so `git push` is not
  intercepted.
- By default it attaches session logs (≤ 8 MiB/request) and the plugin list to
  official DeepSeek API requests; session telemetry is sent only on explicit feedback.

## Decision

Use `dsh` as the agent runtime, configured by `harness/dsh/project.cordis.patch.yml`;
keep every deterministic part of the harness (OpenSpec, `verify.sh`, structural
rules, evidence, PROGRESS/ADRs) as the authority that `dsh` must satisfy.

- **Context and skills:** unchanged files, read natively. The lifecycle in
  AGENTS.md is packaged as the `project-task` skill.
- **Memory:** Engram (MIT, local SQLite FTS5, scoped by Git project) over MCP
  replaces memsearch. Team-shared recall is `engram sync` output in `.engram/`
  (append-only gzipped chunks + manifest), reviewed like code and scanned by
  `harness/checks/memory-secrets.sh`. The old `.memsearch/memory/` archive was
  deleted on 2026-11-07 (owner's call; Git history keeps it). Recall is still the lowest tier: openspec → ADR → PROGRESS → memory.
- **Egress:** the overlay disables `session-log-deepseek` and
  `plugin-package-inventory-deepseek`. No credentials in Git; model keys live in
  `$DSH_HOME/.credentials.yaml` via Settings → Models.
- **Safety:** sessions stay `workspace-write` + `ask`. Because `dsh` cannot block
  commands, pushes to `main` are guarded server-side (GitHub branch protection)
  and the AGENTS.md hard rules stay in force.
- **Windows gate:** agents run repo Bash scripts via `node harness/sh.mjs` (Git
  Bash resolved from `git --exec-path`) and the completion gate via
  `node harness/verify-wsl.mjs --change CHANGE`, which runs `verify.sh` in a
  dedicated WSL clone at HEAD plus the Git-normalized working-tree patch and
  copies the run back. The input fingerprint (`sha256-v2`) hashes Git-normalized
  blobs, so a CRLF Windows checkout and its LF gate clone produce equal digests.
- **Codex and Claude Code:** reached as dsh product subagents
  (`@deepseek-ai/dsh-subagent-codex`, `@deepseek-ai/dsh-subagent-claude-code`,
  pinned to the dsh version) through the optional overlay
  `harness/dsh/project.subagents.cordis.patch.yml`, applied as a second `--patch`
  once the packages are installed with `dsh plugin --profile web add`. Each call
  is a fresh unattended session in the workspace that returns only its final
  answer; authentication stays native (`codex login`, Claude login). Modes:
  Codex `approve-for-me` (workspace-write + auto-review), Claude Code
  `acceptEdits` (other prompts denied). Sandbox-bypass modes are never used.
  With a non-DeepSeek driver they are optional extras, not the only way to reach
  Claude or GPT.
- **Driver model is each person's choice, not the repo's** (amended 2026-11-06).
  `dsh` is used for its flexibility, so DeepSeek is not the fixed orchestrator.
  The model that drives a session is picked in Settings → Models (default for
  new agents) or the per-session model picker; both write the person's
  `~/.dsh/profiles/<profile>/cordis.patch.yml`. The base bundle already mounts
  `@deepseek-ai/dsh-llm-pi-ai` dormant, and its routes come alive from those
  settings. `--patch` overlays apply *after* the profile layer, so the repo
  overlays never touch the `agent-default-model` or `llm-pi-ai` rows. If they
  did, they would silently override every person's choice.
  Allowed routes:
  - DeepSeek (`deepseek-account`, `deepseek-official`), unchanged.
  - **ChatGPT Plus/Pro** through the built-in `openai-codex` route ("OpenAI
    (ChatGPT Plus/Pro)" sign-in, pi-ai OAuth, token kept in the dsh credential
    store). dsh deliberately offers no ChatGPT sign-in on the `openai` route,
    which takes an API key.
  - **Claude as the driver** through the `anthropic` route with an
    **Anthropic API key** (Console billing). Do **not** pick that route's
    "Claude Pro/Max" sign-in: Anthropic's terms limit subscription OAuth to
    Claude Code and Claude apps, and using it in another harness risks the
    account. A Claude Pro subscription reaches this repo only through Claude
    Code: the `subagent-claude-code` subagent, or Claude Code run directly.
  - Any OpenAI-compatible or Anthropic-compatible gateway with its own key.
- **`dsh-plugin-subscriptions`** (github.com/V1ki/dsh-plugin-subscriptions, MIT,
  third-party, not audited) is allowed (amended 2026-11-07) on these terms:
  - It is installed and configured only in a person's own dsh profile, never
    in a repo overlay. The model-row test already rejects its `providers:`
    there.
  - Its **Claude route stays off**. That route imports Claude Code's OAuth token
    and presents itself as Claude Code. A Claude subscription is used only
    through Claude Code itself.
  - **One account per provider**: `pool.autoAccounts: false`, and no failover
    to other accounts on a rate limit. Rotating across accounts to get around
    a plan's limits is not allowed.
  - Install it from npm at a pinned version. Allow its build script only after
    reading the source of that version, because it reads credential files and
    runs with the agent's access to this checkout.
  - Example profile row:
    `providers: [codex]` (add `grok`, `copilot` or `antigravity` only after
    checking that provider's terms), `pool: { autoAccounts: false }`.

- **Engram version** (amended 2026-11-07): 3.6.2, installed from the release zip
  checked against `checksums.txt` (`go install` of 3.6 needs Go 1.26). 3.x
  requires `expected_project` on `mem_update` / `mem_delete`, and adds
  `mem_session_finalize` (summary + end in one step), which the `project-task`
  skill uses. Before an upgrade: back up `~/.engram/engram.db*` and the old binary,
  then run `engram doctor`, re-read the MCP `tools/list` against the skill, and
  restart dsh so its MCP server loads the new binary.

## Consequences

- One agent runtime for the whole team, with the same map, skills and gate.
- Evidence produced in WSL is current for the Windows checkout; before this,
  `task.mjs status` on Windows could never confirm a WSL run.
- `dsh` is a pinned preview dependency (`@deepseek-ai/dsh@0.2.2-rc.1`); every
  upgrade re-runs `--dump-config` against the overlay before use.
- Accepted risk: the agent can read any file the Windows user can (including
  `.env.local`, `.ai-login.local.md`) and send it to the model provider; the
  sandbox does not stop network or `.git` writes.
- memsearch's semantic search is replaced by Engram's keyword FTS5 search.
- Delegated Codex/Claude Code runs have no human approval path, no resume and
  no rollback; their edits land in the workspace and pass the same gate. Each
  provider downloads its own pinned product binary (~100 MB) and ignores the
  host `codex`/`claude`.

## Enforcement

- `harness/audit-harness.sh`: ADR-0004, overlay, Windows bridges and the
  `project-task` skill exist; `.engram/engram.db` is never tracked.
- `harness/tests/agent-harness.test.cjs`: overlay keeps both egress rows disabled;
  neither overlay carries credentials or `env`, or selects a bypass/`never`/`auto`
  mode; neither overlay sets the `agent-default-model` / `llm-pi-ai` rows or a
  `provider:` / `model:` field, nor `dsh-plugin-subscriptions` (model choice
  stays per person);
  the subagent overlay pins `approve-for-me` and `acceptEdits`; the secret
  check catches secrets inside gzipped Engram chunks.
- `harness/tests/windows.test.cjs`: Git Bash resolution and the WSL gate script.
- `harness/tests/workflow.test.cjs`: CRLF/LF checkouts fingerprint identically.
- Not mechanically enforceable here: branch protection on GitHub and what the
  model provider does with prompts; both are owner duties.
