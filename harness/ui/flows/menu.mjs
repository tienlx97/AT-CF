import { pageBasics } from './common.mjs';

export default async function menuFlow(page, { width, check }) {
  await page.goto('/menu/');
  await page.shot('menu-top');
  await pageBasics(page, check, 'menu');
  const text = await page.eval('document.body.innerText');
  check('prices formatted as 20.000đ', text.includes('20.000đ') && text.includes('8.000đ'));
  check('bestseller label shown', text.includes('BÁN CHẠY') || text.includes('Bán chạy'));
  const groups = await page.eval('[...document.querySelectorAll("main section h2")].map((h) => h.textContent)');
  check('all categories render', groups.length >= 2, groups.join(', '));
  const tabs = await page.eval('[...document.querySelectorAll("nav[aria-label=\'Nhóm món\'] a")].length');
  check('category tabs present', tabs === groups.length, `${tabs} tabs`);
  const browsing = await page.eval(`({
    links: [...document.querySelectorAll('nav[aria-label="Nhóm món"] a')].map(a => ({
      target: Boolean(document.querySelector(a.getAttribute('href'))),
      visible: a.getBoundingClientRect().left >= 0 && a.getBoundingClientRect().right <= innerWidth
    })),
    descriptions: [...document.querySelectorAll('.menu-category-head p')].every(p => p.textContent.trim().length > 0),
    columns: getComputedStyle(document.querySelector('main section .grid')).gridTemplateColumns.split(' ').length
  })`);
  check('all category links are visible without sideways scrolling and resolve', browsing.links.every(a => a.target && a.visible));
  check('category descriptions remain readable from source data', browsing.descriptions);
  check('menu grid adapts to phone tablet desktop', browsing.columns === (width >= 1024 ? 4 : width >= 768 ? 3 : 2), `${browsing.columns} columns`);
  await page.scrollTo(1400);
  const stuck = await page.eval('Math.round(document.querySelector("nav[aria-label=\'Nhóm món\']").getBoundingClientRect().top)');
  check('tabs stick under the header', stuck > 40 && stuck < 90, `top ${stuck}`);
  const activeLabel = await page.eval('document.querySelector("nav[aria-label=\'Nhóm món\'] a[aria-current]")?.textContent');
  check('a tab is marked current while scrolling', Boolean(activeLabel), activeLabel);
  await page.shot('menu-scrolled');
  await page.shot('menu-full', { full: true });
}