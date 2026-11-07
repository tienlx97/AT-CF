'use client';

import { headerCta } from '@/shared/api/order-links.js';
import { site } from '@/shared/config/site.js';

/** The header sends purchases to ShopeeFood, never to phone or messaging. */
export function useHeaderCta() {
  return headerCta(site.order);
}
