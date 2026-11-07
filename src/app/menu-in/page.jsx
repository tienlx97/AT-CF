import { PrintMenu } from '@/features/print-menu';
import { pageMetadata } from '@/shared/config/page-meta';

export const metadata = pageMetadata({
  path: '/menu-in/',
  title: 'Menu in A4 — Anh Tú Coffee',
  description:
    'Thực đơn Anh Tú Coffee khổ A4 để in tại quán, cùng giá với thực đơn trên web, có mã QR xem món và đặt qua ShopeeFood.',
  index: false,
});

export default function Page() {
  return <PrintMenu />;
}
