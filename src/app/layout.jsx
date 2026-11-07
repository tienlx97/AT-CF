import './globals.css';

import { SiteFrame } from '@/features/site-chrome';
import { BRAND_COLORS } from '@/shared/config/brand';
import { site } from '@/shared/config/site';

// Montserrat variable font, self-hosted in two files (latin + vietnamese ranges,
// @font-face in globals.css) and both preloaded. next/font/google also pulled a
// 68 KB latin-ext file, not preloaded, for Vietnamese letters, which delayed the
// LCP heading to 5.9 s on Lighthouse's slow 4G (launch-performance 1.1).
const FONT_FILES = [
  '/fonts/montserrat-latin-wght-normal.woff2',
  '/fonts/montserrat-vietnamese-wght-normal.woff2',
];

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
    <html lang="vi">
      <head>
        {FONT_FILES.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body className="font-sans antialiased">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
