# Design: site-foundation

## Approach

Next.js 16 App Router, static export. Tailwind v4 via `@tailwindcss/postcss`;
tokens declared in `src/app/globals.css` with `@theme { --color-brand: … }` so
classes are `bg-brand`, `text-brand-ink`, `bg-surface-alt`. Font: `next/font/google`
Montserrat, weights 500/600/700/800, subsets latin + vietnamese, exposed as
`--font-montserrat` and mapped to `--font-sans`.

Owner data lives in `src/data/*.json`. Only `src/shared/config/site.js` imports
`site.json`, validates required fields and exports a frozen object; everything
else imports from there.

Open status (`src/shared/api/open-status.js`, pure):

```
getOpenStatus(date, hours) → { state: 'open'|'online'|'closed', until, reopensAt, label }
```

`hours` = `{ store: { open: '05:30', close: '11:00' }, online: { open: '11:00', close: '20:00' } }`.
Vietnam minutes-of-day come from `Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' })`.
Labels: `Đang mở cửa · đến 11:00`, `Đang bán online · đến 20:00`, `Đã đóng cửa · mở lại 5:30`.
`useOpenStatus` re-evaluates every 60 s after mount; before mount returns `null`.

Site chrome feature `site-chrome`: `Header` (client; scroll listener passive,
`transparent` prop for hero pages), `MobileDrawer` (dialog role, focus trap,
Esc, body scroll lock, returns focus), `Footer` (server), `ContactBar` (client,
mobile only, hidden when `document.body.dataset.lightbox === 'open'`).

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| data | `src/data/site.json` | new |
| shared/types | `site.js` (JSDoc) | new |
| shared/config | `site.js`, `nav.js` | new |
| shared/api | `open-status.js`, `format.js`, `order-links.js` | new + tests |
| shared/hooks | `use-open-status.js`, `use-scrolled.js` | new |
| shared/components | `logo.jsx`, `button.jsx`, `status-badge.jsx`, `media-placeholder.jsx` | new |
| features/site-chrome | header, drawer, footer, contact bar, `index.js` | new |
| app | `layout.jsx`, `page.jsx`, `globals.css` | new |

## New dependencies

- `tailwindcss`, `@tailwindcss/postcss` (dev) — styling chosen by the brief (ADR-0005).

## Risks & mitigations

- Hydration mismatch from time → status rendered only after mount.
- Hex colours creeping into JSX → lint rule.
- Transparent header unreadable over light pages → `transparent` only on pages with a dark hero; other pages get the solid header.

## Verification plan (agreed BEFORE implementation — "sprint contract")

- [ ] Unit tests: open status at 05:29, 05:30, 10:59, 11:00, 19:59, 20:00, 23:00 VN time (incl. a UTC date that is the next day in VN).
- [ ] Unit tests: price `20000 → 20.000đ`, phone formatting, order link rule.
- [ ] `pnpm build` produces `out/` (static export).
- [ ] Browser at 390 and 1440: header, drawer opens/closes with Esc and returns focus, footer, contact bar visible only on mobile; no horizontal scroll; touch targets ≥ 44 px.
- [ ] `./harness/verify.sh --change site-foundation` passes.
