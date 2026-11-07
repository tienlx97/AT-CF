import { MenuPage } from '@/features/menu';
import { pageMetadata } from '@/shared/config/page-meta';

export const metadata = pageMetadata({
  path: '/menu/',
  title: 'Menu — Anh Tú Coffee | Cà phê pha máy từ 15.000đ, mang đi Bình Tân',
  description:
    'Menu và giá Anh Tú Coffee: cà phê đen, cà phê sữa, bạc xỉu, cà phê muối, cacao, sữa chua đá, nước cam. Pha máy nguyên chất, mang đi tại Bình Tân.',
});

export default function Page() {
  return <MenuPage />;
}
