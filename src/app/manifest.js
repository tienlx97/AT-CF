import { BRAND_COLORS } from '@/shared/config/brand';
import { site } from '@/shared/config/site';

export const dynamic = 'force-static';

/** @returns {import('next').MetadataRoute.Manifest} */
export default function manifest() {
  return {
    name: site.name,
    short_name: site.brandMain,
    description: 'Cà phê pha máy nguyên chất, mang đi ở Bình Tân.',
    lang: 'vi',
    start_url: '/',
    display: 'standalone',
    background_color: BRAND_COLORS.surface,
    theme_color: BRAND_COLORS.brand,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
