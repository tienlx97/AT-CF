import { pageBasics } from './common.mjs';

// FLOW_ORDER_LINKS=1: site.json was given both order links (and the clock is in online hours
// if FLOW_EXPECT_ONLINE=1) — checks the buttons appear.
export default async function homeContact(page, { width, check }) {
  const withLinks = process.env.FLOW_ORDER_LINKS === '1';
  for (const path of ['/', '/lien-he/']) {
    await page.goto(path);
    await pageBasics(page, check, path);
    const maps = page.requests.filter((u) => /google/.test(u));
    const frames = await page.eval('document.querySelectorAll("iframe").length');
    const mapInView = await page.eval('document.querySelector("[data-map]").getBoundingClientRect().top < innerHeight + 200');
    if (width < 768 || !mapInView) {
      check(`${path}: no map iframe on load`, frames === 0, `${frames} iframes`);
    }
    void maps;
    await page.eval('document.querySelector("#gio-mo-cua").scrollIntoView({ behavior: "instant" })');
    await page.wait(600);
    const afterScroll = await page.eval('document.querySelectorAll("iframe").length');
    if (width < 768) {
      check(`${path}: phone keeps the still map card after scrolling`, afterScroll === 0);
      await page.click('[data-map] button');
      await page.wait(300);
    }
    const loaded = await page.eval('document.querySelector("[data-map] iframe")?.getAttribute("src") ?? ""');
    check(`${path}: map iframe after tap/scroll`, /maps\.google\.com.*output=embed/.test(loaded), loaded.slice(0, 60));
    await page.shot(`${path === '/' ? 'home' : 'lien-he'}-visit`);

    const text = await page.eval('document.querySelector("section[aria-labelledby=gio-mo-cua]").innerText');
    check(`${path}: hours 5:30 – 11:00 and 11:00 – 20:00`, text.includes('5:30 – 11:00') && text.includes('11:00 – 20:00'));
    const dir = await page.eval('[...document.querySelectorAll("section[aria-labelledby=gio-mo-cua] a")].map((a) => a.href).find((h) => h.includes("/dir/"))');
    check(`${path}: directions link to the shop`, Boolean(dir) && dir.includes('10.8052243'), dir);

    await page.eval('document.querySelector("#dat-online").scrollIntoView({ behavior: "instant" })');
    await page.wait(300);
    await page.shot(`${path === '/' ? 'home' : 'lien-he'}-order`);
    const order = await page.eval('[...document.querySelectorAll("[data-order]")].map((a) => a.dataset.order)');
    const fallback = await page.eval('Boolean(document.querySelector("[data-order-fallback]"))');
    if (withLinks) {
      check(`${path}: ShopeeFood and GrabFood buttons shown`, order.join(',') === 'shopeefood,grabfood', order.join(','));
      check(`${path}: no fallback text`, !fallback);
    } else {
      check(`${path}: no order buttons while links are empty`, order.length === 0, order.join(','));
      check(`${path}: phone/Zalo fallback shown`, fallback);
    }
    const links = await page.eval('[...document.querySelectorAll("#dat-online a")].map((a) => a.getAttribute("href"))');
    check(`${path}: tel and Zalo links`, links.includes('tel:+84932311434') && links.includes('https://zalo.me/0932311434'));
  }
  if (withLinks && process.env.FLOW_EXPECT_ONLINE === '1') {
    await page.goto('/');
    const cta = await page.eval('[...document.querySelectorAll("header a")].map((a) => a.textContent.trim()).find((t) => /Gọi đặt món|Đặt online/.test(t))');
    check('header CTA switches to Đặt online', cta === 'Đặt online', cta);
  }
}
