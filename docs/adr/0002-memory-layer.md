# ADR-0002: memsearch as the cross-agent memory recall layer

**Status:** superseded by ADR-0004 (Engram via DeepSeek Harness)
**Date:** 2026-07-09

## Context

The repo is worked by multiple agents (Claude Code, Codex CLI) and humans.
Agent-specific memory stores (e.g. claude-mem) are invisible to other agents
and don't travel with git, so they cannot hold project knowledge. We still
want semantic recall ("how did we solve X before?") shared across all agents.

## Decision

Use **memsearch** (zilliztech/memsearch) as the shared recall layer:

- Source of truth is markdown: `.memsearch/memory/YYYY-MM-DD.md` in the repo.
- The Milvus Lite index (`~/.memsearch/milvus.db`) is a local, rebuildable
  shadow — never shared, never authoritative. Rebuild anytime with
  `memsearch index .memsearch/memory/`.
- Each agent uses its own integration: Claude Code plugin
  (`/plugin marketplace add zilliztech/memsearch` → `/plugin install memsearch`),
  Codex CLI plugin (`plugins/codex/scripts/install.sh`).

memsearch is RECALL ONLY. The hierarchy of truth stays:

1. `openspec/` — what to build (specs, decision log)
2. `docs/adr/` — architectural decisions
3. `harness/PROGRESS.md` — session handoffs, next steps, blockers
4. `.memsearch/memory/` — searchable conversation history (lowest tier)

A fact that matters must be promoted UP this list; memory files are never the
only home of a decision, a next-step, or a constraint.

## Consequences

- Recall works identically from Claude Code and Codex; new agents get history
  by rebuilding the index from the markdown files.
- Memory markdown is git-tracked for team sharing, so it must be **reviewed
  before commit like code** — auto-captured transcripts can leak secrets,
  machine paths, or off-project context. Strip before committing.
- One more dependency per machine: Python ≥ 3.10, `uv tool install memsearch`,
  ~558 MB ONNX embedding model on first run (local CPU, no API keys).

## Enforcement

- `.gitignore` excludes `.memsearch/.maintenance-state.json` and any local
  index files; only `.memsearch/memory/*.md` is trackable.
- Golden rule: PRs that add memory markdown get the same review as code.
- `AGENTS.md` shared-memory rule points here; audit-harness checks this ADR
  exists once memory is adopted.
