# Progress Log

Entries newer than 14 days, newest first. Older ones: harness/progress/<YYYY-MM>.md
(`node harness/progress-rotate.mjs`). Add new entries at the top.

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
