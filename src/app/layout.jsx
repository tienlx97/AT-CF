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

const HOME_TITLE = `${site.name} — Cà phê pha máy nguyên chất, mang đi | Bình Tân, TP.HCM`;
const DESCRIPTION =
  'Cà phê pha máy 100% nguyên chất, mang đi tại 83 Đường A8, Bình Tân. Mở cửa 5:30 – 11:00, đặt online 11:00 – 20:00. Cà phê sữa, bạc xỉu, cà phê muối từ 15.000đ.';

/** @type {import('next').Metadata} */
export const metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: HOME_TITLE, template: '%s' },
  description: DESCRIPTION,
  applicationName: site.name,
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: site.name,
    title: HOME_TITLE,
    description: DESCRIPTION,
    url: '/',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `${site.name} — cà phê pha máy mang đi ở Bình Tân`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport = {
  themeColor: BRAND_COLORS.brand,
  width: 'device-width',
  initialScale: 1,
};

/** @param {{ children: import('react').ReactNode }} props */
export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={montserrat.variable}>
      <body className="font-sans antialiased">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
