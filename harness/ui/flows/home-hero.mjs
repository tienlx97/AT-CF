import { pageBasics } from './common.mjs';

// Run twice: normally, then with --reduced to prove no video file is requested.
export default async function homeHero(page, { width, check }) {
  const reduced = process.env.FLOW_REDUCED === '1';
  await page.emulate({ reducedMotion: reduced });
  await page.goto('/');
  await page.wait(800);
  await page.shot(reduced ? 'hero-reduced' : 'hero');
  await pageBasics(page, check, 'home');

  const hero = await page.eval(`(() => { const s = document.querySelector('section[aria-labelledby="hero-title"]');
    const r = s.getBoundingClientRect(); return { h: Math.round(r.height), vh: innerHeight }; })()`);
  check('hero fills the first screen', hero.h >= hero.vh - 1, `${hero.h} of ${hero.vh}`);

  const text = await page.eval('document.querySelector("#hero-title").textContent');
  check('h1 names category and place', /Cà phê pha máy/.test(text) && /Bình Tân/.test(text), text);
  const buttons = await page.eval('[...document.querySelectorAll("section[aria-labelledby=hero-title] a")].map((a) => a.textContent.trim())');
  check('hero has Xem menu and Chỉ đường', buttons.includes('Xem menu') && buttons.includes('Chỉ đường'), buttons.join(', '));
  const status = await page.eval('document.querySelector("section[aria-labelledby=hero-title] [aria-live]").textContent');
  check('status badge shows live VN status', /Đang mở cửa|Đang bán online|Đã đóng cửa/.test(status), status);

  const hasPoster = await page.eval('Boolean(document.querySelector("section[aria-labelledby=hero-title] picture img"))');
  const video = await page.eval('document.querySelector("section[aria-labelledby=hero-title] video")?.getAttribute("src") ?? null');
  const mp4Requests = page.requests.filter((url) => url.endsWith('.mp4'));
  if (!hasPoster) {
    check('no media yet: placeholder names the hero shot', await page.eval('document.body.innerText.includes("CHỜ VIDEO HERO") || document.body.innerText.includes("Chờ video hero")'));
  } else if (reduced) {
    check('reduced motion: no video element', video === null);
    check('reduced motion: no mp4 requested', mp4Requests.length === 0, mp4Requests.join(', '));
  } else {
    const expected = width < 768 ? /doc|portrait/ : /ngang|landscape/;
    check('video plays the right orientation file', Boolean(video) && expected.test(video), video ?? 'none');
    check('only one mp4 requested', new Set(mp4Requests).size === 1, mp4Requests.join(', '));
    const state = await page.eval('(() => { const v = document.querySelector("section[aria-labelledby=hero-title] video"); return v && { muted: v.muted, loop: v.loop, inline: v.playsInline }; })()');
    check('video is muted, looped, inline', state?.muted && state?.loop && state?.inline, JSON.stringify(state));
  }
  const contrast = await page.eval(`(() => {
    const veil = getComputedStyle(document.querySelector('section[aria-labelledby="hero-title"] > div.bg-brand-ink\\\\/65')).backgroundColor;
    return veil; })()`);
  check('green veil over the hero media', /(rgba?|oklab|oklch)\(.*(\/ 0\.[4-9]|0\.[4-9]\))/.test(contrast), contrast);
}
