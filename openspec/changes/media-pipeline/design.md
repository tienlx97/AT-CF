# Design: media-pipeline

## Approach

Pure helpers (`scripts/lib/media-core.mjs`: slugify Vietnamese names, group from path,
alt suggestion, merge preserving manual fields, size plan) are unit-tested; the
script wires them to sharp/ffmpeg. Outputs: `public/media/<kind>/<slug>-<w>.{avif,webp}`,
`<slug>-720.mp4`, `<slug>-1080.mp4`, `<slug>-poster.webp`. Cache: `media-src/.cache.json`
(hash → outputs). `media.json` entries:
`{ id, type: image|video, group, src, sizes:[480,960,1600], width, height, blur, poster, duration, orientation, alt, caption, featured, role: hero|menu|gallery|reel }`.

## New dependencies

- `sharp` (dev; already allowed in `pnpm-workspace.yaml`). ffmpeg is a system binary.

## Verification plan

- [ ] Unit tests for slugify, alt suggestion, merge-preserving-captions.
- [ ] Running `pnpm media` twice: second run processes 0 files.
- [ ] Hero outputs within 3 MB / 2 MB; report printed.
- [ ] Gate passes.