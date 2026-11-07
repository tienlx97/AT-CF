import { Visit } from '@/features/home';
import { pageMetadata } from '@/shared/config/page-meta';

export const metadata = pageMetadata({
  path: '/lien-he/',
  title: 'Địa chỉ — Anh Tú Coffee | Giờ mở cửa và bản đồ',
  description:
    'Anh Tú Coffee trên Đường A8, Bình Tân. Bán tại quầy 5:30 – 11:00, đặt qua ShopeeFood 11:00 – 20:00. Xem địa chỉ và bản đồ đến quán.',
});

export default function ContactPage() {
  return (
    <>
      <Visit headingLevel="h1" />
    </>
  );
}
