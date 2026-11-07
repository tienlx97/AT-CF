# Progress Log

Entries newer than 14 days, newest first. Older ones: harness/progress/<YYYY-MM>.md
(`node harness/progress-rotate.mjs`). Add new entries at the top.

## 2026-11-07 — seo-sharing 1.1 + 1.2: metadata, JSON-LD, share image, icons

- Root metadata (metadataBase, title template, OG/Twitter large card with `/og.png`),
  `pageMetadata()` per route (canonical, OG, `/menu-in/` noindex); `cafeJsonLd()`
  (CafeOrCoffeeShop: address, geo, hours, menu, priceRange 8.000đ–20.000đ, sameAs) on home;
  `sitemap.xml` (4 routes), `robots.txt` (disallow /menu-in/), `manifest.webmanifest`.
- `pnpm brand` (`scripts/make-brand-assets.mjs`): og.png 1200×630 (green, white logo, name;
  adds a cup photo on the right once menu photos exist — rerun then), icons 192/512/maskable,
  apple-icon, favicon.ico, all from the unchanged logo SVGs.
- `harness/ui/check-seo.mjs out` → all SEO checks passed. Gate
  `harness/runs/20261107-122946-dYf5RV/` (passed, fresh).
- Post-launch (owner): Google Business Profile (claim "Anh Tú Coffee" pin, same hours/phone,
  website link, photos), Google Search Console (verify domain, submit /sitemap.xml);
  set `siteUrl` in site.json to the final domain and rebuild.

## 2026-11-07 — print-menu 1.1: /menu-in

- `src/features/print-menu`: one A4 portrait sheet from menu.json (brand band with
  white logo and phone, two category columns at 6.2mm rows, options line, hours,
  address, QR codes for the online menu and Zalo made at build time with `qrcode`),
  screen-only toolbar (Về trang menu, In menu). `@page A4 portrait`, print CSS; sheet
  zooms down for phones. `TRANSPARENT` added to `brand.js` (hex lint caught `#0000`).
- `harness/ui/print-pdf.mjs`: Chrome print-to-PDF + page count → 1 page, MediaBox
  595×842 pt (A4): `harness/runs/ui-print-menu-1.1/menu-a4.pdf`. UI flow passed 390/1440.
- Gate `harness/runs/20261107-122557-VxtFQv/` (passed, fresh).

## 2026-11-07 — gallery-page 1.1 + 1.2: /hinh-anh and lightbox

- `src/features/gallery`: filters (Tất cả, Pha chế, Đồ uống, Không gian quán, Khách hàng,
  Video) with counts, kept in `?nhom=` (useSyncExternalStore + popstate), MasonryGrid,
  24 then "Xem thêm", placeholder per empty filter; filter change scrolls back to the grid.
- Lightbox (from home-page 1.3) verified for the gallery: "5 / 24", caption, ←/→, swipe both
  ways, Esc + focus return. Fixed: a right swipe from the screen edge triggered browser
  back-navigation (`touch-pan-y overscroll-none` on the dialog).
- UI `harness/runs/ui-gallery-1.1/` passed 390/1440 with 60 fixture photos + 3 clips
  (removed after); 15–24 image files on first load. Without media the flow stops at the
  lightbox step by design (`no-media/`). Gate `harness/runs/20261107-122047-VEtrxc/` (passed, fresh).

## 2026-11-07 — home-page 1.5: hours, map, contact/order, /lien-he

- `Visit` (live status, hours rows, address, directions to coordinates, `LazyMap`: still
  card; iframe on tap on phones, on approach on desktop), `ContactOrder` (#dat-online:
  ShopeeFood/GrabFood buttons only for filled links, otherwise phone/Zalo fallback; tel,
  Zalo, Facebook cards). `/lien-he` reuses both with its own h1. `src/shared/api/contact.js` tested.
- Order links verified both ways: empty → no buttons + fallback; filled (temporary
  site.json edit, reverted) → two buttons and header CTA "Đặt online" in online hours.
- UI `harness/runs/ui-home-1.5/` (empty-links, with-links, regress-*). Gate
  `harness/runs/20261107-121449-EqEQ5W/` (passed, fresh).

## 2026-11-07 — home-page 1.4: gallery preview

- Shared `MasonryGrid` (CSS columns, tiles open the lightbox, lazy, true ratio boxes);
  `GalleryPreview` (8–12 photos, placeholders naming 8 shots when none, Xem tất cả ảnh).
  `galleryPreview(limit, items, exclude)` skips the intro photo (found by the flow: the
  same photo appeared twice). Fixture generator `harness/ui/make-fixture-media.mjs`.
- UI `harness/runs/ui-home-1.4/` passed 390/1440 (14 fixture photos + 2 clips, removed
  after). Gate `harness/runs/20261107-121020-OnUjvp/` (passed, fresh).

## 2026-11-07 — home-page 1.3: reels and shared lightbox

- `src/shared/components/lightbox.jsx` (+ `api/lightbox.js` tested): counter "n / N",
  ← → keys, swipe, Esc, focus trap/return, sound toggle, video stops on close/next,
  contact bar hidden. `Reels`: 4–8 portrait posters in a snap strip; placeholders name
  the clips to shoot when none exist. Source-level component tests keep units at A.
- Harness fix: `flow.mjs` click now scrolls with `behavior: 'instant'` (smooth scroll
  made taps land on the old position).
- UI: `harness/runs/ui-home-1.3/` passed 390/1440 with 5 fixture clips (removed after);
  no mp4 before tap, one after. Gate `harness/runs/20261107-114201-oqn5OZ/` (passed, fresh).

## 2026-11-07 — home-page 1.2: intro and featured drinks

- `Intro` (story + 3 facts + large photo or placeholder), `FeaturedDrinks` (menu.json
  `featured`, 4:5 cards, Bán chạy), shared `SectionHead`. `[id]` scroll-margin for the header.
- Price change test: ca-phe-muoi 20000 → 22000 showed `22.000đ` on home and `/menu`
  (reverted). UI `harness/runs/ui-home-1.2/` passed 390/1440. Gate
  `harness/runs/20261107-113750-mP0ZfR/` (passed, fresh).

## 2026-11-07 — home-page 1.1: hero

- `src/features/home`: Hero (poster picture, landscape/portrait video picked after mount,
  green veil, status badge, h1 + hours, Xem menu / Chỉ đường), `useHeroVideo`
  (`useSyncExternalStore` over matchMedia + Save-Data), slogan options in `config/hero.js`.
- UI: `harness/runs/ui-home-1.1/{no-media,with-media,reduced}/` all passed at 390/1440:
  phone plays `doc-720.mp4`, desktop `ngang-1080.mp4`, one mp4 each; reduced motion
  requests none. Fixture hero videos were generated, then removed (not committed).
- Gate: `harness/runs/20261107-113549-tTVOga/` (passed, fresh).

## 2026-11-07 — menu-page 1.2: /menu

- `src/features/menu`: MenuPage (header with price range, call + print buttons), sticky
  CategoryTabs with scroll-spy, MenuCategory (options, ruled 2-column rows), MenuItemCard
  (photo or name frame, Bán chạy, Tạm hết dimmed). Route `src/app/menu/page.jsx`.
- Fixed: stray "backtick-n" text in `src/app/layout.jsx` since site-foundation 2.1 (PowerShell
  escape written into source). Harness gap closed: write source files with the write/edit
  tools, never PowerShell string replacement with backtick escapes. Harness: `harness/ui/flows/common.mjs` now fails on stray literal text
  (proved against the old layout).
- Fixed: Next 16 export writes `menu/__next.menu/__PAGE__.txt` but the router requests
  `menu/__next.menu.__PAGE__.txt` (404 on every client navigation). `scripts/flatten-prefetch.mjs`
  runs after `next build` (tested).
- UI: `harness/runs/ui-menu-page-1.2/` all checks passed at 390/1440, incl. a temporary 25-item
  category (`stress/`, not committed). Gate: `harness/runs/20261107-113204-GRdx2b/` (passed, fresh).

## 2026-11-07 — menu-page 1.1: menu.json and readers

- `src/data/menu.json` (13 provisional items, options đường/đá, descriptions proposed for owner
  review); `src/shared/config/menu.js` validation with Vietnamese errors; `src/shared/api/menu.js`
  (featured, options, price range, visible categories) + 5 tests.
- Evidence: `harness/runs/20261107-112717-ZLDcfj/` (passed, fresh).

## 2026-11-07 — media-pipeline 1.3: media readers and components

- `src/shared/api/media.js` (srcset, hero landscape/portrait, menu image, gallery, reels,
  preview, lead photo, video source by height) + tests; `ResponsiveImage` (picture AVIF/WebP,
  width/height, blur, lazy unless priority) and `VideoPoster` (poster + play, no video load).
- Task 1.4 blocked: `media-src/` is empty (owner has not copied photos/videos yet). Pages
  render labelled placeholders until then; continuing with home-page in parallel.
- Evidence: `harness/runs/20261107-112433-YjrZGr/` (passed, fresh).

## 2026-11-07 — media-pipeline 1.2: pnpm media

- `scripts/process-media.mjs` (`pnpm media`): sharp AVIF+WebP 480/960/1600 (no upscale),
  EXIF rotate + metadata stripped, 16px blur; ffmpeg H.264 CRF 26–28 faststart, 720/1080
  short side, hero muted ≤20 s with CRF raised until ≤2 MB/≤3 MB, clips ≤60 s with AAC,
  WebP poster at 1 s; cache `media-src/.cache.json`; removed sources delete their outputs.
- Verified on generated fixtures (temp dir, `MEDIA_SRC/MEDIA_OUT/MEDIA_MANIFEST` env):
  5 files processed, 2nd run 0 processed, hand-edited caption kept, deleted clip's outputs removed,
  hero 720/1080 within budget. `src/data/media.json` empty until the owner adds media.
- Evidence: `harness/runs/20261107-112140-xGyh7o/` (passed, fresh).

## 2026-11-07 — media-pipeline 1.1: media helpers

- `src/shared/api/media-core.js` (slugify, classify by folder, orientation, Vietnamese alt
  suggestion, manifest merge keeping alt/caption/featured/group, planned widths) +
  7 tests; `src/shared/config/media-groups.js`; `media-src/` ignored except README.
- Evidence: `harness/runs/20261107-111928-1N7GHj/` (passed, fresh).

## 2026-11-07 — site-foundation 2.1: shared components and site chrome

- Shared: `Logo` (unchanged brand SVGs), `Button` (one family, 48px, hover step/press),
  `StatusBadge`, `MediaPlaceholder`, `FacebookIcon`; hooks `useScrolled`, `useDialog`
  (focus trap, Esc, scroll lock, body flag); `routes.js` path helpers.
- Feature `site-chrome`: `SiteFrame` = Header (transparent over home hero, solid after
  24px, CTA "Gọi đặt món" ↔ "Đặt online"), MobileDrawer, Footer (brand green, white
  logo), mobile ContactBar (hidden while drawer/lightbox open). `ChromeGate` hides chrome
  on `BARE_ROUTES` (`/menu-in`).
- Design direction: taste-skill **place** plan, owner brief wins on conflicts (decision
  log in `openspec/archive/site-foundation/proposal.md`).
- New harness tool `harness/ui/flow.mjs` (CDP, no dependency) + flows in
  `harness/ui/flows/`: no horizontal scroll, 44px targets, lang, one h1, console/404s,
  drawer focus/Esc. Run: `node harness/ui/flow.mjs --flow harness/ui/flows/site-chrome.mjs --root out --widths 390,1440`.
- Evidence: gate `harness/runs/20261107-111554-CZ1keY/` (passed, fresh); UI
  `harness/runs/ui-site-foundation-2.1/` (all checks passed, screenshots 390/1440).
- Discovered: Next 16 static export + route group `(site)` → prefetch 404s
  (`__next.!KHNpdGUp.__PAGE__.txt`); route groups avoided (docs/architecture.md).
  Node ESM tests need explicit `.js` in imports of `.js` logic files.
- Harness gap: `prettier --write src` reformatted untouched files and failed
  `no-format-churn`; format only the files you wrote.
## 2026-11-07 — site-foundation 1.1: Tailwind tokens, static export, site.json, open status

- Brief `ANH-TU-PROMP.md` turned into `openspec/project.md` (purpose, routes, facts,
  thresholds) and 8 changes under `openspec/changes/`: site-foundation, media-pipeline,
  home-page, menu-page, gallery-page, print-menu, seo-sharing, launch-performance.
- Task 1.1 done: Tailwind v4 (`@theme` tokens brand/brand-ink/surface/surface-alt),
  Montserrat latin+vietnamese, `output: 'export'` + `trailingSlash` (ADR-0005),
  `src/data/site.json`, `src/shared/{types,config,api,hooks}` (open status in
  Asia/Ho_Chi_Minh, price/phone/tel/Zalo formatters, order-link rule) with 10 unit
  tests; ESLint `no-restricted-syntax` rejects hex colours outside
  `src/shared/config/brand.js`; logos copied unchanged to `public/brand/`;
  `"type": "module"` in package.json. Map coordinates resolved from the short link:
  10.8052243, 106.589173.
- Evidence: `harness/runs/20261107-104401-DH2F7h/` (passed, fresh).
- Next: site-foundation 2.1 (shared components + site-chrome feature, browser checks).
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

- Fixed (site-foundation 1.1): `harness/lib/workflow.mjs` fingerprint hashed a Windows
  symlink target with `\` while the WSL gate clone stores `/` (`.claude/skills/design-taste-frontend`),
  so every Windows run reported `fresh: false`. Targets are now normalised to `/` on win32.
  TODO: a harness test for the symlink case (`harness/tests/workflow.test.cjs`).
- Styling rule chosen (ADR-0005): hex-colour lint is in place; the quality-grade rubric
  has no styling criterion yet.

## Discovered

- None recorded yet.
