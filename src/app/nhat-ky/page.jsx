import { JournalPage } from '@/features/journal';
import { pageMetadata } from '@/shared/config/page-meta';

export const metadata = pageMetadata({
  path: '/nhat-ky/',
  title: 'Nhật ký — Anh Tú Coffee',
  description:
    'Những câu chuyện quanh quầy cà phê Anh Tú: ngày đầu mở bán, góc pha chế và những vị khách quen.',
});

export default function Page() {
  return <JournalPage />;
}
