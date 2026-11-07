import {
  ContactOrder,
  FeaturedDrinks,
  GalleryPreview,
  Hero,
  Intro,
  Reels,
  Visit,
} from '@/features/home';
import { priceRange } from '@/shared/api/menu';
import { cafeJsonLd } from '@/shared/api/seo';
import { site } from '@/shared/config/site';

export default function HomePage() {
  const jsonLd = cafeJsonLd(site, priceRange());
  return (
    <>
      <script
        type="application/ld+json"
        // Static JSON from our own data files, escaped against "</script>".
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Hero />
      <Intro />
      <FeaturedDrinks />
      <Reels />
      <GalleryPreview />
      <Visit />
      <ContactOrder />
    </>
  );
}
