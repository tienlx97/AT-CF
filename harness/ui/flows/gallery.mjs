import { pageBasics } from './common.mjs';

// Run after processing fixture media with --photos 60 --clips 3 (harness/ui/make-fixture-media.mjs).
export default async function gallery(page, { width, check }) {
  await page.goto('/hinh-anh/');
  await pageBasics(page, check, 'gallery');
  await page.shot('gallery-top');
  const labels = await page.eval('[...document.querySelectorAll("nav[aria-label=\'Lọc theo nhóm\'] button")].map((b) => b.firstChild.textContent)');
  check('six filters', labels.join('|') === 'Tất cả|Pha chế|Đồ uống|Không gian quán|Khách hàng|Video', labels.join('|'));
  const tiles = await page.eval('document.querySelectorAll("section[aria-label=\'Ảnh và video\'] li").length');
  const total = await page.eval('Number(document.querySelector("nav[aria-label=\'Lọc theo nhóm\'] button span").textContent)');
  check('24 items first', tiles === Math.min(24, total), `${tiles} of ${total}`);
  const loaded = await page.eval('performance.getEntriesByType("resource").filter((e) => /\\/media\\/gallery\\/.+\\.(avif|webp)$/.test(e.name)).length');
  check('not every photo downloads at once', loaded <= 24, `${loaded} image files`);

  if (total > 24) {
    await page.click('section[aria-label="Ảnh và video"] button.min-h-12');
    const more = await page.eval('document.querySelectorAll("section[aria-label=\'Ảnh và video\'] li").length');
    check('Xem thêm adds 24 more', more === Math.min(48, total), `${more}`);
  }

  await page.click('nav[aria-label="Lọc theo nhóm"] li:nth-child(2) button');
  const url = await page.eval('location.search');
  check('filter writes ?nhom=pha-che', url === '?nhom=pha-che', url);
  const groupTiles = await page.eval('document.querySelectorAll("section[aria-label=\'Ảnh và video\'] li").length');
  const groupCount = await page.eval('Number(document.querySelector("nav[aria-label=\'Lọc theo nhóm\'] li:nth-child(2) span").textContent)');
  check('Pha chế shows only its photos', groupTiles === Math.min(24, groupCount), `${groupTiles}/${groupCount}`);
  await page.wait(900);
  const top = await page.eval('Math.round(document.querySelector("#anh-va-video").getBoundingClientRect().top)');
  check('filter keeps the grid in view', top > 0 && top < 300, `top ${top}`);
  await page.shot('gallery-filtered');

  await page.goto('/hinh-anh/?nhom=video');
  const pressed = await page.eval('document.querySelector("nav[aria-label=\'Lọc theo nhóm\'] button[aria-pressed=true]").firstChild.textContent');
  check('?nhom=video opens on Video', pressed === 'Video', pressed);

  await page.goto('/hinh-anh/');
  await page.click('section[aria-label="Ảnh và video"] li:nth-child(5) button');
  const counter = await page.eval('document.querySelector("[data-lightbox-counter]")?.textContent');
  check('lightbox counter "5 / N"', counter === `5 / ${Math.min(24, total)}`, counter);
  const caption = await page.eval('document.querySelector("[role=dialog] p:last-child")?.textContent');
  check('lightbox shows the caption/alt', Boolean(caption && caption.length > 5), caption);
  await page.press('ArrowRight');
  check('→ next', (await page.eval('document.querySelector("[data-lightbox-counter]").textContent')).startsWith('6 /'));
  await page.press('ArrowLeft');
  await page.press('ArrowLeft');
  check('← previous', (await page.eval('document.querySelector("[data-lightbox-counter]").textContent')).startsWith('4 /'));
  if (width < 768) {
    await page.swipe(330, 50, 400);
    check('swipe left → next', (await page.eval('document.querySelector("[data-lightbox-counter]").textContent')).startsWith('5 /'));
    await page.swipe(50, 330, 400);
    check('swipe right → previous', (await page.eval('document.querySelector("[data-lightbox-counter]").textContent')).startsWith('4 /'));
  }
  await page.shot('gallery-lightbox');
  await page.press('Escape');
  check('Esc closes', await page.eval('!document.querySelector("[role=dialog][aria-modal=true]")'));
  const back = await page.eval('document.activeElement?.closest("li") !== null');
  check('focus returns to a tile', back);
}
