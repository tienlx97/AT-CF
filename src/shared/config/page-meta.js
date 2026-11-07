/**
 * Metadata for a sub-page: its own title, description, canonical URL and the
 * shared share image, so links sent on Zalo/Facebook show the right page.
 * @param {{ path: string, title: string, description: string, index?: boolean }} page
 * @returns {import('next').Metadata}
 */
export function pageMetadata({ path, title, description, index = true }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      siteName: 'Anh Tú Coffee',
      url: path,
      title,
      description,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}
