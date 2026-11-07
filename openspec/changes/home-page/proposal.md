# Proposal: home-page

**Status:** in-progress
**Created:** 2026-11-07

## Why

The home page must answer, within seconds on a phone, "is it open, what does it
cost, how do I reach it". Source: `ANH-TU-PROMP.md` section 4 (blocks 2–8).

## What changes

- Hero: landscape/portrait video (`media` hero role) with poster, green overlay, title, slogan, `Xem menu` + `Chỉ đường`, live status badge; no video under Save-Data or reduced motion.
- Intro (2–3 sentences + large photo), featured drinks (3–4 `featured` items), reels strip (4–8 vertical posters, lightbox on tap), gallery preview (8–12 masonry + `Xem tất cả`), hours + lazy map (static card + `Mở Google Maps`, iframe on demand), contact & order-online block (ShopeeFood/GrabFood hidden when empty, fallback phone/Zalo).
- `/lien-he` page reusing hours/map/contact blocks.
- Slogan options proposed to the owner (5) recorded in the decision log.

## Out of scope

- Full menu, full gallery, SEO metadata beyond page title/description.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-11-07 | Slogan options for the owner: (1) "Cà phê pha máy. Nguyên chất mỗi sáng." (in site.json now), (2) "Ghé nhanh, mang đi, ngon trọn ngày.", (3) "Ly cà phê pha máy cho người đi làm sớm.", (4) "Nguyên chất từ hạt, pha máy từng ly.", (5) "Sáng mua tại quán, chiều đặt online." — `src/features/home/config/hero.js` | Brief 12 asks for 5 options; owner picks by editing `tagline` |
| 2026-11-07 | Hero h1 "Cà phê pha máy mang đi ở Bình Tân" (category + place) with the slogan and hours as the sub-line; green veil 65% + bottom fade so white text passes AA on any footage | taste-skill copy rule 1 + brief 3 (overlay, words on video) |
| 2026-11-07 | Video chosen after mount via `useSyncExternalStore` (matchMedia); static HTML has only the poster, so nothing is requested under reduced motion / Save-Data | Brief 6.3; verified by `harness/ui/flows/home-hero.mjs` with `FLOW_REDUCED=1` |