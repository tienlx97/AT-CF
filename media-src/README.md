# media-src — ảnh và video gốc (không commit)

Chép ảnh/video gốc vào đây rồi chạy `pnpm media`. Website chỉ dùng bản đã nén
trong `public/media/` và danh sách `src/data/media.json` do lệnh này tạo.

```
media-src/
  hero/               video hero: 1 ngang (16:9) + 1 dọc (9:16), 10–20 giây
  menu/               ảnh từng món, tên file = mã món: ca-phe-muoi.jpg, bac-xiu.jpg …
  gallery/
    pha-che/          quầy, máy pha, rót cà phê
    do-uong/          ly nước, tem ly
    khong-gian/       mặt tiền, dù xanh, bàn ghế
    khach-hang/       khách, không khí
  video/              video ngắn khác (quay dọc bằng điện thoại)
```

- Tên file có dấu, có khoảng trắng cũng được: lệnh tự chuẩn hoá (`Mặt Tiền 01.JPG` → `mat-tien-01`).
- Chạy lại `pnpm media` bao nhiêu lần cũng được: chỉ xử lý file mới hoặc đã đổi.
- Sửa `alt`, `caption`, `featured` trong `src/data/media.json` tuỳ ý: lần chạy sau vẫn giữ.
- Chưa có `ffmpeg`: `winget install ffmpeg` (ảnh vẫn được xử lý).