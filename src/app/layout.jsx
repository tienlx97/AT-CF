import './globals.css';

import { Montserrat } from 'next/font/google';

import { SiteFrame } from '@/features/site-chrome';
import { BRAND_COLORS } from '@/shared/config/brand';
import { site } from '@/shared/config/site';

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: `${site.name} — Cà phê pha máy nguyên chất, mang đi | Bình Tân, TP.HCM`,
  description: site.intro,
};

export const viewport = {
  themeColor: BRAND_COLORS.brand,
};

/** @param {{ children: import('react').ReactNode }} props */
export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={montserrat.variable}>
      <body className="font-sans antialiased">
        `n <SiteFrame>{children}</SiteFrame>`n{' '}
      </body>
    </html>
  );
}
