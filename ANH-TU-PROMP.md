# PROMPT CHO CLAUDE CODE — Website ANH TÚ COFFEE

> **Cách dùng:** chép ảnh/video gốc vào `media-src/` (xem mục 6), kiểm tra lại các ô `[...]` ở mục 12, rồi dán toàn bộ nội dung này vào Claude Code.
> Repo đã có sẵn khung Next.js + quy trình `AGENTS.md` / OpenSpec — Claude phải làm theo quy trình đó.

---

## 1. Mục tiêu

Xây dựng website giới thiệu cho quán **ANH TÚ COFFEE** — quán cà phê pha máy 100% nguyên chất, bán mang đi, sáng bán tại quán và chiều tối bán online.

Website **nặng về hình ảnh và video** (quán có **rất nhiều** ảnh và video), có **trang Menu** đầy đủ và **trang menu in A4**.

Ưu tiên số 1: **điện thoại** (đa số khách xem trên điện thoại, mạng 4G) → phải đẹp và **tải nhanh** dù có nhiều media.

Khách vào web cần làm được 3 việc trong vài giây:

1. Xem quán đang mở hay đóng, và giờ bán online.
2. Xem menu + giá.
3. Gọi điện / nhắn Zalo / chỉ đường.

## 2. Công nghệ (theo đúng repo hiện có)

- **Next.js 16 (App Router) + JavaScript + Tailwind CSS v4**, quản lý gói bằng **pnpm**. Icon dùng `lucide-react` (đã cài).
- Xuất **web tĩnh** (`output: 'export'`) — chưa cần backend, deploy miễn phí.
- Kiến trúc thư mục **bắt buộc** theo `AGENTS.md` / `docs/architecture.md`: `src/features/<feature>/{types,config,api,hooks,components}` và `src/shared/...`. Mỗi phần việc là một change trong `openspec/changes/`.
- Thiết kế giao diện dùng skill **`design-taste-frontend`** (theo `CLAUDE.md`).
- Dữ liệu tách khỏi code để tôi tự sửa, không cần đụng code:
  - `src/data/menu.json` — món, giá, nhóm, tùy chọn.
  - `src/data/site.json` — tên quán, địa chỉ, SĐT, giờ mở cửa, link mạng xã hội, slogan.
  - `src/data/media.json` — danh sách ảnh/video **do script tự tạo** (mục 6), tôi chỉ sửa chú thích/nhóm nếu muốn.
- Chạy được bằng `pnpm dev`; build bằng `pnpm build` không lỗi; `./harness/verify.sh` phải pass.

## 3. Nhận diện thương hiệu (BẮT BUỘC)

- **Logo:** `assets/logo/leaf-mark.svg` (màu nâu gốc) và `assets/logo/leaf-mark-white.svg` (bản trắng — dùng trên nền xanh). Không vẽ lại, không đổi tỉ lệ, không đổi màu logo.
- **Tên hiển thị:** **ANH TÚ** (chữ lớn, đậm) + **COFFEE** (chữ nhỏ, in hoa, giãn chữ rộng).
- **Màu** (khai báo làm token Tailwind, không viết mã màu rải rác trong code):

  | Token | Mã màu | Dùng cho |
  |---|---|---|
  | `brand` | `#2F6F55` | Xanh lá chính (giống dù/bạt của quán), nút, header khi cuộn, footer |
  | `brand-ink` | `#1F3D31` | Chữ đậm, tiêu đề |
  | `surface` | `#FFFFFF` | Nền chính |
  | `surface-alt` | `#EEF0EC` | Nền phụ xen kẽ các khối |

- Không dùng gradient sặc sỡ, không emoji, không icon hoạt hình. Phong cách: sạch, hiện đại, thân thiện, nhiều khoảng trắng, **ảnh lớn là nhân vật chính**.
- **Font:** Montserrat (qua `next/font/google`, subset `vietnamese`) — 800 cho tiêu đề, 500–700 cho nội dung. Kiểm tra dấu tiếng Việt hiển thị đúng (Ữ, Ặ, Ỷ…).
- Đồng bộ với tem ly đã thiết kế: khối nền xanh + logo trắng; nhãn nhỏ in hoa, giãn chữ rộng (vd. `CÀ PHÊ PHA MÁY`, `MANG ĐI`).

## 4. Cấu trúc trang

**Các route:**

| Route | Nội dung |
|---|---|
| `/` | Trang chủ (các khối bên dưới) |
| `/menu` | Menu đầy đủ |
| `/hinh-anh` | Thư viện ảnh & video đầy đủ |
| `/lien-he` | Giờ mở cửa, bản đồ, liên hệ |
| `/menu-in` | Menu A4 để in/treo tại quán (không có header/footer web) |

**Trang chủ, theo thứ tự:**

1. **Header** cố định: logo + điều hướng (Trang chủ, Menu, Hình ảnh, Liên hệ) + nút **"Gọi đặt món"**. Trong suốt khi nằm trên video hero, chuyển nền trắng/xanh khi cuộn. Mobile: nút menu (icon `Menu` của lucide) mở ngăn kéo toàn màn hình.
2. **Hero:** video nền `autoplay muted loop playsinline` + lớp phủ xanh mờ; **2 bản video**: ngang cho máy tính, **dọc 9:16 cho điện thoại**. Có ảnh poster hiện ngay khi chưa tải video. Tiêu đề + slogan + 2 nút: **"Xem menu"**, **"Chỉ đường"**. Nhãn trạng thái **"Đang mở cửa · đến 11:00"** / **"Đang bán online · đến 20:00"** / **"Đã đóng cửa · mở lại 5:30"** tính theo giờ Việt Nam.
3. **Giới thiệu ngắn** (2–3 câu) + 1 ảnh lớn (quầy pha máy hoặc mặt tiền).
4. **Món nổi bật:** 3–4 món đánh dấu `featured` trong `menu.json` — ảnh lớn, tên, giá.
5. **Dải video ngắn (reels):** 4–8 video dọc dạng thẻ cuộn ngang (như TikTok/Reels) — chỉ hiện poster, bấm vào mới tải và phát video trong lightbox.
6. **Xem trước thư viện ảnh:** 8–12 ảnh đẹp nhất dạng lưới masonry + nút "Xem tất cả" → `/hinh-anh`.
7. **Giờ mở cửa + bản đồ Google Maps** + địa chỉ. Bản đồ chỉ tải khi cuộn tới (hoặc hiện ảnh tĩnh + nút "Mở Google Maps") để không làm chậm trang.
8. **Liên hệ & đặt online:** số điện thoại (bấm gọi `tel:`), Zalo (`https://zalo.me/0932311434`), Facebook, TikTok (nếu có). Khối **"Đặt online 11:00 – 20:00"** gồm nút **ShopeeFood** và **GrabFood**:
   - Link lấy từ `site.json` (`shopeefood`, `grabfood`). Hiện chưa có link → để trống.
   - Khi link trống: **ẩn nút**, khối hiện "Đặt qua điện thoại / Zalo" làm phương án thay thế. Khi tôi điền link vào `site.json` thì nút tự hiện, không phải sửa code.
   - Khi cả hai link đều có và đang trong giờ 11:00 – 20:00: nút "Gọi đặt món" trên header đổi thành **"Đặt online"**.
9. **Footer:** nền xanh + logo trắng, thông tin liên hệ, giờ mở cửa, `© 2026 Anh Tú Coffee`.
10. **Nút nổi** góc phải dưới (chỉ trên mobile): **"Gọi"** + **"Zalo"**, không che nội dung quan trọng, không đè lên lightbox.

**Trang `/hinh-anh`:**

- Bộ lọc theo nhóm: **Tất cả · Pha chế · Đồ uống · Không gian quán · Khách hàng · Video**.
- Lưới masonry, ảnh tải dần (lazy) — **không tải hết hàng trăm ảnh một lần**: hiện 24 ảnh đầu, nút "Xem thêm" (hoặc tự tải khi cuộn).
- Bấm ảnh mở **lightbox**: xem lớn, vuốt trái/phải trên mobile, phím mũi tên/Esc trên máy tính, hiện chú thích, có số thứ tự `5 / 120`. Video mở trong lightbox, có nút tiếng, dừng khi đóng.

## 5. Menu

> **Menu dưới đây là bản tạm, tôi sẽ bổ sung món và giá sau.** Claude dựng sẵn cấu trúc `menu.json` và giao diện chạy được với số món hiện có. Thêm/bớt món, thêm nhóm mới chỉ cần sửa `menu.json`, không phải sửa code. Bố cục phải đẹp cả khi một nhóm chỉ có 2–3 món lẫn khi có 20 món trở lên.

Nhóm và món (giá VNĐ; mô tả ngắn Claude đề xuất, tôi duyệt lại):

**Cà phê**

| Món | Giá | Ghi chú |
|---|---|---|
| Cà phê đen | 15.000 | Bán chạy |
| Cà phê sữa | 17.000 | Bán chạy |
| Bạc xỉu | 17.000 | |
| Cà phê sữa tươi | 17.000 | |
| Cà phê muối | 20.000 | Nổi bật |
| Cacao | 20.000 | |

**Đồ uống khác**

| Món | Giá |
|---|---|
| Sữa chua đá | 15.000 |
| Nước cam | 15.000 |
| Nước suối Saka | 8.000 |
| Revive | 12.000 |
| Pepsi | 12.000 |
| 247 | 12.000 |
| Bò húc | 17.000 |

**Tùy chọn** (áp dụng cho nhóm Cà phê): ít đường / nhiều đường / không đường · ít đá / nhiều đá / đá riêng / nóng.

**Cấu trúc `menu.json` gợi ý:**

```json
{
  "currency": "VND",
  "updatedAt": "2026-11-07",
  "options": [
    { "id": "sugar", "label": "Đường", "values": ["Ít đường", "Bình thường", "Nhiều đường", "Không đường"] },
    { "id": "ice", "label": "Đá", "values": ["Ít đá", "Bình thường", "Nhiều đá", "Đá riêng", "Nóng"] }
  ],
  "categories": [
    {
      "id": "ca-phe",
      "name": "Cà phê",
      "optionIds": ["sugar", "ice"],
      "items": [
        {
          "id": "ca-phe-muoi",
          "name": "Cà phê muối",
          "price": 20000,
          "description": "Cà phê pha máy, lớp kem muối béo mặn nhẹ.",
          "image": "menu/ca-phe-muoi",
          "bestseller": false,
          "featured": true,
          "available": true
        }
      ]
    }
  ]
}
```

- Giá lưu dạng số, hiển thị `20.000đ`. Món `available: false` hiện mờ + nhãn "Tạm hết" thay vì xoá.
- Trang `/menu`: tab nhóm dính đầu trang khi cuộn; mỗi món có ảnh, tên, giá, mô tả ngắn, nhãn **"Bán chạy"**. Món chưa có ảnh → khung chờ ghi tên món.
- Trang `/menu-in`: dùng chung `menu.json`, khổ **A4 dọc**, `@media print` sạch (không nút, không video), logo + tên quán + SĐT + **mã QR** dẫn về website/Zalo, chữ đủ lớn đọc từ 1–2 mét. Có nút "In menu" chỉ hiện trên màn hình.

## 6. Ảnh & video (quán có rất nhiều — phần quan trọng nhất)

### 6.1 Nơi để file

```
media-src/            ← ẢNH/VIDEO GỐC tôi chép vào (KHÔNG commit, thêm vào .gitignore)
  hero/               ← video hero: 1 ngang (16:9) + 1 dọc (9:16), 10–20 giây
  menu/               ← ảnh từng món, đặt tên theo món: ca-phe-muoi.jpg, bac-xiu.jpg …
  gallery/
    pha-che/          ← quầy, máy pha, rót cà phê
    do-uong/          ← ly nước, tem ly
    khong-gian/       ← mặt tiền, dù xanh, bàn ghế
    khach-hang/       ← khách, không khí
  video/              ← video ngắn khác (phần lớn quay dọc bằng điện thoại)
public/media/         ← bản ĐÃ NÉN do script tạo ra, website chỉ dùng thư mục này
```

Tên thư mục con trong `gallery/` = nhóm lọc trên web. Tên file không dấu, không khoảng trắng (script tự chuẩn hoá nếu tôi đặt sai).

### 6.2 Script xử lý media — `pnpm media`

Viết script Node (`scripts/process-media.mjs`, dùng `sharp` cho ảnh và `ffmpeg` cho video) chạy lại được nhiều lần, chỉ xử lý file mới/thay đổi:

**Ảnh:**
- Tự xoay theo EXIF, xoá thông tin GPS/EXIF.
- Xuất **AVIF + WebP**, nhiều cỡ (vd. 480 / 960 / 1600 px chiều rộng) để dùng `srcset`.
- Tạo ảnh mờ siêu nhỏ (blur placeholder) để hiện trong lúc tải.
- Ghi kích thước thật (width/height) để tránh nhảy bố cục.

**Video:**
- Nén **MP4 H.264** (`-crf 26–28`, `-movflags +faststart`), tối đa 1080p; bản 720p cho mobile.
- Video hero: **bỏ âm thanh**, ≤ 3 MB (bản mobile ≤ 2 MB).
- Video gallery/reels: giữ tiếng, giới hạn ~30–60 giây.
- Tự cắt **ảnh poster** (WebP) từ giây thứ 1.
- Ghi thời lượng và hướng (ngang/dọc).

**Đầu ra:** cập nhật `src/data/media.json` (đường dẫn, nhóm, kích thước, hướng, poster, thời lượng, `alt`, `caption`, `featured`). Script **giữ nguyên** `alt`/`caption`/`featured` tôi đã sửa tay. In báo cáo: số file, dung lượng trước/sau, file lỗi.

Nếu máy chưa có `ffmpeg` → hướng dẫn tôi cài trên Windows (`winget install ffmpeg`).

### 6.3 Quy tắc hiển thị

- Mọi ảnh dùng `<picture>`/`srcset` + `loading="lazy"` + `decoding="async"`, có width/height. Chỉ ảnh/poster đầu trang được tải ưu tiên.
- Video ngoài hero **không tự tải**: chỉ hiện poster + nút play, bấm mới tải (`preload="none"`).
- Video hero không phát trên chế độ tiết kiệm dữ liệu (`Save-Data`) hoặc `prefers-reduced-motion` → chỉ hiện poster.
- Mỗi ảnh có `alt` tiếng Việt có nghĩa (vd. "Nhân viên rót cà phê muối tại quầy Anh Tú Coffee"); Claude soạn sẵn `alt` gợi ý từ tên thư mục/file, tôi sửa sau.
- Ảnh/video nào chưa có thì để **khung chờ** màu `surface-alt` ghi rõ nội dung cần chụp (vd. "ẢNH MẶT TIỀN QUÁN", "VIDEO DỌC RÓT CÀ PHÊ MUỐI"). **Tuyệt đối không dùng ảnh mạng hay ảnh AI.**
- Sau khi chạy script lần đầu, Claude **xem qua các ảnh** và đề xuất: ảnh nào hợp làm hero/giới thiệu/món nổi bật, ảnh nào mờ/trùng nên bỏ.

### 6.4 Ngân sách tốc độ (mobile 4G)

- Trang chủ lần tải đầu ≤ **1,5 MB** (không tính video hero), video hero ≤ 2–3 MB.
- LCP < 2,5 s, CLS < 0,1. **Lighthouse mobile ≥ 90** ở cả 4 mục (Performance, Accessibility, Best Practices, SEO).
- Kiểm tra thực tế trên khung 375 px và 390 px.

## 7. SEO & chia sẻ

- `title`, `description` tiếng Việt cho từng trang, ví dụ:
  - Trang chủ: "Anh Tú Coffee — Cà phê pha máy nguyên chất, mang đi | Bình Tân, TP.HCM".
- Open Graph + Twitter card: ảnh chia sẻ 1200×630 (nền xanh + logo trắng + ảnh ly cà phê) — hiển thị đẹp khi gửi qua **Facebook và Zalo**.
- Schema.org JSON-LD `CafeOrCoffeeShop`: tên, logo, ảnh, địa chỉ, toạ độ, `openingHoursSpecification`, SĐT, `menu` (link `/menu`), `servesCuisine`, `priceRange: "8.000đ–20.000đ"`, `sameAs` (Facebook…).
- `sitemap.xml`, `robots.txt`, favicon + apple-touch-icon + manifest tạo từ logo.
- `lang="vi"`. Chỉ tiếng Việt ở bản đầu; cấu trúc dữ liệu để sau này thêm tiếng Anh không phải viết lại.
- Gợi ý tôi các bước sau khi lên mạng: đăng ký Google Business Profile, Google Search Console.

## 8. Truy cập & chất lượng

- Tương phản chữ đạt WCAG AA (đặc biệt chữ trên video/ảnh).
- Dùng được bằng bàn phím; lightbox và ngăn kéo menu có quản lý focus, đóng bằng Esc.
- Vùng chạm tối thiểu 44×44 px.
- Không lỗi console, không ảnh vỡ, không cuộn ngang trên mobile.

## 9. Cách làm việc

1. **Trước khi code:** tóm tắt kế hoạch, cấu trúc thư mục, danh sách change OpenSpec và thứ tự làm cho tôi duyệt. Hỏi lại tôi những chỗ còn thiếu ở mục 12.
2. **Thứ tự đề xuất:**
   1. Nền tảng: Tailwind + token màu + font + layout (header/footer/nút nổi) + `site.json`.
   2. Script xử lý media + chạy trên media thật của tôi.
   3. Trang chủ (hero, giới thiệu, món nổi bật, reels, xem trước gallery, giờ + bản đồ, liên hệ).
   4. `/menu` + `menu.json`.
   5. `/hinh-anh` + lightbox.
   6. `/menu-in`.
   7. SEO, Open Graph, schema, sitemap, favicon.
   8. Đo Lighthouse, sửa tới khi đạt, rồi deploy.
3. **Làm từng phần**, chạy `pnpm dev`, chụp màn hình **mobile (390 px) và máy tính (1440 px)** cho tôi xem rồi mới qua phần tiếp theo.
4. Mỗi phần xong: chạy kiểm tra của harness, cập nhật `tasks.md` và `harness/PROGRESS.md`, commit theo quy ước repo.

## 10. Deploy (bước cuối)

- Hướng dẫn tôi từng bước deploy lên **Vercel** (khuyến nghị, miễn phí, hợp Next.js) qua GitHub; nêu phương án dự phòng Netlify / Cloudflare Pages.
- Video nặng: nếu tổng dung lượng media quá lớn cho repo/gói miễn phí, đề xuất cách lưu ngoài (vd. Cloudflare R2, Bunny CDN) hoặc chỉ đưa video hay nhất lên web, còn lại dẫn link TikTok/Facebook.
- Hướng dẫn mua và trỏ tên miền.

## 11. Định nghĩa "xong"

- [ ] 5 route chạy được, build tĩnh không lỗi, harness verify pass.
- [ ] Sửa giá trong `menu.json` → cả `/menu`, trang chủ, `/menu-in` đều đổi theo.
- [ ] Thêm ảnh mới vào `media-src/` → chạy `pnpm media` → ảnh xuất hiện trên web đúng nhóm.
- [ ] Nhãn Đang mở / Đang bán online / Đã đóng đúng theo giờ Việt Nam.
- [ ] Bấm "Gọi", "Zalo", "Chỉ đường" hoạt động trên điện thoại thật.
- [ ] Điền link ShopeeFood/GrabFood vào `site.json` → nút đặt online tự hiện; xoá link → nút tự ẩn, không lỗi giao diện.
- [ ] Thêm món/nhóm mới vào `menu.json` → hiện đúng, không vỡ bố cục.
- [ ] Lighthouse mobile ≥ 90 cả 4 mục; link chia sẻ Zalo/Facebook hiện ảnh và tiêu đề đúng.
- [ ] `/menu-in` in ra đúng 1 trang A4, rõ ràng.

---

## 12. THÔNG TIN QUÁN

- **Tên:** Anh Tú Coffee
- **Địa chỉ:** 83 Đường A8, Khu phố 5, Bình Tân, TP. Hồ Chí Minh
- **Google Maps:** https://maps.app.goo.gl/NZhs6usRNtHDTdib8 (Claude lấy toạ độ + link nhúng; nếu không lấy được thì hỏi tôi)
- **Giờ mở cửa** (đã xác nhận):
  - 05:30 – 11:00: bán tại quán (mang đi)
  - 11:00 – 20:00: bán online qua **ShopeeFood** và **GrabFood**
- **Điện thoại / Zalo:** 0932 311 434 (`tel:+84932311434`, `https://zalo.me/0932311434`)
- **Facebook:** https://www.facebook.com/anhtucoffee2025
- **TikTok / Instagram:** [chưa có — ẩn nút]
- **ShopeeFood / GrabFood:** đang tạo gian hàng, sẽ có link sau. Hiện để trống `shopeefood` và `grabfood` trong `site.json`; nút tự hiện khi tôi điền link (xem mục 4, khối 8).
- **Năm mở:** 2025
- **Giới thiệu** (Claude viết lại cho mượt, tôi duyệt): "Anh Tú Coffee là quán cà phê pha máy 100% nguyên chất tại Bình Tân. Mở cửa từ 5 giờ 30 sáng, phục vụ ly cà phê mang đi nhanh gọn cho người đi làm, và nhận đặt online đến tối." — [bổ sung loại hạt / nguồn hạt nếu có]
- **Slogan** — chưa có, Claude đề xuất 5 phương án ngắn để tôi chọn, ví dụ:
  - "Cà phê pha máy. Nguyên chất mỗi sáng."
  - "Ghé nhanh, mang đi, ngon trọn ngày."
- **Tên miền** — đề xuất (kiểm tra còn trống trước khi mua): `anhtucoffee.vn` (ưu tiên, uy tín tại VN) → `anhtucoffee.com` → `anhtu.coffee`. Trước khi có tên miền, dùng link miễn phí `anhtucoffee.vercel.app`.
- **Tiếng Anh:** Không (bản đầu chỉ tiếng Việt).

## 13. TÀI LIỆU CẦN CHÉP VÀO

- [x] `assets/logo/leaf-mark.svg`, `assets/logo/leaf-mark-white.svg` — đã có.
- [ ] `media-src/hero/` — 1 video ngang + 1 video dọc, 10–20 giây (pha chế, rót cà phê, dù xanh của quán).
- [ ] `media-src/menu/` — ảnh từng món, cùng nền, cùng góc, tên file theo món.
- [ ] `media-src/gallery/<nhóm>/` — ảnh quán, chia theo 4 nhóm ở mục 6.1 (không giới hạn số lượng, script tự nén).
- [ ] `media-src/video/` — các video ngắn khác.
- [ ] Ảnh tem ly (nếu có) để đồng bộ thiết kế.
