import { site } from '@/shared/config/site';

export const dynamic = 'force-static';

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/menu-in/'] }],
    sitemap: `${site.siteUrl}/sitemap.xml`,
    host: site.siteUrl,
  };
}
