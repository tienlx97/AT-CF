import { formatPrice } from './format.js';

/**
 * schema.org CafeOrCoffeeShop for the home page (Google, Zalo/Facebook previews).
 * @param {import('../types/site.js').Site} site
 * @param {{ min: number, max: number }} prices
 */
export function cafeJsonLd(site, prices) {
  const sameAs = Object.values(site.social).filter((url) =>
    /^https?:\/\//.test(url),
  );
  const hours = [site.hours.store, site.hours.online];
  return {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${site.siteUrl}/#cafe`,
    name: site.name,
    url: `${site.siteUrl}/`,
    logo: `${site.siteUrl}/brand/leaf-mark.svg`,
    image: [`${site.siteUrl}/og.png`],
    description: site.intro,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.district,
      addressRegion: site.address.city,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    hasMap: site.mapUrl,
    openingHoursSpecification: hours.map((window) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: window.open,
      closes: window.close,
    })),
    menu: `${site.siteUrl}/menu/`,
    servesCuisine: ['Cà phê', 'Đồ uống'],
    priceRange: `${formatPrice(prices.min)}–${formatPrice(prices.max)}`,
    currenciesAccepted: 'VND',
    foundingDate: String(site.foundedYear),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** Public routes for the sitemap, most important first. */
export const SITEMAP_ROUTES = Object.freeze([
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/menu/', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/hinh-anh/', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/nhat-ky/', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/lien-he/', priority: 0.8, changeFrequency: 'monthly' },
]);
