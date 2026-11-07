import { pageBasics } from './common.mjs';

export default async function homeGallery(page, { check }) {
  await page.goto('/');
  await pageBasics(page, check, 'home');
  // The intro's lead photo sits right under the hero, inside Chrome's lazy-load margin;
  // the preview grid is screens further down and must not load yet.
  const previewSrcs = await page.eval('[...document.querySelectorAll("section[aria-labelledby=hinh-anh-quan] img")].map((img) => new URL(img.currentSrc || img.src, location.href).pathname)');
  const early = page.requests.filter((u) => previewSrcs.includes(u));
  check('preview photos are not loaded on first paint', early.length === 0, early.slice(0, 3).join(', '));
  await page.eval('document.querySelector("#hinh-anh-quan").scrollIntoView({ behavior: "instant" })');
  await page.wait(900);
  await page.shot('gallery-preview');
  const tiles = await page.eval('document.querySelectorAll("section[aria-labelledby=hinh-anh-quan] ul li").length');
  check('8–12 tiles', tiles >= 8 && tiles <= 12, `${tiles}`);
  const lazy = await page.eval('[...document.querySelectorAll("section[aria-labelledby=hinh-anh-quan] img")].every((img) => img.loading === "lazy" && img.width > 0 && img.height > 0)');
  check('every preview image is lazy with width/height', lazy);
  const link = await page.eval('[...document.querySelectorAll("section[aria-labelledby=hinh-anh-quan] a")].map((a) => a.getAttribute("href"))');
  check('links to /hinh-anh/', link.includes('/hinh-anh/'), link.join(', '));
  const hasButtons = await page.eval('Boolean(document.querySelector("section[aria-labelledby=hinh-anh-quan] ul li button"))');
  if (hasButtons) {
    await page.click('section[aria-labelledby=hinh-anh-quan] ul li:nth-child(3) button');
    const counter = await page.eval('document.querySelector("[data-lightbox-counter]")?.textContent');
    check('tile opens the lightbox at its position', counter === `3 / ${tiles}`, counter);
    await page.shot('gallery-lightbox');
    await page.press('ArrowLeft');
    const back = await page.eval('document.querySelector("[data-lightbox-counter]")?.textContent');
    check('← key shows the previous photo', back === `2 / ${tiles}`, back);
    await page.press('Escape');
  }
}
