# CLAUDE.md

Read and follow `AGENTS.md`. It is the single operating manual for this repository, shared by every agent (Claude Code, Codex, humans).

Claude-specific notes:
- Use the session lifecycle in `AGENTS.md` exactly; start every session by reading `harness/PROGRESS.md`.
- When context runs long, finish the current task, update state files, and hand off via `harness/PROGRESS.md` — state on disk survives context resets, your conversation does not.
- Some Windows checkouts materialize `.claude/skills/` symlinks as text files. Read the corresponding canonical `.agents/skills/` directory in that case.
- The team's agent runtime is DeepSeek Harness, which also loads this file (ADR-0004). For recalling past work use Engram (`mcp__engram__*` tools; shared exports in `.engram/`). Do NOT rely on any tool-private memory store for project knowledge; everything durable goes to `harness/PROGRESS.md`, `docs/adr/`, or `openspec/` per `AGENTS.md` and ADR-0004.
- UI design work uses the `design-taste-frontend` skill (`.agents/skills/design-taste-frontend/`, from Leonxlnx/taste-skill). Its kit files (`assets/`, `scripts/`) are never edited to clear a check.
