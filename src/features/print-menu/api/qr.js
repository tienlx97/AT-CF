import QRCode from 'qrcode';

import { BRAND_COLORS, TRANSPARENT } from '@/shared/config/brand.js';

/**
 * A QR code as an inline SVG string, made at build time (no client JS).
 * Error correction M survives a slightly scuffed printout.
 * @param {string} url
 */
export async function qrSvg(url) {
  return QRCode.toString(url, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: BRAND_COLORS.brandInk, light: TRANSPARENT },
  });
}
