# Proposal: media-pipeline

**Status:** in-progress
**Created:** 2026-11-07

## Why

The shop has hundreds of photos and videos from phones. Served raw they would make
the site unusable on 4G. One repeatable command must compress them, generate
responsive sizes, posters and blur placeholders, and write `src/data/media.json`
while keeping the owner's captions. Source: `ANH-TU-PROMP.md` section 6.

## What changes

- `media-src/` (git-ignored) layout: `hero/`, `menu/`, `gallery/<pha-che|do-uong|khong-gian|khach-hang>/`, `video/`.
- `scripts/process-media.mjs` + `pnpm media`: sharp (EXIF rotate, strip metadata, AVIF + WebP at 480/960/1600, 16 px blur placeholder, true size) and ffmpeg (H.264 CRF 26–28, faststart, ≤1080p + 720p mobile, hero muted ≤3 MB / ≤2 MB, gallery ≤60 s, WebP poster at 1 s, duration + orientation).
- Incremental: a content hash cache skips unchanged files; re-runs are idempotent.
- `src/data/media.json` merge that preserves `alt`, `caption`, `featured`, `group` edited by hand; Vietnamese `alt` suggested from folder + file name.
- Report: file count, bytes before/after, failures; ffmpeg missing → `winget install ffmpeg` hint.
- `src/shared/api/media.js` readers (by group, featured, hero, menu image by id) + `ResponsiveImage` / `VideoPoster` shared components.

## Out of scope

- Pages that display media (home, gallery). Uploading media to a CDN.

## Decision log

| Date | Decision | Why |
|---|---|---|