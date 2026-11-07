# Proposal: launch-performance

**Status:** done
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
| 2026-11-07 | Fonts self-hosted (2 preloaded variable files) instead of next/font/google | Un-preloaded latin-ext file put LCP at 5.9 s (Lighthouse mobile); now ~1.0 s |
| 2026-11-07 | Body text full ink; small labels ≥ 90% white or 80% ink; contact band on brand-ink | Lighthouse color-contrast + taste-skill 7:1 body text |
| 2026-11-07 | Accepted taste-skill `consistency.mjs` FAILs (report `harness/runs/ui-launch-1.1/consistency-3.txt`): `phone-number`, `street-number`, `coordinates` (owner gives real phone/address, map needs coordinates); `container-edges` on the fixed transparent header, skip link and hero veil (brief: header over hero video, a11y skip link); `section-height`/`one-section`/`one-heading` (brief lists 8 home blocks; holding each to exactly one screen would pad short blocks with empty space on phones); `no-visual` on featured drinks (photos are pending: placeholders); `button-styles` light/outline pair in the hero is the inverted pair on video | Owner brief wins over the skill (site-foundation decision log); each is a deliberate override, not an oversight |
| 2026-11-07 | Fixed from the checker: split lines 6/6 top-aligned, one secondary style for the visit action, nav words never wrap, placeholders as an even grid, icon gaps on one edge | taste-skill layout rules |