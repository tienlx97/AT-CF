'use client';

import { useEffect, useState } from 'react';

import { getOpenStatus } from '@/shared/api/open-status';
import { site } from '@/shared/config/site';

/**
 * Live status, computed only in the browser (a static page has no request
 * time). Returns null on the server and on the first client render.
 * @returns {import('@/shared/types/site').OpenStatus | null}
 */
export function useOpenStatus() {
  const [status, setStatus] = useState(/** @type {import('@/shared/types/site').OpenStatus | null} */ (null));
  useEffect(() => {
    const update = () => setStatus(getOpenStatus(new Date(), site.hours));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return status;
}