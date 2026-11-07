import { readFileSync } from 'node:fs';

import { pageBasics } from './common.mjs';

const menu = JSON.parse(readFileSync('src/data/menu.json', 'utf8'));
const featured = [...menu.categories.find(c => c.id === 'ca-phe').items]
  .sort((a,b) => Number(b.available) - Number(a.available) || Number(b.featured) - Number(a.featured)).slice(0,4);
const price = (/** @type {number} */ v) => `${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`;

export default async function homeFeatured(page, { check }) {
  await page.goto('/');
  await pageBasics(page, check, 'home');
  await page.eval('document.querySelector("#gioi-thieu").scrollIntoView()');
  await page.wait(300);
  await page.shot('intro');
  const intro = await page.eval('document.querySelector("#gioi-thieu").closest("section").innerText');
  check('intro states pure coffee and quick service plainly', intro.includes('100% nguyên chất, ngon và sạch') && intro.includes('Phục vụ nhanh chóng'), intro.slice(0, 160));
  const facts = await page.eval('[...document.querySelectorAll("section[aria-labelledby=gioi-thieu] dl > div")].map(el => ({label: el.querySelector("dt").innerText, value: el.querySelector("dd").innerText}))');
  const coffee = menu.categories.find(category => category.id === 'ca-phe');
  check('three useful facts replace oversized anniversary statistics', facts.length === 3 && !intro.includes('Năm mở quán'), JSON.stringify(facts));
  check('counter hours include opening and closing times', facts.some(f => f.label === 'Bán tại quầy' && f.value === '5:30 – 11:00'));
  check('coffee starting price comes from the coffee category', facts.some(f => f.label === 'Cà phê từ' && f.value === price(Math.min(...coffee.items.map(item => item.price)))));
  await page.eval('document.querySelector("#mon-noi-bat").scrollIntoView()');
  await page.wait(300);
  await page.shot('featured');
  const cards = await page.eval('[...document.querySelectorAll("section[aria-labelledby=mon-noi-bat] ul li")].map((li) => li.innerText.replace(/\\s+/g, " "))');
  check('four coffee cups lead the menu preview', cards.length === 4, `${cards.length}`);
  check('home section is titled Thực đơn', (await page.eval('document.querySelector("#mon-noi-bat").textContent.trim()')) === 'Thực đơn');
  const pictures = await page.eval('[...document.querySelectorAll("section[aria-labelledby=mon-noi-bat] picture")].map(p => ({fit:getComputedStyle(p.querySelector("img")).objectFit,background:p.style.backgroundImage}))');
  check('cup frames preserve whole images and transparent backgrounds', pictures.length > 0 && pictures.every(p => p.fit === 'contain' && !p.background), JSON.stringify(pictures));
  const categoryLinks = await page.eval('[...document.querySelectorAll("nav[aria-label=\'Nhóm thực đơn\'] a")].map(a=>a.getAttribute("href"))');
  check('category links use real menu section anchors', menu.categories.every(c => categoryLinks.includes(`/menu/#nhom-${c.id}`)), categoryLinks.join(', '));
  for (const item of featured.slice(0, 4)) {
    check(`featured "${item.name}" shows ${price(item.price)} from menu.json`, cards.some((c) => c.includes(item.name) && c.includes(price(item.price))));
  }
  await page.click('nav[aria-label="Nhóm thực đơn"] a');
  await page.wait(800);
  const destination = await page.eval('location.pathname + location.hash');
  check('home menu category navigation works', destination === '/menu/#nhom-ca-phe', destination);
  check('category link resolves to an existing section', await page.eval('Boolean(document.getElementById(location.hash.slice(1)))'));
}
