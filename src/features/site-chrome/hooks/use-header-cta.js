'use client';

import { telHref } from '@/shared/api/format.js';
import { headerCta } from '@/shared/api/order-links.js';
import { site } from '@/shared/config/site.js';
import { useOpenStatus } from '@/shared/hooks/use-open-status.js';

import { ORDER_ANCHOR } from '../config/chrome.js';

/** The header's one action: call to order, or order online in online hours. */
export function useHeaderCta() {
  const status = useOpenStatus();
  return headerCta(site.order, status?.state ?? null) === 'order-online'
    ? { label: 'Đặt online', href: ORDER_ANCHOR, kind: 'order' }
    : { label: 'Gọi đặt món', href: telHref(site.phone), kind: 'call' };
}
