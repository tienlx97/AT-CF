import { journalEntries } from '@/features/journal';
import { SITEMAP_ROUTES } from '@/shared/api/seo';
import { menu } from '@/shared/config/menu';
import { site } from '@/shared/config/site';

export const dynamic = 'force-static';

/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return [
    ...SITEMAP_ROUTES.map((route) => ({
      url: `${site.siteUrl}${route.path}`,
      lastModified: menu.updatedAt,
      changeFrequency: /** @type {'weekly' | 'monthly'} */ (
        route.changeFrequency
      ),
      priority: route.priority,
    })),
    ...journalEntries.map((entry) => ({
      url: `${site.siteUrl}/nhat-ky/${entry.id}/`,
      lastModified: entry.date,
      changeFrequency: /** @type {const} */ ('monthly'),
      priority: 0.6,
    })),
  ];
}
