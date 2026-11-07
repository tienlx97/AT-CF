'use client';

import { usePathname } from 'next/navigation';

import { isBareRoute } from '../config/chrome';

/**
 * Renders the site chrome except on bare routes (the printable menu).
 * Static export cannot use route groups (Next 16 writes their prefetch
 * files under a name the client never requests), so the gate lives here.
 * @param {{ children: import('react').ReactNode }} props
 */
export function ChromeGate({ children }) {
  return isBareRoute(usePathname() ?? '/') ? null : children;
}
