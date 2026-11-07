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
  await page.scrollTo(1400);
  const stuck = await page.eval('Math.round(document.querySelector("nav[aria-label=\'Nhóm món\']").getBoundingClientRect().top)');
  check('tabs stick under the header', stuck > 40 && stuck < 90, `top ${stuck}`);
  const activeLabel = await page.eval('document.querySelector("nav[aria-label=\'Nhóm món\'] a[aria-current]")?.textContent');
  check('a tab is marked current while scrolling', Boolean(activeLabel), activeLabel);
  await page.shot('menu-scrolled');
  await page.shot('menu-full', { full: true });
}