# Tasks: site-foundation

<!--
Rules:
- One task = one session-sized unit of work with its own verification.
- Agent picks the FIRST unchecked task, top to bottom. No parallel tasks.
- A task is checked ONLY after ./harness/verify.sh passes and its criteria are met.
-->

## 1. Styling, data and status logic

- [x] 1.1 Tailwind v4 + brand tokens + Montserrat + static export + hex-colour lint rule, `site.json`, shared config/format/open-status/order-links with unit tests, ADR-0005 — verify: unit tests for status boundaries and formatting pass, `pnpm build` exports `out/`, gate passes

## 2. Site chrome

- [x] 2.1 Shared components (Logo, Button, StatusBadge, MediaPlaceholder) and `site-chrome` feature (Header with transparent/solid states and CTA switch, MobileDrawer with focus trap + Esc, Footer, mobile ContactBar), wired in root layout with a minimal home shell — verify: browser screenshots 390 and 1440, drawer Esc + focus return, no horizontal scroll, gate passes
