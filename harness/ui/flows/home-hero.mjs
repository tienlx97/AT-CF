import { pageBasics } from './common.mjs';

// This flow tests the first-visit intro splash (flow.mjs skips it otherwise).
export const playsIntro = true;

// Hero slider: photos/clips change behind still copy; reduced motion never autoplays.
export default async function homeHero(page, { check }) {
  const reduced = process.env.FLOW_REDUCED === '1';
  await page.emulate({ reducedMotion: reduced });
  await page.goto('/');
  const splash = await page.eval(`(() => { const s = document.querySelector('.intro-splash');
    if (!s) return null; const c = getComputedStyle(s);
    return { shown: c.display !== 'none', hidden: s.getAttribute('aria-hidden'), pointer: c.pointerEvents,
      title: s.innerText.replace(/\\s+/g, ' ') }; })()`);
  check('intro splash exists, decorative and click-through', splash && splash.hidden === 'true' && splash.pointer === 'none');
  if (reduced) {
    check('reduced motion skips the intro splash', splash && !splash.shown);
  } else {
    check('intro splash plays on first visit and names the brand', splash?.shown && /ANH TÚ COFFEE/.test(splash.title), splash?.title);
    await page.wait(300);
    await page.shot('intro-splash');
    await page.wait(3200);
    const gone = await page.eval(`(() => { const c = getComputedStyle(document.querySelector('.intro-splash'));
      return c.display === 'none' || c.visibility === 'hidden' ? 'gone' : 'visible'; })()`);
    check('intro splash wipes away within 3.5 s', gone === 'gone', gone);
  }
  await page.shot(reduced ? 'hero-reduced' : 'hero');
  await pageBasics(page, check, 'home');

  const hero = await page.eval(`(() => {
    const s = document.querySelector('section[aria-labelledby="hero-title"]');
    const r = s.getBoundingClientRect();
    const links = [...s.querySelectorAll('a')];
    return {
      h: r.height, vh: innerHeight, text: s.querySelector('.hero-copy').innerText,
      copyTop: s.querySelector('h1').getBoundingClientRect().top,
      titleSize: parseFloat(getComputedStyle(s.querySelector('.hero-title')).fontSize),
      slides: s.querySelectorAll('.hero-slide').length,
      active: [...s.querySelectorAll('.hero-slide')].findIndex(x => x.hasAttribute('data-active')),
      title: s.querySelector('.hero-title').innerText.trim(),
      paragraphs: s.querySelectorAll('p').length,
      status: Boolean(s.querySelector('.hero-copy [aria-live]')),
      video: Boolean(s.querySelector('video')),
      buttonsVisible: links.every(a => {
        const b = a.getBoundingClientRect();
        return b.top >= 0 && b.bottom <= innerHeight - (innerWidth < 768 ? 80 : 0);
      }),
      buttonsReachable: links.every(a => {
        const b = a.getBoundingClientRect();
        return a.contains(document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2));
      }),
      buttonsBordered: links.every(a => {
        const style = getComputedStyle(a);
        return parseFloat(style.borderTopWidth) >= 1 && style.borderTopStyle === 'solid';
      }),
      overlay: (() => {
        const overlay = s.querySelector('[data-overlay="true"]');
        if (!overlay) return null;
        const style = getComputedStyle(overlay);
        const box = overlay.getBoundingClientRect();
        return {shown: style.display !== 'none', gradient: style.backgroundImage, pointer: style.pointerEvents,
          hidden: overlay.getAttribute('aria-hidden'), width: box.width, viewport: innerWidth};
      })(),
      links: links.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') })),
      slides: s.querySelectorAll('.hero-slide').length,
      active: [...s.querySelectorAll('.hero-slide')].findIndex(x => x.hasAttribute('data-active')),
      image: s.querySelector('img') ? s.querySelector('img').complete && s.querySelector('img').naturalWidth > 0 : null,
      background: getComputedStyle(s).backgroundColor,
    };
  })()`);
  check('hero is slightly shorter than one screen', Math.abs(hero.h - hero.vh * .92) <= 1, `${hero.h} of ${hero.vh}`);
  check('hero copy sits slightly above the lower corner', hero.copyTop >= hero.vh * 0.35 && hero.copyTop <= hero.vh * 0.6, hero.copyTop);
  check('hero title has the enlarged responsive scale', hero.titleSize >= 48 && hero.titleSize <= 126, hero.titleSize);
  check('hero title is ANH TÚ', hero.title === 'ANH TÚ', hero.title);
  check('hero keeps the coffee category and pure-coffee subline', /(?:Cà phê|CAFE) pha máy/i.test(hero.text) && /100% NGUYÊN CHẤT/.test(hero.text) && hero.paragraphs === 1);
  check('hero copy stays under 25 words', hero.text.trim().split(/\s+/).length <= 25, hero.text);
  check('hero has no duplicated live status', !hero.status);
  check('hero actions stay visible above phone bar', hero.buttonsVisible);
  check('hero actions receive pointer input without slider interception', hero.buttonsReachable);
  check('hero actions have visible solid borders', hero.buttonsBordered);
  check('title overlay is decorative and click-through', hero.overlay?.hidden === 'true' && hero.overlay?.pointer === 'none');
  check('title overlay only shows on desktop', hero.overlay?.shown === (page.width >= 1024));
  if (page.width >= 1024) check('radial shade stays localized behind the copy', hero.overlay?.gradient.includes('radial-gradient') && hero.overlay.width < hero.overlay.viewport * .9);
  check('menu action lands on menu', hero.links.some(a => a.text === 'Xem thực đơn' && a.href === '/menu/'));
  check('directions action exists', hero.links.some(a => a.text === 'Chỉ đường' && a.href.startsWith('https://maps.')));
  check('first slide photo loads or solid brand fallback remains', hero.image === true || (hero.image === null && hero.background !== 'rgba(0, 0, 0, 0)'));
  if (hero.active === 0)
    check('no clip file loads while the first photo shows', !page.requests.some(url => /\.mp4(?:\?|$)/.test(url)));
  if (hero.slides > 1) {
    if (!reduced) await page.click('section[aria-labelledby="hero-title"] button[aria-label="Tạm dừng trình chiếu"]');
    const activeNow = () => page.eval(`[...document.querySelectorAll('.hero-slide')].findIndex(x => x.hasAttribute('data-active'))`);
    const before = await activeNow();
    await page.click('section[aria-labelledby="hero-title"] button[aria-label="Ảnh sau"]');
    await page.wait(400);
    const after = await activeNow();
    check('next button moves to the following slide', after === (before + 1) % hero.slides, `${before} -> ${after}`);
    if (reduced) {
      await page.wait(7000);
      check('reduced motion never autoplays', (await activeNow()) === after);
    }
  }
  await page.click('section[aria-labelledby="hero-title"] a[href="/menu/"]');
  await page.wait(800);
  check('hero menu navigation works', await page.eval('location.pathname === "/menu/"'));
  await page.eval('history.back()');
  await page.wait(800);
  const replay = await page.eval(`(() => { const s = document.querySelector('.intro-splash');
    return location.pathname + ' ' + (s ? getComputedStyle(s).display : 'none'); })()`);
  check('returning to home never replays the splash', replay === '/ none', replay);
}
