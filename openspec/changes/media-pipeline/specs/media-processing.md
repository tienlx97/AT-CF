# Spec: Media processing

## Requirement: New photos appear after one command

### Scenario: add a photo

- **GIVEN** `media-src/gallery/khong-gian/Mặt Tiền 01.JPG`
- **WHEN** the owner runs `pnpm media`
- **THEN** `public/media/gallery/mat-tien-01-{480,960,1600}.{avif,webp}` exist
- **AND** `media.json` has an entry with group `khong-gian`, true width/height, a blur placeholder and a Vietnamese alt

### Scenario: captions survive

- **GIVEN** the owner edited `caption` of an entry
- **WHEN** `pnpm media` runs again
- **THEN** that caption is unchanged

### Scenario: unchanged files are skipped

- **GIVEN** no file in `media-src/` changed
- **WHEN** `pnpm media` runs
- **THEN** it reports 0 processed

### Scenario: ffmpeg missing

- **GIVEN** no `ffmpeg` on PATH
- **THEN** images are still processed and the report says to run `winget install ffmpeg`