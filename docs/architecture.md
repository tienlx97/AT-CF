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
| `src/data/menu.json`, `src/data/media.json` | Owner menu; media list written by `pnpm media` (captions kept) |
| `src/shared/{config,api}/menu.js` | Validated menu (Vietnamese errors), featured, options, price range |
| `src/shared/api/media.js`, `media-core.js` | Media readers (srcset, hero, reels, preview); pipeline helpers |
| `src/shared/api/{contact,lightbox,seo,routes}.js` | Map/directions URLs, lightbox stepping, JSON-LD, path helpers |
| `src/shared/components/` | + ResponsiveImage, VideoPoster, MasonryGrid, Lightbox, LazyMap |
| `src/shared/config/page-meta.js` | Per-route title/description/canonical/OG |
| `src/features/home/` | Hero, Intro, FeaturedDrinks, Reels, GalleryPreview, Visit, ContactOrder (`/`, `/lien-he`) |
| `src/features/menu/` | `/menu`: sticky tabs, ruled item rows |
| `src/features/gallery/` | `/hinh-anh`: filters in `?nhom=`, 24 per page, lightbox |
| `src/features/print-menu/` | `/menu-in`: one A4 sheet, build-time QR codes |
| `src/app/{sitemap,robots,manifest}.js` | Static SEO files |
| `scripts/process-media.mjs` | `pnpm media`: sharp + ffmpeg into `public/media/` |
| `scripts/make-brand-assets.mjs` | `pnpm brand`: og.png, icons, favicon from the logo |
| `scripts/flatten-prefetch.mjs` | Post-build fix for Next 16 export prefetch file names |
| `harness/ui/` | `flow.mjs` + `flows/`, `lighthouse.mjs`, `check-seo.mjs`, `print-pdf.mjs`, `make-fixture-media.mjs` |
| `public/brand/`, `public/fonts/` | Logo files copied unchanged; self-hosted Montserrat (OFL) |

Route groups are not used: under static export Next 16 writes their prefetch
files under a name the client never requests (404s). Chrome-less pages are listed
in `BARE_ROUTES` instead.
