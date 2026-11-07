import { pageBasics } from './common.mjs';

export default async function journal(page, { width, check }) {
  await page.goto('/nhat-ky/');
  await pageBasics(page, check, 'journal');
  const links = await page.eval('[...document.querySelectorAll("section article a, section > a")].map(a=>a.getAttribute("href"))');
  check('six journal stories with newest first', links.length === 6 && links[0] === '/nhat-ky/hom-nay/');
  await page.shot('journal-index');
  await page.click('section > a');
  await page.wait(500);
  check('featured article opens', await page.eval('location.pathname') === '/nhat-ky/hom-nay/');
  for (const path of links) {
    await page.goto(path);
    await pageBasics(page, check, path);
    await page.eval('Promise.all([...document.querySelectorAll("main img")].map(img=>{img.loading="eager";return img.decode().catch(()=>null)}))');
    check(`${path} illustrations all render`, await page.eval('[...document.querySelectorAll("main img")].every(img=>img.complete && img.naturalWidth>0)'));
    check(`${path} has no unavailable video`, await page.eval('!document.querySelector("main video")'));
    check(`${path} back link exists`, await page.eval('Boolean(document.querySelector("main a[href=\'/nhat-ky/\']"))'));
    if(path.includes('hom-nay')) await page.shot('journal-article');
  }
  await page.goto('/nhat-ky/');
  if(width < 1280) {
    await page.click('button[aria-controls="mobile-menu"]');
    check('drawer includes journal', await page.eval('Boolean(document.querySelector("#mobile-menu a[href=\'/nhat-ky/\']"))'));
    await page.shot('journal-drawer');
    await page.press('Escape');
  } else {
    check('desktop navigation has five links', await page.eval('document.querySelectorAll("header nav a").length') === 5);
  }
}
