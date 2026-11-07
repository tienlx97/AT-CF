import { readFileSync } from 'node:fs';

import { pageBasics } from './common.mjs';

const menu = JSON.parse(readFileSync('src/data/menu.json', 'utf8'));
const names = menu.categories.flatMap((c) => c.items.map((i) => i.name));

export default async function printMenu(page, { check }) {
  await page.goto('/menu-in/');
  await page.wait(500);
  await pageBasics(page, check, 'menu-in');
  await page.shot('screen', { full: true });
  const chrome = await page.eval('Boolean(document.querySelector("header.fixed, footer.bg-brand, .contact-bar, .shopee-float"))');
  check('no site header/footer/contact bar', !chrome);
  const text = await page.eval('document.querySelector(".a4-sheet").innerText');
  check('every menu item is on the sheet', names.every((n) => text.includes(n)), names.filter((n) => !text.includes(n)).join(', '));
  check('ShopeeFood replaces phone/Zalo on the sheet', text.includes('ShopeeFood') && !/0932|Zalo/.test(text));
  const qrs = await page.eval('document.querySelectorAll(".a4-sheet figure svg").length');
  check('two QR codes', qrs === 2, `${qrs}`);
  const minPx = await page.eval(`Math.min(...[...document.querySelectorAll('.a4-sheet li')].map((li) => parseFloat(getComputedStyle(li).fontSize)))`);
  // 5mm ≈ 19px at 96dpi, readable from about 1.5 m (zoomed preview on phones scales it down).
  check('menu rows set at ≥ 5mm type', minPx * (await page.eval('Number(getComputedStyle(document.querySelector(".a4-sheet")).zoom) || 1')) >= 0 && minPx >= 19, `${minPx}px`);
  const button = await page.eval('[...document.querySelectorAll("button")].some((b) => b.textContent.includes("In menu"))');
  check('"In menu" button on screen', button);
  await page.emulate({});
}
