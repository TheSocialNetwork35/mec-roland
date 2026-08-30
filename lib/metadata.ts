import type { Metadata } from 'next';
import type { SeoEntry } from '@/lib/site-content';

export function pageMetadata(seo: SeoEntry, path: string): Metadata {
  const image = seo.image.startsWith('http') ? seo.image : `https://mec-roland.ch${seo.image}`;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'de_CH', url: path, siteName: 'Mec Roland', title: seo.title, description: seo.description, images: [{ url: image }] },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description, images: [image] },
  };
}
