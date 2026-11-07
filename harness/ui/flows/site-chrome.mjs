import { pageBasics } from './common.mjs';

export default async function siteChrome(page, { width, check }) {
  await page.goto('/');
  await page.shot('home-top');
  await pageBasics(page, check, 'home');

  const overHero = await page.eval('document.querySelector("header").dataset.overHero');
  check('header transparent over hero at top', overHero === 'true');
  await page.scrollTo(600);
  const solid = await page.eval('document.querySelector("header").dataset.overHero');
  check('header solid after scrolling', solid === 'false');
  await page.shot('home-scrolled');
  await page.scrollTo(0);

  const cta = await page.eval('[...document.querySelectorAll("header a")].map((a) => a.textContent.trim()).find((t) => /Gọi đặt món|Đặt online/.test(t))');
  check('header CTA present', Boolean(cta), cta);

  if (width < 768) {
    const bar = await page.eval('getComputedStyle(document.querySelector(".contact-bar")).display');
    check('contact bar visible on mobile', bar !== 'none');
    const tel = await page.eval('document.querySelector(".contact-bar a").getAttribute("href")');
    check('contact bar Gọi uses tel:+84', tel === 'tel:+84932311434', tel);

    await page.click('button[aria-controls="mobile-menu"]');
    const open = await page.eval('Boolean(document.querySelector("#mobile-menu"))');
    check('drawer opens', open);
    const focusInside = await page.eval('document.querySelector("#mobile-menu")?.contains(document.activeElement)');
    check('focus moves into drawer', focusInside);
    for (let i = 0; i < 12; i++) await page.press('Tab');
    const trapped = await page.eval('document.querySelector("#mobile-menu")?.contains(document.activeElement)');
    check('focus trapped in drawer', trapped);
    const barHidden = await page.eval('getComputedStyle(document.querySelector(".contact-bar")).display');
    check('contact bar hidden while drawer open', barHidden === 'none');
    await page.shot('drawer');
    await page.press('Escape');
    const closed = await page.eval('!document.querySelector("#mobile-menu")');
    check('Esc closes drawer', closed);
    const returned = await page.eval('document.activeElement?.getAttribute("aria-controls")');
    check('focus returns to menu button', returned === 'mobile-menu', returned);
  } else {
    const bar = await page.eval('getComputedStyle(document.querySelector(".contact-bar")).display');
    check('contact bar hidden on desktop', bar === 'none');
    const links = await page.eval('[...document.querySelectorAll("header nav a")].map((a) => a.textContent.trim())');
    check('desktop nav has 4 links', links.length === 4, links.join(', '));
  }

  const footer = await page.eval('document.querySelector("footer").textContent');
  check('footer has © 2026 and phone', footer.includes('© 2026 Anh Tú Coffee') && footer.includes('0932 311 434'));
  await page.shot('full', { full: true });
}