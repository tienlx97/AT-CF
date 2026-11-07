import { heroSlides } from '@/shared/api/media';
import { ResponsiveImage } from '@/shared/components/responsive-image';
import { site } from '@/shared/config/site';

/**
 * Inline <head> script (root layout), run before first paint. The splash plays
 * only when a tab session first lands on the home page; every other case sets
 * <html data-intro-seen>, which hides it, so client-side navigation back to
 * home never replays it.
 */
export const INTRO_ONCE_SCRIPT = `try{var d=document.documentElement,k='atc-intro-seen';if(sessionStorage.getItem(k)||location.pathname!=='/')d.setAttribute('data-intro-seen','');else setTimeout(function(){d.setAttribute('data-intro-seen','')},3500);sessionStorage.setItem(k,'1')}catch(_){document.documentElement.setAttribute('data-intro-seen','')}`;

/**
 * Opening title card (owner request, after giaoyeniz.com): a toned photo, the
 * brand name rising out of masks, a drawn rule and the tagline, then an upward
 * wipe. Pure CSS, never takes the pointer, absent under reduced motion
 * (globals.css .intro-splash).
 */
export function IntroSplash() {
  // The hero's first photo: already the page's LCP image, so no extra download.
  const photo = heroSlides().find((item) => item.type === 'image') ?? null;
  return (
    <div aria-hidden="true" className="intro-splash">
      {photo ? (
        <div className="intro-splash__photo">
          <ResponsiveImage
            item={photo}
            fill
            priority
            highPriority={false}
            sizes="100vw"
            alt=""
          />
        </div>
      ) : null}
      <div className="intro-splash__tint" />
      <div className="intro-splash__sweep" />
      <div className="intro-splash__ghost">{site.brandMain}</div>
      <div className="intro-splash__wrap">
        <div className="intro-splash__mask">
          <div className="intro-splash__eyebrow">
            Cà phê pha máy · {site.address.district}
          </div>
        </div>
        <div className="intro-splash__mask">
          <div className="intro-splash__title">
            {site.brandMain} {site.brandSub}
          </div>
        </div>
        <div className="intro-splash__rule" />
        <div className="intro-splash__tagline">{site.tagline}</div>
      </div>
    </div>
  );
}
