# ADR-0005: Static export, Tailwind CSS v4 tokens, JSON content files

**Status:** accepted
**Date:** 2026-11-07

## Context

The owner's brief (`ANH-TU-PROMP.md`) asks for a fast, image-heavy, mobile-first
site with no backend for now, free hosting, Tailwind CSS v4 with four brand
colours as tokens, Montserrat with Vietnamese glyphs, and content the owner can
edit without touching code.

## Decision

Build a fully static site with Next.js `output: 'export'` (output in `out/`),
style it with Tailwind CSS v4 whose only colours are the `@theme` tokens
`brand`, `brand-ink`, `surface`, `surface-alt`, and keep content in
`src/data/{site,menu,media}.json`, read only through `src/shared/config`.

- `trailingSlash: true` so every route is a folder `index.html` on any static host.
- `images.unoptimized: true`; responsive images come from `pnpm media`
  (`media-pipeline` change), not the Next image server.
- Montserrat via `next/font/google` (self-hosted at build), subsets latin + vietnamese.
- Time-dependent UI (open status) renders after mount, never at build time.

## Consequences

- Deploys anywhere (Vercel, Netlify, Cloudflare Pages) for free; no server code,
  route handlers or request-time data.
- Changing content means editing JSON and rebuilding (Vercel rebuilds on push).
- No on-the-fly image resizing; the media script is responsible for sizes.

## Enforcement

- Hex colours: `no-restricted-syntax` in `eslint.config.mjs` (only
  `src/shared/config/brand.js` exempt); the gate's lint step fails otherwise.
- Static export: `next build` fails on server-only features under `output: 'export'`.
- Content validation: `src/shared/config/site.js` throws at build on missing fields.