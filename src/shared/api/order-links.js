/**
 * Online-order buttons present in site.json, in display order. Empty links are
 * hidden so the owner only edits JSON to show or hide a platform.
 * @param {import('@/shared/types/site').OrderLinks} order
 */
export function orderPlatforms(order) {
  return [
    { id: 'shopeefood', label: 'ShopeeFood', href: order.shopeefood?.trim() ?? '' },
    { id: 'grabfood', label: 'GrabFood', href: order.grabfood?.trim() ?? '' },
  ].filter((platform) => /^https?:\/\//.test(platform.href));
}

/**
 * Header CTA: "Đặt online" only while selling online and both platforms exist.
 * @param {import('@/shared/types/site').OrderLinks} order
 * @param {import('@/shared/types/site').OpenState | null} state
 */
export function headerCta(order, state) {
  return state === 'online' && orderPlatforms(order).length === 2 ? 'order-online' : 'call';
}