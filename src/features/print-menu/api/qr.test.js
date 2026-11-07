import assert from 'node:assert/strict';
import { test } from 'node:test';

import { qrSvg } from './qr.js';

test('QR is an SVG in the brand ink with a transparent ground', async () => {
  const svg = await qrSvg('https://shopeefood.vn/');
  assert.match(svg, /^<svg/);
  assert.match(svg, /#1F3D31|#1f3d31/);
  assert.doesNotMatch(svg, /fill="#ffffff"/i);
});
