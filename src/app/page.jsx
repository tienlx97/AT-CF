import {
  FeaturedDrinks,
  GalleryPreview,
  Hero,
  Intro,
  Reels,
} from '@/features/home';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <FeaturedDrinks />
      <Reels />
      <GalleryPreview />
    </>
  );
}
