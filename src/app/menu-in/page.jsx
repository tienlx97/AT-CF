import { PrintMenu } from '@/features/print-menu';
import { pageMetadata } from '@/shared/config/page-meta';

export const metadata = pageMetadata({
  path: '/menu-in/',
  title: 'Menu in A4 — Anh Tú Coffee',
  description:
    'Bản menu Anh Tú Coffee khổ A4 để in và treo tại quán, cùng giá với menu trên web, có mã QR xem menu và nhắn Zalo.',
  index: false,
});

export default function Page() {
  return <PrintMenu />;
}
