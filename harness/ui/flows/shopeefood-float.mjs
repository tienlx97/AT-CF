import { readFileSync } from 'node:fs';

import { pageBasics } from './common.mjs';

const site = JSON.parse(readFileSync('src/data/site.json', 'utf8'));

export default async function shopeeFoodFloat(page, { width, check }) {
  await page.goto('/');
  await pageBasics(page, check, 'floating action');
  const button = await page.eval(`(() => {
    const link = document.querySelector('.shopee-float');
    if (!link) return null;
    const box = link.getBoundingClientRect();
    return {href:link.href,target:link.target,rel:link.rel,label:link.getAttribute('aria-label'),
      right:innerWidth-box.right,bottom:innerHeight-box.bottom,width:box.width,height:box.height,
      reachable:link.contains(document.elementFromPoint(box.x+box.width/2,box.y+box.height/2)),
      image:link.querySelector('img').complete&&link.querySelector('img').naturalWidth===220};
  })()`);
  check('floating action uses the configured ShopeeFood destination', button?.href === site.order.shopeefood, button?.href);
  check('floating action is accessible and opens a safe new tab', button?.target === '_blank' && button?.rel.includes('noopener') && /ShopeeFood/.test(button?.label ?? ''));
  check('official artwork loads', button?.image);
  check('floating action is large and safely inset at the lower right', button?.width>=48 && button?.height>=48 && button?.right>=16 && button?.bottom>=16 && button?.bottom<=130, JSON.stringify(button));
  check('floating action receives pointer input', button?.reachable);
  await page.eval('document.querySelector(".shopee-float").focus()');
  const pulses = await page.eval(`[...document.querySelectorAll('.shopee-float__ring')].map(el=>{const s=getComputedStyle(el);return {name:s.animationName,duration:parseFloat(s.animationDuration),delay:parseFloat(s.animationDelay),count:Number(s.animationIterationCount),transform:s.transform}})`);
  check('two delayed waves replay on focus and settle within five seconds', pulses.length===2 && pulses.every(p=>p.name==='shopee-beacon-replay' && p.count===2 && p.duration*p.count+p.delay<=5) && pulses[1].delay>pulses[0].delay, JSON.stringify(pulses));
  await page.wait(220);
  const first = await page.eval('getComputedStyle(document.querySelector(".shopee-float__ring")).transform');
  await page.wait(350);
  const second = await page.eval('getComputedStyle(document.querySelector(".shopee-float__ring")).transform');
  check('wave visibly expands over time', first!==second, `${first} -> ${second}`);
  await page.shot('floating-action');
  await page.wait(4000);
  check('automatic waves settle instead of looping indefinitely', await page.eval('document.querySelectorAll(".shopee-float__ring").length===2 && [...document.querySelectorAll(".shopee-float__ring")].every(el=>el.getAnimations().length===0)'));

  if (width < 768) {
    await page.click('button[aria-controls="mobile-menu"]');
    check('floating action hides while the drawer is open', await page.eval('getComputedStyle(document.querySelector(".shopee-float")).display === "none"'));
    await page.press('Escape');
  }
  await page.click('section[aria-labelledby="hinh-anh-quan"] li button');
  check('floating action hides behind the image lightbox', await page.eval('getComputedStyle(document.querySelector(".shopee-float")).display === "none"'));
  await page.press('Escape');
  check('floating action returns after closing overlays', await page.eval('getComputedStyle(document.querySelector(".shopee-float")).display === "flex"'));
  await page.goto('/menu-in/');
  check('print menu never renders the floating action', await page.eval('!document.querySelector(".shopee-float")'));
  await page.emulate({ reducedMotion:true });
  await page.goto('/');
  await page.eval('document.querySelector(".shopee-float").focus()');
  check('reduced motion disables both waves including focus replay', await page.eval('[...document.querySelectorAll(".shopee-float__ring")].every(el=>getComputedStyle(el).animationName === "none")'));
  await page.shot('reduced-motion');
  await page.emulate({ reducedMotion:false });
}
