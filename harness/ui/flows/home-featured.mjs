import { readFileSync } from 'node:fs';

import { pageBasics } from './common.mjs';

const menu = JSON.parse(readFileSync('src/data/menu.json', 'utf8'));
const featured = menu.categories.flatMap((c) => c.items).filter((i) => i.featured);
const price = (/** @type {number} */ v) => `${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`;

export default async function homeFeatured(page, { check }) {
  await page.goto('/');
  await pageBasics(page, check, 'home');
  await page.eval('document.querySelector("#gioi-thieu").scrollIntoView()');
  await page.wait(300);
  await page.shot('intro');
  const intro = await page.eval('document.querySelector("#gioi-thieu").closest("section").innerText');
  check('intro tells the shop story', intro.includes('100%') && intro.includes('5 giờ 30'), intro.slice(0, 80));
  await page.eval('document.querySelector("#mon-noi-bat").scrollIntoView()');
  await page.wait(300);
  await page.shot('featured');
  const cards = await page.eval('[...document.querySelectorAll("section[aria-labelledby=mon-noi-bat] ul li")].map((li) => li.innerText.replace(/\\s+/g, " "))');
  check('3–4 featured drinks shown', cards.length >= 3 && cards.length <= 4, `${cards.length}`);
  for (const item of featured.slice(0, 4)) {
    check(`featured "${item.name}" shows ${price(item.price)} from menu.json`, cards.some((c) => c.includes(item.name) && c.includes(price(item.price))));
  }
}
