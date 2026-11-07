# Tasks: media-pipeline

## 1. Pipeline

- [x] 1.1 Pure media helpers (slugify, group, alt, merge) with tests; `media-src/` git-ignored with README of the folder layout — verify: unit tests pass, gate passes
- [x] 1.2 `scripts/process-media.mjs` images (sharp) + videos (ffmpeg), cache, report, `pnpm media` — verify: run on sample/real media twice (second run 0 processed), hero size budget met, gate passes
- [ ] 1.3 Shared media readers and `ResponsiveImage` / `VideoPoster` components (picture/srcset, lazy, blur, width/height; preload none) — verify: unit tests for readers, gate passes
- [ ] 1.4 Run on the owner's real media, review images and propose hero/intro/featured picks and rejects in PROGRESS — verify: report in run dir