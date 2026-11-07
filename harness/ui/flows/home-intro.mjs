import { pageBasics } from './common.mjs';

export default async function homeIntro(page, { check, width }) {
  await page.goto('/');
  await pageBasics(page, check, 'home intro');
  await page.eval('window.scrollTo({top:document.querySelector("section[aria-labelledby=gioi-thieu]").getBoundingClientRect().top + scrollY - 72,behavior:"instant"})');
  await page.wait(400);
  const about = await page.eval(`(() => {
    const section = document.querySelector('section[aria-labelledby=gioi-thieu]');
    const rect = section.getBoundingClientRect();
    return { text: section.innerText, heading:section.querySelector('h2').innerText,
      images:[...section.querySelectorAll('img')].map(img=>({src:img.currentSrc,alt:img.alt,loaded:img.complete && img.naturalWidth>0,loading:img.loading})),
      links:[...section.querySelectorAll('a')].map(a=>a.getAttribute('href')),
      facts:section.querySelectorAll('dl > div').length,
      overflow:document.documentElement.scrollWidth>innerWidth,
      top:rect.top, height:rect.height,
      h2:section.querySelector('h2').getBoundingClientRect().toJSON(),
      photo:section.querySelector('img').getBoundingClientRect().toJSON()
    };
  })()`);
  check('editorial heading replaces centered introduction', about.heading.includes('Cà phê pha máy.') && about.heading.includes('Tiện mang đi.'), about.heading);
  check('real owner stall photo and process photo render', about.images.length===2 && about.images.every(img=>img.loaded) && about.images.some(img=>img.src.includes('xe-ca-phe')), JSON.stringify(about.images));
  check('intro keeps three practical source-derived facts', about.facts===3 && about.text.includes('5:30 – 11:00') && about.text.includes('15.000đ'), about.text);
  check('intro contains truthful concise existing copy', about.text.includes('100% nguyên chất, ngon và sạch') && about.text.includes('Phục vụ nhanh chóng'));
  check('intro has working menu and address destinations', about.links.includes('/menu/') && about.links.includes('/lien-he/'));
  check('intro pictures are lazy loaded', about.images.every(img=>img.loading==='lazy'));
  check('intro has no horizontal overflow', !about.overflow);
  check('intro stacks copy before photography on mobile/tablet', width>=1024 || about.h2.top<about.photo.top);
  check('desktop intro uses editorial side by side composition', width<1024 || about.h2.left<about.photo.left);
  await page.shot('intro');
  await page.eval('document.querySelector("section[aria-labelledby=gioi-thieu] img").scrollIntoView({behavior:"instant",block:"center"})');
  await page.wait(200);
  await page.shot('intro-photos');
  await page.click('section[aria-labelledby=gioi-thieu] a[href="/menu/"]');
  check('intro menu action navigates', await page.eval('location.pathname')==='/menu/');
}
