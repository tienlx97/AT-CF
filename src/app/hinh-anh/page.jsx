import { GalleryPage } from '@/features/gallery';
import { pageMetadata } from '@/shared/config/page-meta';

export const metadata = pageMetadata({
  path: '/hinh-anh/',
  title: 'Hình ảnh — Anh Tú Coffee | Quầy pha máy, ly mang đi, video',
  description:
    'Ảnh và video ở Anh Tú Coffee, Bình Tân: quầy pha máy, ly cà phê muối, bạc xỉu, mặt tiền với dù xanh và buổi sáng ở quán.',
});

export default function Page() {
  return <GalleryPage />;
}
