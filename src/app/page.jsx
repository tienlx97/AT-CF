import { site } from '@/shared/config/site';

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-brand px-6 text-center text-white">
      <p className="label-caps">Cà phê pha máy · Mang đi</p>
      <h1 className="text-5xl font-extrabold tracking-tight">{site.brandMain}</h1>
      <p className="label-caps">{site.brandSub}</p>
      <p className="max-w-md text-base font-medium">{site.tagline}</p>
    </main>
  );
}