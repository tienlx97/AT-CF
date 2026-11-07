# ADR-0003: Task context and verifiable handoffs around the existing gate

Date: 2026-10-11
Status: accepted; amended by ADR-0004 (DeepSeek Harness is the agent runtime)

## Context

Several agents and humans share this repository. OpenSpec already owns tasks,
AGENTS maps policy, PROGRESS/ADRs retain decisions, and MemSearch recalls them.
The harness is currently a verification runner. A green run lacks task identity
and freshness: editing code after a pass leaves the old report green. Large
session logs also consume context without reliably identifying the next task.

## Decision

Keep these file-based sources. Add a small deterministic workflow adapter, using
Node/Bash already installed, between task selection and the gate. It produces a
bounded context packet, records the selected task in the run, persists operational
events, fingerprints project inputs, and derives handoff status from evidence.
No new agent runtime, database, model calls or task-state authority is introduced.

`tasks.md` remains editable truth. Run artifacts are observations, not commands.
Resuming means inspect context/evidence, check current files, and choose the next
authorized action. It never means replaying writes, API calls or deployment.
The full gate remains mandatory, even when targeted checks provide fast feedback.

## Alternatives

- Install OpenHands/LangGraph: useful for hosting agents, but adds an independent
  execution/runtime stack to a frontend repo already served by coding agents.
- Extend only prompt instructions: cannot detect stale evidence mechanically.
- Build a workflow database or global active-task file: duplicates OpenSpec and
  creates contention between otherwise independent checkouts.
- Automatically retry/replay steps: can repeat side effects and hide unstable
  failures. This design records failures and reruns only when explicitly invoked.

## Consequences

Plain CI verification remains compatible. Task work uses `--change` and read-only
context/status/handoff commands. Any detected mutation during a run invalidates
it; this favors trustworthy evidence over avoiding a rerun. Input fingerprints
cover Git-visible project files, not ignored local environment/dependencies or
external services. Browser evidence and scope review remain explicit task duties.
Operational events do not contain prompts, internal reasoning or environment dumps.
See `docs/harness-design.md` for source comparisons, state transitions and limits.
