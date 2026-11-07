import { ChromeGate } from './chrome-gate';
import { ContactBar } from './contact-bar';
import { Footer } from './footer';
import { Header } from './header';

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
        <ContactBar />
      </ChromeGate>
    </>
  );
}
