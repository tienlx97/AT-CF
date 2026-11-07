# Architecture

ANH-TU-COFFEE is a Next.js App Router website. This file is the map of how code
is organized; it grows with the code. Product scope lives in `openspec/project.md`.

## System diagram

```
browser ──► Next.js (src/app routes, server + client components)
               │
               ├── src/features/<feature>/   one slice per product area
               └── src/shared/               code used by several features
```

Static export (ADR-0005): `next build` writes `out/`. No backend, database or CMS;
adding one is an ADR in `docs/adr/` first. Content lives in `src/data/*.json` and
is read only through `src/shared/config`.

## Layer responsibilities

Each of `src/features/<feature>/` and `src/shared/` uses the same layers, and
imports only flow left to right:

`types → config → api → hooks → components`

| Layer | Holds |
|---|---|
| `types` | JSDoc typedefs and shapes |
| `config` | constants, static content, schemas |
| `api` | data access and pure helpers (no React) |
| `hooks` | React hooks over `api`/`config` |
| `components` | React components (`.jsx`) |

`src/app/` holds routes, layouts and global CSS; it composes features through
their `index.js`.

## Module boundaries (mechanically enforced)

- A feature never imports another feature directly; shared code moves to `src/shared/`.
- Outside a feature, import it only through `src/features/<feature>/index.js`.
- `src/shared/` never imports a feature.
- No upward imports between layers, no cycles.

Rules: `harness/structure.rules.cjs`, run by `./harness/verify.sh` (structure step).

## Current inventory

| Path | Holds |
|---|---|
| `src/data/site.json` | Owner-edited shop facts: name, address, phone, hours, order links |
| `src/shared/config/site.js` | Validated `site`, `NAV_LINKS` |
| `src/shared/config/brand.js` | Hex mirror of the colour tokens (only JS file allowed hex) |
| `src/shared/api/open-status.js` | Open / online / closed in Vietnam time |
| `src/shared/api/format.js` | Price, phone, tel/Zalo links |
| `src/shared/api/order-links.js` | Which order platforms show; header CTA rule |
| `src/shared/hooks/use-open-status.js` | Live status after mount |
| `src/app/globals.css` | Tailwind import and `@theme` brand tokens |
| `src/shared/hooks/use-dialog.js` | Modal focus trap, Esc, scroll lock, body flag (drawer, lightbox) |
| `src/shared/components/` | Logo, Button (one family), StatusBadge, MediaPlaceholder, brand icons |
| `src/features/site-chrome/` | `SiteFrame`: header, mobile drawer, footer, contact bar; `ChromeGate` hides them on `BARE_ROUTES` |
| `harness/ui/flow.mjs` | Browser flow runner over CDP for `out/` (flows in `harness/ui/flows/`) |
| `public/brand/` | Logo files copied unchanged from `assets/logo/` |

Route groups are not used: under static export Next 16 writes their prefetch
files under a name the client never requests (404s). Chrome-less pages are listed
in `BARE_ROUTES` instead.
