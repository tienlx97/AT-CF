import { ContactOrder, Visit } from '@/features/home';

export const metadata = {
  title: 'Liên hệ — Anh Tú Coffee | Giờ mở cửa, địa chỉ, bản đồ',
  description:
    'Anh Tú Coffee, 83 Đường A8, Khu phố 5, Bình Tân, TP.HCM. Bán tại quán 5:30 – 11:00, đặt online 11:00 – 20:00. Gọi 0932 311 434 hoặc nhắn Zalo.',
};

export default function ContactPage() {
  return (
    <>
      <Visit headingLevel="h1" />
      <ContactOrder />
    </>
  );
}
