import {
  ContactOrder,
  FeaturedDrinks,
  GalleryPreview,
  Hero,
  Intro,
  Reels,
  Visit,
} from '@/features/home';

export default function HomePage() {
  return (
    <>
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
