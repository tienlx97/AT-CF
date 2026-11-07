import { pageBasics } from './common.mjs';

// Needs fixture clips processed into media.json (see harness/PROGRESS.md home-page 1.3).
export default async function homeReels(page, { width, check }) {
  await page.goto('/');
  await pageBasics(page, check, 'home');
  await page.eval('document.querySelector("#video-ngan").scrollIntoView()');
  await page.wait(400);
  await page.shot('reels');
  const posters = await page.eval('document.querySelectorAll("section[aria-labelledby=video-ngan] li button").length');
  check('4–8 reel posters', posters >= 4 && posters <= 8, `${posters}`);
  const before = page.requests.filter((u) => u.endsWith('.mp4') && !u.includes('/hero/')).length;
  check('no clip loads before a tap', before === 0, `${before} mp4 requests`);

  await page.click('section[aria-labelledby=video-ngan] li:nth-child(2) button');
  await page.wait(800);
  const dialog = await page.eval('Boolean(document.querySelector("[role=dialog][aria-modal=true] video"))');
  check('tap opens the clip in the lightbox', dialog);
  const counter = await page.eval('document.querySelector("[data-lightbox-counter]")?.textContent');
  check('counter shows position', counter === `2 / ${posters}`, counter);
  const mp4 = page.requests.filter((u) => u.endsWith('.mp4') && !u.includes('/hero/'));
  check('the clip loads after the tap', mp4.length >= 1, mp4.join(', '));
  const focusIn = await page.eval('document.querySelector("[role=dialog]").contains(document.activeElement)');
  check('focus moves into the lightbox', focusIn);
  if (width < 768) {
    const bar = await page.eval('getComputedStyle(document.querySelector(".contact-bar")).display');
    check('contact bar hidden over the lightbox', bar === 'none');
  }
  await page.shot('lightbox');
  await page.press('ArrowRight');
  const next = await page.eval('document.querySelector("[data-lightbox-counter]")?.textContent');
  check('→ key shows the next clip', next === `3 / ${posters}`, next);
  if (width < 768) {
    await page.swipe(320, 60, 400);
    const swiped = await page.eval('document.querySelector("[data-lightbox-counter]")?.textContent');
    check('swipe left shows the next clip', swiped === `4 / ${posters}`, swiped);
  }
  const sound = await page.eval('Boolean(document.querySelector("[aria-label=\'Bật tiếng\']"))');
  check('sound toggle present', sound);
  await page.press('Escape');
  const closed = await page.eval('!document.querySelector("[role=dialog][aria-modal=true]")');
  check('Esc closes the lightbox', closed);
  const playing = await page.eval('[...document.querySelectorAll("video")].some((v) => !v.paused)');
  check('no clip keeps playing after close', !playing);
  const returned = await page.eval('document.activeElement?.closest("section")?.getAttribute("aria-labelledby")');
  check('focus returns to the reels', returned === 'video-ngan', returned);
}
