# Proposal: launch-performance

**Status:** draft
**Created:** 2026-11-07

## Why

The definition of done requires Lighthouse mobile ≥ 90 in all four categories and
a home page ≤ 1.5 MB on 4G. Source: `ANH-TU-PROMP.md` sections 6.4, 10, 11.

## What changes

- Lighthouse mobile runs saved under `harness/runs/`; fixes until thresholds pass.
- Deploy guide `docs/deploy.md`: Vercel via GitHub (primary), Netlify / Cloudflare Pages fallback, external video storage (R2/Bunny) if media is too large, domain purchase and DNS.

## Out of scope

- Deploying without the owner's approval (AGENTS.md hard rule).

## Decision log

| Date | Decision | Why |
|---|---|---|