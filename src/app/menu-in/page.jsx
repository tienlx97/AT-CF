import { PrintMenu } from '@/features/print-menu';

export const metadata = {
  title: 'Menu in A4 — Anh Tú Coffee',
  description: 'Bản menu Anh Tú Coffee khổ A4 để in và treo tại quán.',
  robots: { index: false },
};

export default function Page() {
  return <PrintMenu />;
}
