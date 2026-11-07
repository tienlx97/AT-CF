import { notFound } from 'next/navigation';

import { JournalArticle, journalEntries } from '@/features/journal';
import { pageMetadata } from '@/shared/config/page-meta';

export const dynamicParams = false;
export function generateStaticParams() {
  return journalEntries.map(({ id }) => ({ id }));
}

/** @param {{ params: Promise<{id: string}> }} props */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const entry = journalEntries.find((item) => item.id === id);
  if (!entry) notFound();
  return pageMetadata({
    path: `/nhat-ky/${entry.id}/`,
    title: `${entry.title} — Nhật ký Anh Tú Coffee`,
    description: entry.excerpt,
  });
}

/** @param {{ params: Promise<{id: string}> }} props */
export default async function Page({ params }) {
  const { id } = await params;
  const entry = journalEntries.find((item) => item.id === id);
  if (!entry) notFound();
  return <JournalArticle entry={entry} />;
}
