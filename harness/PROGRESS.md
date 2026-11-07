# Progress Log

Entries newer than 14 days, newest first. Older ones: harness/progress/<YYYY-MM>.md
(`node harness/progress-rotate.mjs`). Add new entries at the top.

## 2026-11-07 — project bootstrap: harness, agent config, skills

- User: start ANH-TU-COFFEE (website for Anh Tú Coffee) from the harness, agent
  configuration, dsh overlays and skills of an earlier project; everything else new.
  The web design brief comes later.
- In place: `AGENTS.md`/`CLAUDE.md`, harness gate (`harness/verify.sh`, WSL bridge,
  task workflow, evidence, quality grades), golden rules v1, dsh overlays
  (`harness/dsh/project*.cordis.patch.yml`), skills in `.agents/skills/`
  (`project-task` is the session lifecycle), ADRs 0001–0004, OpenSpec template,
  CI `verify` on pull requests. Stack config: Next.js App Router only; UI library
  and styling are chosen in the first change. Design skill: `design-taste-frontend`
  (Leonxlnx/taste-skill via `npx skills add`). The earlier project's UI library,
  its design MCP, its styling runtime and the Stitch tooling were removed on request,
  including the quality-grade penalty for raw markup and hex colors.
- Not yet: application source (`src/`), `pnpm-lock.yaml` (first `pnpm install`
  creates it; CI's `--frozen-lockfile` needs it committed), the first OpenSpec change.
- Next: turn the design brief into `openspec/project.md` purpose/scope and the first
  change under `openspec/changes/`.

## Harness gaps

- None recorded yet. When the UI library is chosen, add its styling rules
  (lint + `harness/quality-grades.mjs` rubric) in the same change.

## Discovered

- None recorded yet.
