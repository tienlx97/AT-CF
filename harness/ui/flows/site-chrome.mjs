import { pageBasics } from './common.mjs';

export default async function siteChrome(page, { width, check }) {
  await page.goto('/');
  await page.shot('home-top');
  await pageBasics(page, check, 'home');

  const overHero = await page.eval('document.querySelector("header").dataset.overHero');
  check('navbar identifies the hero route at top', overHero === 'true');
  const compact = await page.eval(`(() => {const r=document.querySelector('header[data-over-hero]').getBoundingClientRect();return {top:r.top,height:r.height};})()`);
  check('navbar stays compact and flush with the top', compact.top === 0 && compact.height <= 74, JSON.stringify(compact));
  const brandHeader = await page.eval(`(() => {const h=document.querySelector('header[data-over-hero]');return {background:getComputedStyle(h).backgroundColor,color:getComputedStyle(h).color,logo:h.querySelector('img').getAttribute('src')};})()`);
  check('navbar uses brand green and the original white logo', brandHeader.background==='rgb(31, 61, 49)' && brandHeader.color==='rgb(255, 255, 255)' && brandHeader.logo==='/brand/leaf-mark-white.svg', JSON.stringify(brandHeader));
  const geometry = () => page.eval(`(() => {
    const header = document.querySelector('header[data-over-hero]');
    return [header, ...header.querySelectorAll('[data-nav-surface], a, button')]
      .map(el => el.getBoundingClientRect()).filter(r => r.width && r.height)
      .flatMap(r => [r.x, r.y, r.width, r.height]);
  })()`);
  const initialGeometry = await geometry();
  for (const y of [12, 23, 24, 25, 80, 600, 0]) {
    await page.scrollTo(y);
    const currentGeometry = await geometry();
    const delta = Math.max(...initialGeometry.map((value, i) => Math.abs(value - currentGeometry[i])));
    check(`navbar/logo/links keep their geometry at scroll ${y}`, currentGeometry.length === initialGeometry.length && delta <= .5, `max shift ${delta}px`);
  }
  const headerSurface = async (label) => {
    const surface = await page.eval(`(() => {
      const style = getComputedStyle(document.querySelector('[data-nav-surface]'));
      const channels = value => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d');
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
        return [r, g, b, alpha / 255];
      };
      const bg = channels(style.backgroundColor), fg = channels(style.color);
      const alpha = bg[3] ?? 1;
      const luminance = rgb => rgb.slice(0, 3).map(v => v / 255)
        .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
        .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
      const background = luminance(bg.slice(0, 3).map(v => v * alpha + 255 * (1 - alpha)));
      const foreground = luminance(fg);
      return {alpha, contrast: (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05)};
    })()`);
    check(`${label}: navbar surface shields text from photos`, surface.alpha >= .9, String(surface.alpha));
    check(`${label}: navbar text contrast >= 4.5 even over white`, surface.contrast >= 4.5, surface.contrast.toFixed(2));
  };
  await headerSurface('first hero slide');
  const slides = await page.eval('document.querySelectorAll(".hero-slide").length');
  const canPause = await page.eval('Boolean(document.querySelector("button[aria-label=\'Tạm dừng trình chiếu\']"))');
  if (canPause) await page.click('button[aria-label="Tạm dừng trình chiếu"]');
  for (let i = 1; i < slides; i++) {
    await page.click(`button[aria-label="Ảnh ${i + 1}"]`);
    await page.scrollTo(0);
    await headerSurface(`hero slide ${i + 1}`);
    await page.shot(`header-slide-${i + 1}`);
  }
  await page.scrollTo(600);
  const solid = await page.eval('document.querySelector("header").dataset.overHero');
  check('header tracks scroll without changing its compact surface', solid === 'false');
  await headerSurface('scrolled header');
  await page.shot('home-scrolled');
  await page.scrollTo(0);

  const cta = await page.eval('document.querySelector("header a[href*=\'shopeefood.vn\']")?.getAttribute("href")');
  check('header purchase action uses ShopeeFood', /^https:\/\/shopeefood\.vn\//.test(cta ?? ''), cta);
  check('floating contact bar has been removed', await page.eval('!document.querySelector(".contact-bar")'));

  if (width < 1280) {
    await page.click('button[aria-controls="mobile-menu"]');
    const open = await page.eval('Boolean(document.querySelector("#mobile-menu"))');
    check('drawer opens', open);
    const focusInside = await page.eval('document.querySelector("#mobile-menu")?.contains(document.activeElement)');
    check('focus moves into drawer', focusInside);
    for (let i = 0; i < 12; i++) await page.press('Tab');
    const trapped = await page.eval('document.querySelector("#mobile-menu")?.contains(document.activeElement)');
    check('focus trapped in drawer', trapped);
    check('drawer sends purchases only to ShopeeFood', await page.eval('Boolean(document.querySelector("#mobile-menu a[href*=\'shopeefood.vn\']")) && !document.querySelector("#mobile-menu a[href^=\'tel:\'], #mobile-menu a[href*=\'zalo.me\']")'));
    await page.shot('drawer');
    await page.press('Escape');
    const closed = await page.eval('!document.querySelector("#mobile-menu")');
    check('Esc closes drawer', closed);
    const returned = await page.eval('document.activeElement?.getAttribute("aria-controls")');
    check('focus returns to menu button', returned === 'mobile-menu', returned);
  } else {
    const links = await page.eval('[...document.querySelectorAll("header nav a")].map((a) => a.textContent.trim())');
    check('desktop nav has 5 links', links.length === 5, links.join(', '));
  }

  const footer = await page.eval('document.querySelector("footer").textContent');
  check('footer keeps copyright/address and omits purchase contacts', footer.includes('© 2026 Anh Tú Coffee') && footer.includes('Đường A8') && !/0932|Zalo|Gọi/.test(footer));
  const footerHeight = await page.eval('document.querySelector("footer").getBoundingClientRect().height');
  check('footer is compact', footerHeight <= (width < 768 ? 340 : 230), `${footerHeight}px`);
  await page.shot('full', { full: true });
}
