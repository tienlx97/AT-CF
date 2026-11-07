/**
 * ShopeeFood is the site's only purchase channel. Empty or invalid links hide
 * the action; there is no direct-contact fallback.
 * @param {import('@/shared/types/site').OrderLinks} order
 */
export function orderPlatforms(order) {
  return [
    {
      id: 'shopeefood',
      label: 'ShopeeFood',
      href: order.shopeefood?.trim() ?? '',
    },
  ].filter((platform) => /^https?:\/\//.test(platform.href));
}

/**
 * The external purchase action, independent of the site's local opening clock.
 * @param {import('@/shared/types/site').OrderLinks} order
 */
export function headerCta(order) {
  const platform = orderPlatforms(order)[0];
  return platform
    ? { label: 'Đặt qua ShopeeFood', href: platform.href, kind: 'order' }
    : null;
}
