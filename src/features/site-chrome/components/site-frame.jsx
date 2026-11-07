import { ChromeGate } from './chrome-gate';
import { Footer } from './footer';
import { Header } from './header';
import { ShopeeFoodFloat } from './shopeefood-float';

/** @param {{ children: import('react').ReactNode }} props */
export function SiteFrame({ children }) {
  return (
    <>
      <ChromeGate>
        <Header />
      </ChromeGate>
      <main id="noi-dung">{children}</main>
      <ChromeGate>
        <Footer />
        <ShopeeFoodFloat />
      </ChromeGate>
    </>
  );
}
