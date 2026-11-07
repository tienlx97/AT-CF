# Proposal: site-foundation

**Status:** done
**Created:** 2026-11-07

## Why

Every later page (home, menu, gallery, print menu) needs the same base: the brand
tokens and font, the static-export build, the owner-editable `site.json`, the
Vietnam-time open/online/closed status and the site chrome (header, footer,
floating call/Zalo bar). Building it once, first, keeps the brand consistent and
the later changes small. Source: `ANH-TU-PROMP.md` sections 2, 3, 4 (blocks 1, 9, 10)
and 9.2.1.

## What changes

- Tailwind CSS v4 with the four brand tokens, Montserrat (Vietnamese subset),
  `output: 'export'`, `lang="vi"` — ADR-0005.
- Lint rule forbidding hex colour literals in `src/` (tokens only).
- `src/data/site.json`: name, tagline, address, phone, Zalo, socials, map, hours,
  order links (`shopeefood`, `grabfood` empty for now).
- `src/shared/`: site config reader, phone/price formatters, the open-status
  calculator in `Asia/Ho_Chi_Minh` time, `useOpenStatus` hook, `Logo`, `Button`,
  `StatusBadge`, `MediaPlaceholder`.
- `src/features/site-chrome/`: sticky header (transparent over hero, solid on
  scroll, "Gọi đặt món" ↔ "Đặt online"), full-screen mobile drawer with focus
  trap and Esc, footer (brand green + white logo), mobile floating Gọi/Zalo bar.
- Root layout composing the chrome; a minimal home page shell so the gate builds.
- Brand logo files copied unchanged to `public/brand/`.

## Out of scope

- Home page sections, menu, gallery, print menu, SEO (later changes).
- Media processing (`media-pipeline`).
- Deploy.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-11-07 | Status is computed client-side after mount; server HTML renders a neutral "Giờ mở cửa 5:30 – 20:00" badge | Static export has no request time; avoids hydration mismatch |
| 2026-11-07 | Header CTA "Đặt online" only when both order links exist and time is 11:00–20:00 | Brief section 4, block 8 |
| 2026-11-07 | `skill design-taste-frontend` rule 9 (no house number/real phone) is overridden by the owner brief | Owner explicitly supplies real address/phone for customers to call |
| 2026-11-07 | Design follows the taste skill's **place** plan (1200 column, equal edges, square photographs, 2px 48px buttons, flat grounds, hover layer only, visit block on screen 2, menu as ruled rows, one main action a screen). Where the skill and the owner brief differ, the brief wins: hero video with green overlay and words on it, transparent header over the hero, Montserrat 800 headings, small uppercase tracked labels, reels strip, map, real address and phone | AGENTS.md: product scope comes from the owner's brief; reference congcaphe.com (owner-supplied) for menu-by-group and social block |
