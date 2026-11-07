# Đưa website Anh Tú Coffee lên mạng

Website là **web tĩnh** (ADR-0005): `pnpm build` tạo thư mục `out/` gồm HTML, CSS, JS,
ảnh và video. Không cần máy chủ, không tốn phí máy chủ. Mọi bước dưới đây do chủ quán
làm (hoặc duyệt): agent không tự push hay deploy (AGENTS.md).

## 0. Trước khi đưa lên

1. Chép ảnh/video gốc vào `media-src/` (xem `media-src/README.md`), chạy `pnpm media`.
2. Sửa `alt`/`caption`/`featured` trong `src/data/media.json` nếu muốn.
3. Chạy `pnpm brand` để ảnh chia sẻ `public/og.png` có ảnh ly cà phê thật.
4. Kiểm tra `src/data/site.json`: `siteUrl` = tên miền thật (tạm thời `https://anhtucoffee.vercel.app`),
   `tagline` (slogan đã chọn), link ShopeeFood/GrabFood khi có.
5. `pnpm build` không lỗi, mở `pnpm dev` xem lại trên điện thoại.

## 1. Vercel qua GitHub (khuyến nghị, miễn phí)

1. Tạo tài khoản GitHub, tạo kho **riêng tư** `anh-tu-coffee`, đẩy mã nguồn lên
   (`git remote add origin …`, `git push -u origin main`).
2. Vào <https://vercel.com>, đăng nhập bằng GitHub → **Add New… → Project** → chọn kho.
3. Vercel tự nhận Next.js. Giữ mặc định: Build Command `pnpm build`, Output `out`
   (vì `output: 'export'`). Bấm **Deploy**.
4. Sau 1–2 phút có địa chỉ `https://anh-tu-coffee.vercel.app` (đổi tên dự án thành
   `anhtucoffee` để có `anhtucoffee.vercel.app`).
5. Từ nay: sửa `menu.json`/`site.json` → commit → push → Vercel tự build lại trong ~1 phút.

Gói Hobby miễn phí: 100 GB băng thông/tháng, đủ cho quán nhỏ. Lưu ý gói Hobby là cho
dùng phi thương mại; nếu Vercel yêu cầu, chuyển sang Cloudflare Pages (mục 2) – cũng miễn phí
và cho phép dùng thương mại.

## 2. Phương án dự phòng

- **Cloudflare Pages** (miễn phí, băng thông không giới hạn, cho phép thương mại):
  Workers & Pages → Create → Pages → Connect to Git → chọn kho; Build command
  `pnpm build`, Build output `out`; biến môi trường `NODE_VERSION=22`.
  Giới hạn: mỗi file ≤ 25 MB, tối đa 20.000 file.
- **Netlify** (miễn phí 100 GB/tháng): Add new site → Import from Git; Build `pnpm build`,
  Publish directory `out`.

## 3. Video nặng

Mỗi lần `pnpm media` in tổng dung lượng. Hướng dẫn:

- Dưới ~300 MB trong `public/media/`: để chung trong kho GitHub là được.
- Nhiều hơn, hoặc kho GitHub báo file > 50 MB: đưa video lên **Cloudflare R2**
  (10 GB miễn phí, không tính phí băng thông) hoặc **Bunny CDN** (~1 USD/tháng cho quán nhỏ),
  rồi đổi đường dẫn `src`/`videos[].src` trong `media.json` sang địa chỉ R2/Bunny.
- Cách đơn giản nhất: chỉ đưa 4–8 video hay nhất lên web (reels), còn lại đăng
  Facebook/TikTok và để link.

## 4. Tên miền

1. Kiểm tra còn trống: `anhtucoffee.vn` (ưu tiên) → `anhtucoffee.com` → `anhtu.coffee`.
   Tên `.vn` mua tại nhà đăng ký được VNNIC công nhận (Mắt Bão, PA Vietnam, Nhân Hòa…),
   cần CCCD/giấy phép kinh doanh, khoảng 450.000–750.000đ năm đầu. `.com` mua ở
   Cloudflare Registrar / Namecheap khoảng 250.000đ/năm.
2. Trỏ tên miền về Vercel: Vercel → Project → Settings → **Domains** → thêm
   `anhtucoffee.vn` và `www.anhtucoffee.vn`. Vercel hiện bản ghi cần tạo; tại nhà đăng ký:
   - bản ghi `A` cho `@` → `76.76.21.21`
   - bản ghi `CNAME` cho `www` → `cname.vercel-dns.com`
   (Dùng Cloudflare Pages thì làm theo màn hình Custom domains của Pages.)
3. Chờ 5 phút – vài giờ, Vercel tự cấp HTTPS.
4. Đổi `siteUrl` trong `src/data/site.json` thành `https://anhtucoffee.vn`, push lại
   (để sitemap, mã QR menu in và thẻ chia sẻ dùng đúng tên miền), rồi **in lại menu A4**.

## 5. Sau khi lên mạng

- **Google Business Profile** (<https://business.google.com>): nhận quản lý ghim
  "Anh Tú Coffee" đang có trên Maps, điền đúng giờ 5:30–11:00 / 11:00–20:00, số điện thoại,
  website, đăng 10–20 ảnh thật. Đây là nơi khách tìm "cà phê gần đây" thấy quán.
- **Google Search Console** (<https://search.google.com/search-console>): thêm tên miền,
  xác minh bằng bản ghi TXT, gửi `https://<tên miền>/sitemap.xml`.
- Thử gửi link trang chủ qua **Zalo** và **Facebook** để xem ảnh và tiêu đề hiện đúng
  (Facebook: <https://developers.facebook.com/tools/debug/> → Scrape Again nếu ảnh cũ).
- Bấm thử "Gọi", "Zalo", "Chỉ đường" trên điện thoại thật.
