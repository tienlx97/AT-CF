# Proposal: gallery-page

**Status:** done
**Created:** 2026-11-07

## Why

The shop's photos and clips are its strongest selling point, but hundreds of
files must not load at once. Source: `ANH-TU-PROMP.md` section 4 (`/hinh-anh`).

## What changes

- `/hinh-anh`: filters Tất cả · Pha chế · Đồ uống · Không gian quán · Khách hàng · Video; masonry grid; first 24 then `Xem thêm`.
- Lightbox for images and videos: swipe on touch, arrow keys and Esc, caption, counter `5 / 120`, video with sound toggle, stops on close, focus managed.

## Out of scope

- Uploading, comments, likes.

## Decision log

| Date | Decision | Why |
|---|---|---|