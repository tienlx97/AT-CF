# Proposal: seo-sharing

**Status:** draft
**Created:** 2026-11-07

## Why

Neighbours search Google Maps/Search and share links on Zalo and Facebook. Source:
`ANH-TU-PROMP.md` section 7.

## What changes

- Per-page Vietnamese `title`/`description`, `metadataBase`, canonical URLs.
- Open Graph + Twitter card image 1200×630 (green + white logo + coffee photo or placeholder) generated at build.
- JSON-LD `CafeOrCoffeeShop` (name, logo, image, address, geo, openingHoursSpecification, telephone, menu, servesCuisine, priceRange `8.000đ–20.000đ`, sameAs).
- `sitemap.xml`, `robots.txt`, favicon, apple-touch-icon, web manifest from the logo.
- Post-launch notes: Google Business Profile, Search Console.

## Out of scope

- English locale.

## Decision log

| Date | Decision | Why |
|---|---|---|