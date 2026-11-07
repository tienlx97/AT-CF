import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { journalDate, journalEntries } from '../config/journal';

/** @param {{ entry: (typeof journalEntries)[number], eager?: boolean }} props */
function Illustration({ entry, eager = false }) {
  return (
    <div className="relative overflow-hidden bg-surface-alt">
      <Image
        unoptimized
        src={entry.media[0].src}
        alt={`Minh họa: ${entry.title}`}
        width="900"
        height="600"
        loading={eager ? 'eager' : 'lazy'}
        className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transition-none"
      />
      <span className="absolute right-3 bottom-3 bg-white px-3 py-1 text-xs font-semibold text-brand-ink">
        Ảnh minh họa
      </span>
    </div>
  );
}

export function JournalPage() {
  const [featured, ...entries] = journalEntries;
  return (
    <>
      <header className="bg-surface-alt pt-28 pb-10 md:pt-36 md:pb-14">
        <div className="site-wrap">
          <p className="label-caps text-brand">Chuyện ở quán</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl tracking-tight md:text-7xl">
            Nhật ký Anh Tú
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed">
            Những câu chuyện quanh quầy cà phê, từ ngày đầu mở bán đến những
            buổi sáng quen thuộc.
          </p>
        </div>
      </header>
      <section
        aria-label="Bài viết nhật ký"
        className="site-wrap py-10 md:py-16"
      >
        <Link
          href={`/nhat-ky/${featured.id}/`}
          className="group grid items-center gap-6 border-b border-brand-ink/20 pb-10 md:grid-cols-2 md:gap-12 md:pb-16"
        >
          <Illustration entry={featured} eager />
          <div>
            <p className="label-caps text-brand">Bài mới nhất</p>
            <time dateTime={featured.date} className="mt-4 block text-sm">
              {journalDate(featured.date)}
            </time>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
              {featured.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">
              {featured.excerpt}
            </p>
            <span className="mt-7 inline-flex min-h-11 items-center gap-3 border border-brand-ink/40 px-5 font-bold transition-colors group-hover:bg-brand-ink group-hover:text-white">
              Đọc câu chuyện{' '}
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </Link>
        <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <article key={entry.id}>
              <Link href={`/nhat-ky/${entry.id}/`} className="group block">
                <Illustration entry={entry} />
                <time dateTime={entry.date} className="mt-5 block text-sm">
                  {journalDate(entry.date)}
                </time>
                <h2 className="mt-2 text-2xl font-bold leading-tight group-hover:text-brand">
                  {entry.title}
                </h2>
                <p className="mt-3 leading-relaxed">{entry.excerpt}</p>
                <span className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold underline decoration-brand/40 underline-offset-4">
                  Đọc câu chuyện{' '}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

/** @param {{ entry: (typeof journalEntries)[number] }} props */
export function JournalArticle({ entry }) {
  const related = journalEntries
    .filter((item) => item.id !== entry.id)
    .slice(0, 2);
  return (
    <article className="pt-24 md:pt-32">
      <div className="site-wrap">
        <Link
          href="/nhat-ky/"
          className="inline-flex min-h-11 items-center gap-2 border border-brand-ink/30 px-4 text-sm font-semibold hover:bg-surface-alt"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Tất cả nhật ký
        </Link>
      </div>
      <header className="mx-auto max-w-4xl px-4 pt-8 pb-10 text-center md:px-8 md:pt-12">
        <p className="label-caps text-brand">Nhật ký Anh Tú</p>
        <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight md:text-6xl">
          {entry.title}
        </h1>
        <time dateTime={entry.date} className="mt-5 block text-sm">
          {journalDate(entry.date)}
        </time>
        <p className="mt-6 text-xl leading-relaxed">{entry.excerpt}</p>
      </header>
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <Illustration entry={entry} eager />
      </div>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 text-lg leading-[1.9] md:px-8 md:py-14">
        {entry.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="site-wrap grid gap-5 pb-12 sm:grid-cols-2">
        {entry.media.slice(1).map((media) => (
          <div
            key={media.src}
            className="relative overflow-hidden bg-surface-alt"
          >
            <Image
              unoptimized
              src={media.src}
              alt={`Minh họa: ${media.caption}`}
              width="900"
              height="600"
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
            <span className="absolute right-3 bottom-3 bg-white px-3 py-1 text-xs font-semibold">
              Ảnh minh họa
            </span>
          </div>
        ))}
      </div>
      <aside className="border-t border-brand-ink/15 bg-surface-alt py-10 md:py-14">
        <div className="site-wrap">
          <h2 className="text-2xl font-bold">Đọc thêm chuyện ở quán</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/nhat-ky/${item.id}/`}
                className="flex min-h-20 items-center justify-between gap-4 border border-brand-ink/25 bg-white p-5 font-bold transition-colors hover:bg-brand-ink hover:text-white"
              >
                {item.title}
                <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </article>
  );
}
