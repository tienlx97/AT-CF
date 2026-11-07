# Progress Log

Entries newer than 14 days, newest first. Older ones: harness/progress/<YYYY-MM>.md
(`node harness/progress-rotate.mjs`). Add new entries at the top.

## 2026-11-07 — layout-readability 1.13: replacement editorial introduction

- Inspected https://kafa.com.vn/about in agent-browser at desktop/mobile; screenshots: harness/runs/ui-intro-reference/. Observed bold multiline about typography, concise story copy and visual/fact hierarchy. Adapted the composition, not Kafa assets, brand colours, history, statistics or copy.
- Replaced the old overlapping fact card, centered introduction and full-bleed photo pair with a white editorial split: three-line coffee heading, short existing shop copy, menu arrow link, source-derived coffee purity/hours/start-price rows. Actual owner stall photograph is now the primary image, cropped around the cart; existing process-detail photo sits beneath. Phone/tablet stacks copy before images. All imagery lazy-loaded; no new client state/dependency. Hero/navbar and every other section/data/price preserved; gallery exclusions remain stable.
- Before evidence at 390/768/1024/1440: harness/runs/ui-intro-before/. After: harness/runs/ui-intro-after/result.json and intro/intro-photos screenshots, all checks passed at all four widths: images loaded, responsive composition, source facts, menu navigation, no overflow, no contacts/console errors/404s. Parent reviewed desktop/mobile screenshots. Final screenshot alignment reserves 72px for sticky header; production section itself was not obscured.
- Fresh full WSL gate passed: harness/runs/20261107-202511-28wiRU/ (fresh true, 51.312s). Added persistent source regression and dedicated home-intro browser flow. init.sh passed all 37 checks. Taste checker still crashes internally with r.sections is not iterable (harness/runs/intro-taste.log), kit unchanged and not claimed passing.
- No invented facts, new reference assets or deployment. Unrelated Tailwind skill installation preserved. Owner subsequently authorized commit-all then push; parent handles Git, this task worker does not commit/push.

## 2026-11-07 — layout-readability 1.12: menu and home refinement

- Balanced the menu masthead with a separate desktop action column, retained full-width mobile actions, exposed existing category descriptions, added a 2/3/4-column phone/tablet/desktop grid and subtle card rules. Category navigation wraps rather than hiding links in a swipe strip. No names, prices, photographs or purchase destinations changed.
- Home keeps the approved centered menu composition, uncropped cup-ready photographs, hero and green/white navbar. Refined menu spacing, sentence-case heading and lighter consistent section typography across introduction/gallery/reels/visit.
- Fresh full WSL gate passed: harness/runs/20261107-164207-axhIfA/ (fresh true). Menu and home-featured browser flows passed at 390/768/1024/1440: harness/runs/ui-refinement-menu-after/result.json and harness/runs/ui-refinement-home-after/result.json. Before screenshots: ui-refinement-baseline/ and ui-refinement-home-baseline/; after screenshots reviewed desktop/mobile including menu, introduction and featured drinks. Added persistent category-link visibility/target, description and responsive-column checks to menu flow. init.sh: 37 checks passed.
- Print-menu flow passed 390/1440 (all items, two QR codes, ShopeeFood, no site chrome): harness/runs/ui-refinement-print/result.json. Site-chrome assertions passed both widths (green/white logo, 0px geometry shift, contrast 11.86, drawer focus/Escape) but the final screenshot stalled; interrupted that optional run and do not claim a complete site-chrome result.json.
- Harness gaps: root out/ initially held a pre-ShopeeFood export; rebuilt current sources before baseline, and excluded the stale ui-refinement-before/ results. Whole-file Prettier introduced legacy format churn; restored original formatting around scoped edits and reran the gate successfully. Taste layout checker still fails internally with r.sections is not iterable (existing Next/site-wrap incompatibility); kit unchanged, not claimed passing. No new assets, dependencies, assumed business facts, push or deployment.

## 2026-11-07 — layout-readability 1.11: owner-reference journal

- Added /nhat-ky/ and six statically exported /nhat-ky/[id]/ articles using the content from E:/VIBE CODE/ANH-TU-COFFEE without modifying the reference project. New journal feature exposes its pages and entries only through index.js. Editable copy: src/data/journal.json; illustrations: public/diary/. Preserved supplied dates/stories; explicitly labeled the reference SVG placeholders and omitted missing placeholder videos.
- Adapted the index to existing green/white typography: latest article first, ruled featured row and responsive archive grid. Article pages have readable prose, image gallery, back navigation and two related stories. Added per-article canonical metadata and sitemap entries. Navbar now has five links, using the drawer below 1280px after screenshot review caught the ShopeeFood CTA wrapping at 1024px. CTA stays on one line; green/white logo and scroll geometry retained.
- Full gate passed, fresh true: harness/runs/20261107-161815-1q69Sz/. Browser evidence: harness/runs/ui-journal-final/result.json — 407 checks, 0 failures at 390/768/1024/1440. All six articles and images checked at each width, list-to-detail navigation, no unavailable videos, back links, drawer presence/focus/Escape, navbar 0px scroll shift, contrast 11.86, compact footer and ShopeeFood-only policy. Index/article/drawer screenshots inspected.
- Harness gaps: first gate caught formatting churn in site config, old four-link assertions and missing journal quality inventory. Restored original formatting, updated navigation expectations and regenerated grades without weakening thresholds. Added persistent journal asset/chronology tests and browser flow. Taste checker ran at 390/1440 and only reports its kit-specific missing .wrap convention (app uses .site-wrap); no horizontal overflow. Evidence: harness/runs/journal-taste.log. Engram MCP unavailable; no observations/sync. No commit/archive because touched files overlap substantial pre-existing owner work; preserved changes without bundling unrelated work.

## 2026-11-07 — layout-readability 1.10: ShopeeFood beacon and green navbar

- Owner requests a bottom-right ShopeeFood icon with motion like kafa.com.vn, and the original green navbar/white logo. Reference inspected in agent-browser: two expanding rings, delayed by about half a cycle; screenshot harness/runs/ui-shopee-float-ref/kafa.png. Implemented independent, restrained CSS waves (1.8s × 2, second delayed 0.8s: settles within 4.4s), replay on hover/focus, disabled under reduced motion. No continuous motion, new client dependency or direct-contact action.
- Self-hosted the original 3.9KB official artwork from https://shopeefood.vn/app/assets/img/shopeefoodvn.png?4aa1a38e8da801f4029b80734905f3f7 as public/brand/shopeefood-wordmark.png. The icon is shown by CSS clipping the original mark, not redrawing a brand look-alike. Floating action uses the existing configured ShopeeFood URL and safe new-tab attributes; mobile inset clears hero controls, safe-area spacing retained. Hidden during drawer/lightbox and print; ChromeGate excludes it on /menu-in.
- Navbar and mobile drawer top bar now use brand-ink green with original white logo; compact dimensions and scroll alignment unchanged. Footer remains minimal and all purchases remain ShopeeFood-only, with the previously authorized platform-homepage placeholder until a real store URL is supplied. Architecture/proposal updated.
- Full gate passed, fresh true: harness/runs/20261107-160523-sqeUCC/. Browser results/screenshots at 390/768/1024/1440: harness/runs/ui-shopee-float/result.json (all passed). Checked official artwork load, URL/new-tab/accessibility/pointer target, lower-right bounds, real wave expansion/finite timing/focus replay, reduced-motion suppression, overlay hide/restore, print exclusion, availability on menu/gallery/address, green/white navbar contrast and 0px scroll shift. Desktop/mobile/tablet screenshots reviewed.
- Initial gate caught promoting the vendor orange into the protected four-colour @theme palette. Kept the four brand tokens unchanged and scoped the third-party colour to the ShopeeFood component; no check weakened. Added persistent floating-action browser flow and navbar-colour/white-logo assertions. init.sh passed. Existing taste-kit checker incompatibility and unavailable Engram MCP remain as recorded under 1.9; no save/sync or bundled commit/archive while owner work overlaps these files.

## 2026-11-07 — layout-readability 1.9: minimal footer, ShopeeFood-only purchases

- Owner asks for a simple footer and no purchase contact on the site; purchases go through ShopeeFood. Owner explicitly authorized a temporary link because the store URL does not exist yet. Configured the verified platform homepage https://shopeefood.vn/ (not an invented merchant URL); replacing site.order.shopeefood later updates purchase actions and build-time QR output.
- Footer is now a compact white brand/address/counter-hours row with Facebook and ShopeeFood links, then copyright. Removed the floating phone/Zalo bar and the large ContactOrder block. Header, mobile drawer and menu actions go directly to ShopeeFood; no phone fallback at any time of day. GrabFood is ignored even if configured. Empty/invalid ShopeeFood links hide purchase actions. Retained owner phone/Zalo source facts, but removed them from public UI, print and JSON-LD. The retained /lien-he route is labelled Địa chỉ and contains address/hours/map only.
- Printable menu now shows ShopeeFood instead of a phone number, and its second QR goes to the configured purchase URL instead of Zalo. First QR remains the website menu. Existing menu names/prices and shop hours unchanged. Project scope and architecture inventory updated to the owner's new channel policy.
- Full gate passed, fresh true: harness/runs/20261107-155613-oWrHxp/. Browser evidence: harness/runs/ui-footer-shopee/result.json — 532 checks, 0 failures at 390/768/1024/1440. Hero/overlay/navbar/drawer/Thực đơn/full menu/print preview checked at all widths; gallery and address/map flows at 390/1440. Footer screenshots reviewed desktop/mobile/tablet (about 212px at desktop, 323px on phone). All public-route checks reject tel/Zalo/GrabFood links; print checks reject phone/Zalo text and confirm two QR codes; purchase-link checks confirm the configured external URL and safe new-tab attributes. Navbar scroll geometry remains stable.
- Initial gate caught import sorting in two new unit-test files; applied the existing ESLint autofix and reran the full gate successfully. Added persistent unit checks for sole-channel selection and invalid-link handling, plus public-page checks against direct-contact ordering and compact footer checks. Known taste-kit layout checker incompatibility and unavailable Engram remain as recorded under 1.8; no save/sync. No commit/archive because touched files overlap substantial pre-existing owner work; preserved it without bundling unrelated changes.

## 2026-11-07 — layout-readability 1.8: local hero shade and cup-led menu

- Applied the owner's exact radial overlay inside a bounded desktop copy wrapper; decorative, click-through, hidden below lg. Reduced the broad desktop shade so the rest of the photograph stays clear. Compact flush white navbar, smaller original logo, outlined action and stable scroll geometry on every route.
- Reference pages inspected with agent-browser; screenshots in harness/runs/ui-menu-reference/. Home section now Thực đơn with centered heading, category navigation, four coffee items and existing prices. No borrowed brand assets or product claims. Cup frames use object-contain, bottom alignment and no blur backdrop so future transparent cup photos render cleanly; current photos retained. Fixed category URLs to the real #nhom-* anchors. Navigation and hero action use Thực đơn; full menu uses the same uncropped image treatment.
- Full gate harness/runs/20261107-154243-PkP4UA/ passed, fresh true. Browser flows passed 390/768/1024/1440: harness/runs/ui-menu-refresh/ (hero, overlay, compact navbar/scroll, menu preview/category links, full menu; gallery at 390/1440). Final white-surface/bottom-alignment checks passed 390/1440: harness/runs/ui-menu-refresh-final/. Desktop/mobile screenshots reviewed. Source photos are awaiting the owner's isolated cup replacements.
- Known taste checker incompatibility, unavailable Engram MCP and overlapping pre-existing uncommitted owner work remain as recorded under 1.7; no memory save/sync or bundled commit/archive. Continuing owner-authorized footer/channel follow-up as task 1.9.

## 2026-11-07 — layout-readability 1.7: stable navbar, button borders and shorter hero

- Owner reports the navbar shifts on scroll; asks for button borders and a slightly shorter hero. Root cause: the overHero state changed outer top padding and inner horizontal padding, moving the logo, navigation and CTA. Home now keeps the same floating frame/padding at every scroll position; overHero is observability only. Other routes retain their existing flush navbar.
- Shared Button variants now have constant border widths with appropriate light/dark colour and hover emphasis. Added matching borders to navbar/drawer controls and CTA, menu category tabs, gallery filter chips and the video play disc; contact pills and slider controls retain their existing outlines.
- Hero min-height is 92svh instead of 100svh (828px at a 900px viewport, about 776.5px at 844px), retaining owner-edited hero copy and action visibility.
- Full gate passed, fresh true: harness/runs/20261107-152851-rCwGC9/. Browser evidence: harness/runs/ui-navbar-stable/result.json and screenshots at 390/768/1024/1440; all passed. Navbar frame/logo/links/CTA rectangles measured at scroll 0, 12, 23, 24, 25, 80 and 600 and back to 0: maximum shift 0px at every width. Menu/gallery navbar scroll checks and visible solid button borders passed. Hero navigation/slider/drawer passed at all four widths; menu/gallery filters/lightbox/reels/print preview also passed at 390/1440. Desktop/mobile/tablet screenshots reviewed before and after scrolling.
- Harness gap fixed: previous checks measured navbar contrast and state but missed position changes across the scroll threshold. Persistent site-chrome flow now measures actual rectangles around the threshold and on the return scroll; hero flow checks 92% height and action borders. init.sh passed (37 harness checks).
- Known taste-kit layout checker incompatibility and unavailable Engram MCP remain as recorded under 1.6; no memory save/sync. No commit/archive: touched files overlap substantial pre-existing uncommitted owner work; preserved it without bundling unrelated changes.

## 2026-11-07 — layout-readability 1.6: plain copy, compact facts and readable navbar

- Owner supplied the real stall reference and requested simpler introduction/copy, a revised fact band and readable navigation over photos. Final introduction: "Cà phê pha máy 100% nguyên chất, ngon và sạch. Phục vụ nhanh chóng, tiện mang đi." Shortened home section headings and contact copy; removed speculative platform launch/delivery wording.
- Replaced oversized four-column statistics with three compact facts: 100% pure coffee, counter hours from site.json (5:30–11:00), coffee starting price from the coffee category (15.000đ, not the bottled-water minimum). Removed the opening-year display. Stacked label/value rows on phones, three columns on tablets/desktop; reduced overlap and introduction type/spacing.
- Final navbar is a floating light surface over the hero, original brown/green logo and green CTA; switches to the flush white header after scrolling. Background shielding preserves readability across every slide without tinting the whole photograph. Adjusted tablet gaps to keep the four navigation links and CTA within the frame.
- Full gate passed, fresh true: harness/runs/20261107-152431-SnmfoJ/. Browser results/screenshots: harness/runs/ui-copy-nav-light/ at 390/768/1024/1440, all 307 checks passed. Checked hero navigation, all four slide/header surfaces, scrolled surface, mobile drawer/focus, concise introduction, dynamic coffee price and full counter hours, fact-band geometry, menu/gallery navbar. Desktop/mobile/tablet screenshots reviewed. Header text contrast measured 11.86:1 against the effective surface (threshold 4.5).
- Concurrent owner edits changed the hero eyebrow/tag to CAFE PHA MÁY and 100% NGUYÊN CHẤT - ORGANIC, invalidating the earlier gate fingerprint. Preserved the owner's changes, aligned the hero-copy browser assertion, reran the full gate and hero checks at all four widths: harness/runs/ui-copy-nav-latest-hero/ (passed).
- Harness gap fixed: navbar visibility was previously tested only by its state flag. Browser flow now measures actual surface opacity and contrast on every slide; its CSS color conversion uses canvas so Tailwind color(srgb ...) and rgb(...) are both read correctly. Initial naive RGB-number parsing falsely failed the scrolled surface; corrected the parser, retained the threshold, reran browser checks.
- init.sh passed (37 harness checks). Known taste-kit layout checker incompatibility remains recorded under 1.5; kit unchanged. Engram MCP unavailable, no save/sync. No commit/archive of the untracked change because these files overlap substantial pre-existing owner work; preserved it without bundling unrelated changes.

## 2026-11-07 — layout-readability 1.5: ANH TÚ title and whole-site review

- Owner requests ANH TÚ only in the home hero, larger type and a slight upward move. Hero brand is now 48px at 390 and 108px at 1440; raised the action block by 32px mobile / 36px desktop, with additional tablet clearance. Neutral overlay unchanged.
- Review found the full-width slider control wrapper intercepted hero actions after raising them. Wrapper now passes through pointer events, individual control groups remain interactive, and tablet controls sit below the actions. Browser flow checks elementFromPoint for both links, exact title and responsive type/position; pauses autoplay before manual navigation checks and allows menu navigation to settle.
- Full gate passed, fresh true: harness/runs/20261107-150731-GKBLd6/. Whole-site review passed all 571 checks at 390/768/1024/1440, including hero, chrome/drawer, introduction, featured drinks, gallery preview, contact/map, menu, gallery filters/lightbox, printable preview and reel playback/swipe/focus: harness/runs/ui-home-title-final-review/result.json. Screenshots reviewed across widths. Reduced-motion hero passed 390/1440: harness/runs/ui-home-title-reduced/.
- Initial combined review preserved scroll between flows and raced autoplay; final review resets scroll and uses deterministic manual controls. Full-page CDP capture hung at 1440; stopped only that run's Node/Chrome PIDs and repeated using per-section/viewport screenshots. Taste layout checker still crashes with r.sections is not iterable; kit unchanged, not reported as passing. init.sh passed (37 harness checks).
- Discovered: menu entries without supplied photographs retain labelled placeholders; online order-platform links remain pending with call/Zalo fallback. No invented assets or links.
- Harness gaps: Engram MCP unavailable (no save/sync). No commit or archival of the untracked active change: these files overlap substantial pre-existing owner work; preserved that work without bundling it into this task.

## 2026-11-07 — layout-readability 1.4: compact lower-left hero

- Owner requests smaller hero titles, lower-left placement and less green overlay. Reduced eyebrow and brand scales (brand 32px at 390, 69.12px at 1440), bottom-aligned copy, replaced green wash with neutral bottom shading.
- Full WSL gate passed: harness/runs/20261107-150130-u1nagg/ (fresh true). Hero browser flow passed 390/768/1024/1440: harness/runs/ui-hero-compact-final/. Desktop/mobile screenshots reviewed. Updated obsolete center-alignment assertion and added browser geometry/title-size checks; live-status check now scopes to copy so aria-live=off slide counters do not falsely fail.
- Harness gaps: taste layout checker still crashes (r.sections is not iterable) on this app; kit unchanged. Engram MCP unavailable, no observations saved/sync. init dependency installation stalled; existing WSL dependencies successfully ran the full gate. No commit: task files overlap substantial pre-existing uncommitted owner work; preserved it without bundling unrelated changes.
## 2026-11-07 — layout-readability 1.3: giaoyeniz-style intro splash and home introduction

- Owner asks to apply giaoyeniz.com's intro and home introduction. Claude in Chrome was not available in this session (subagent had no such tools); reference inspected with agent-browser instead (screenshots, computed styles, @keyframes): harness/runs/ui-giaoyen-ref/.
- New `IntroSplash` (home feature): pure-CSS title card — toned photo or brand ground, outlined ghost "ANH TÚ", masked eyebrow/title rising, drawn rule, tagline, clip-path wipe at 2.3 s. aria-hidden, pointer-events none, hidden under reduced motion and print. Inline head script (`INTRO_ONCE_SCRIPT`, root layout) sets `<html data-intro-seen>` before first paint so it plays once per tab session, only on landing at `/`, never on client-side return. Hero paints underneath (no LCP delay); its staggered rise runs only when no splash plays.
- Hero: left-weighted brand-ink shade + bottom shade, eyebrow "Cà phê pha máy", title ANH TÚ COFFEE, outlined tag "Mang đi · Bình Tân", same two actions.
- Intro section: white 4-fact card overlapping the hero (100% nguyên chất, 5:30 sáng, giá từ priceRange().min, 2025 — all from site.json/menu.json), centred eyebrow with rules, heading, accent bar, lead, two edge-to-edge photo slots (brand placeholders until owner photos exist). Gallery preview excludes both intro photos.
- Harness: flow.mjs marks visitors as returning (skips splash) unless the flow exports `playsIntro`; home-hero flow checks splash presence, decorative, wipe within 3.5 s, reduced-motion skip and no replay on back navigation.
- Flows passed 390/768/1024/1440: home-hero, home-featured, home-gallery, home-contact, site-chrome, menu; reduced-motion hero 390/1440 (harness/runs/ui-giaoyen-intro/). home-reels fails as before: it needs fixture clips in media.json (empty), unrelated to this change. Full gate harness/runs/20261107-144451-r8MsUW/ passed, fresh true.
- Discovered: home-reels flow depends on fixture media not present in the default build; it should skip or generate fixtures itself.
## 2026-11-07 — layout-readability 1.2: concise single-slide home hero

- Owner asks for one Giao Yến-inspired hero slide and much less text. Retained brand type/colour and static priority photo slot; vertically centred ANH TÚ / COFFEE, one category/location line, menu + directions. Removed live status, slogan paragraph, hours and repeated address from hero only. No borrowed imagery or video; real shop photo still pending.
- Updated home-hero browser flow (it still asserted the obsolete video implementation) to enforce one screen, <25 words, visible working actions, static photo/fallback and no MP4; source tests enforce one paragraph and no duplicated facts/client carousel logic.
- Full gate harness/runs/20261107-141951-KJ2RwG/ passed, fresh true; reduced-motion flow passed 390/1440. Browser verified-build flow passed 390/768/1024/1440: harness/runs/ui-home-slide/verified-flow/. Screenshots reviewed desktop/mobile/tablet. Initial flow correctly failed against stale root out/; subsequent checks use the WSL gate build copied to the ignored run directory, not old export output.
- Taste layout checker stopped after `container: no .wrap` and an internal undefined.map error; this Next/Tailwind app uses site-wrap. Kit unchanged, no claim of a passing taste checker; project flow covers scoped hero geometry and overflow. Other page sections unchanged.
- Harness gaps: UI runner has no build-fingerprint binding and can test stale out/. Use the gate build explicitly; automating provenance is a follow-up. No broad commit of pre-existing owner changes in this dirty working tree.

## 2026-11-07 — approved static photo hero and centered introduction

- Owner approved Giao Yến-inspired direction but explicitly prohibits hero video for performance. Hero now selects a space photo with ResponsiveImage priority; no video element, source selection or media-query video hook is used. With no real photo yet, brand-ink fallback remains.
- ANH TÚ is the large hero heading with category/location beneath. Intro now has centered heading/copy/facts above a wide 21:9 image frame, replacing the side-by-side split. Reels remain separate and tap-to-play.
- Regression test now enforces no video in hero. Chrome flow passed 390/1440. Full gate harness/runs/20261107-141313-vMVn5Y/ passed fresh true; screenshot harness/runs/ui-photo-hero/home-1440.png.

## 2026-11-07 — product-first menu and reels refresh

- Owner asks to learn from giaoyeniz.com introduction; fetched reference content (not a visual browser review). Intro headline enlarged; broader reference-inspired hero restructuring remains a possible follow-up, not claimed implemented.
- Menu now uses large square product frames, 2 columns mobile / 4 desktop; removed category description/count/options and individual item descriptions from this UI, preserving source data and print menu.
- Reels refreshed to a light ground with larger mobile posters (72% viewport rail), rounded frames and dark placeholder panels; playback/lightbox logic unchanged.
- Menu browser flow passed 390/1440 and screenshot reviewed: harness/runs/ui-product-menu/menu-1440.png. Home mobile screenshot captured. Full gate harness/runs/20261107-135837-72DmFN/ passed fresh true. Real product imagery remains pending owner files; video interaction regression was not rerun in this follow-up.

## 2026-11-07 — layout-readability 1.1

- Owner requests broader content, larger text and more information; reference https://congcaphe.com/ category-led menu presentation (no copied assets/content).
- Shared wrap 75rem → 100rem with 3vw responsive gutters; desktop root type 18px (was 16px), labels 13px (was 12px). Print remains millimetre-sized and one A4 page.
- Home now exposes both existing menu categories, item counts, minimum prices and featured item descriptions from menu.json; no invented shop facts.
- UI chrome passed 390/768/1024/1440; menu and home-featured passed 390/1440; screenshot harness/runs/ui-layout-readability/home-1440.png reviewed. Gate harness/runs/20261107-135006-4Ghto2/ passed fresh true.

## 2026-11-07 — owner adjustment: navbar mark and white favicon

- Header-only logo mark enlarged from 40px to 56px mobile / 64px desktop; wordmark and footer sizes unchanged.
- Brand generator now writes the white source to app/icon.svg and a white mark on brand-ink to favicon.ico, preventing the SVG favicon from retaining the original brown artwork after regeneration.
- Browser site-chrome flow passed at 390/1440: harness/runs/ui-navbar-logo/. Full gate harness/runs/20261107-134144-FxNExY/ passed, fresh true.
- Harness gap: this small owner follow-up was verified directly without creating a new OpenSpec change.

## 2026-11-07 — launch-performance 1.1 + 1.2: Lighthouse ≥ 90, deploy guide

- `harness/ui/lighthouse.mjs` (Lighthouse 13 mobile, local CLI run async so its own
  static server answers; brotli like the hosts). Baseline: home 78 / lien-he 80 (LCP 5.9 s:
  the next/font latin-ext file for Vietnamese letters was not preloaded) and contrast fails.
- Fixes: self-hosted Montserrat variable, 2 preloaded files (`public/fonts/`, OFL);
  contrast pass (body text full ink, labels ≥ 90%/80%, contact band on brand-ink);
  featured/reel aria names match visible text; gallery eager 2, only the first high priority;
  taste-skill layout fixes (6/6 splits, one secondary style, nav no-wrap, even placeholders).
- Result, no media: `harness/runs/lighthouse-launch-1.1/` — 99–100 ×4 on all 4 routes, LCP
  ~1.0 s, CLS 0, home 221 KB. With fixture media (hero, 14 photos, clips):
  `harness/runs/lighthouse-launch-1.1-with-media/` — 100 ×4, home 1008 KB incl. 715 KB
  mobile hero video (≈ 290 KB without it; budget 1.5 MB).
- taste-skill `consistency.mjs`: 164 → 131 FAIL; the rest are owner-brief overrides recorded
  in `openspec/archive/launch-performance/proposal.md`.
- Final flows at 375/390/1440 all passed (`harness/runs/ui-launch-1.1/final-*`), SEO checks passed.
- `docs/deploy.md`: Vercel via GitHub, Cloudflare Pages / Netlify fallback, R2/Bunny for heavy
  video, domain purchase + DNS, Google Business Profile and Search Console.
- Gate `harness/runs/20261107-133101-NnqGEH/` (passed, fresh).
- Harness gap: a PowerShell hashtable of single-pair arrays flattened and corrupted 9 files
  (restored from git). Multi-file edits now go through a small node script or the edit tool.

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
