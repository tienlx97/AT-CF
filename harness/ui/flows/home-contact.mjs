import { readFileSync } from 'node:fs';

import { pageBasics } from './common.mjs';

const site = JSON.parse(readFileSync('src/data/site.json', 'utf8'));

// Address/hours remain informational; every purchase leaves for ShopeeFood.
export default async function homeContact(page, { width, check }) {
  for (const path of ['/', '/lien-he/']) {
    await page.goto(path);
    await pageBasics(page, check, path);
    const frames = await page.eval('document.querySelectorAll("iframe").length');
    const mapInView = await page.eval('document.querySelector("[data-map]").getBoundingClientRect().top < innerHeight + 200');
    if (width < 768 || !mapInView) check(`${path}: no map iframe on load`, frames === 0, `${frames} iframes`);
    await page.eval('document.querySelector("#gio-mo-cua").scrollIntoView({behavior:"instant"})');
    await page.wait(600);
    if (width < 768) {
      check(`${path}: phone keeps map unloaded until tap`, await page.eval('!document.querySelector("[data-map] iframe")'));
      await page.click('[data-map] button');
      await page.wait(300);
    }
    const loaded = await page.eval('document.querySelector("[data-map] iframe")?.getAttribute("src") ?? ""');
    check(`${path}: map loads on tap/scroll`, /maps\.google\.com.*output=embed/.test(loaded), loaded.slice(0,60));
    await page.shot(path === '/' ? 'home-visit' : 'address');
    const text = await page.eval('document.querySelector("section[aria-labelledby=gio-mo-cua]").innerText');
    check(`${path}: counter and ShopeeFood hours remain`, text.includes('5:30 – 11:00') && text.includes('11:00 – 20:00') && text.includes('ShopeeFood'));
    check(`${path}: directions link remains`, await page.eval('Boolean(document.querySelector("a[href*=\'/dir/\']"))'));
    const orderLinks = await page.eval('[...document.querySelectorAll("a[href*=\'shopeefood.vn\']")].map(a=>a.getAttribute("href"))');
    check(`${path}: purchases use the configured ShopeeFood target`, orderLinks.length>0 && orderLinks.every(href=>href===site.order.shopeefood),orderLinks.join(', '));
    check(`${path}: no direct-order contact section or floating contact bar`, await page.eval('!document.querySelector("#dat-online, .contact-bar")'));
    check(`${path}: no phone, Zalo or GrabFood in public copy`, await page.eval('!/0932|Zalo|GrabFood/.test(document.body.innerText)'));
    await page.eval('document.querySelector("footer").scrollIntoView({behavior:"instant"})');
    await page.wait(400); await page.shot(path === '/' ? 'home-footer' : 'address-footer');
  }
}
