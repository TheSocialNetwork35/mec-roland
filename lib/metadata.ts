import type { Metadata } from 'next';
import type { SeoEntry } from '@/lib/site-content';
import { absoluteSiteUrl } from '@/lib/site-url';

export function pageMetadata(seo: SeoEntry, path: string): Metadata {
  const image = seo.image.startsWith('http') ? seo.image : absoluteSiteUrl(seo.image);
  const url = absoluteSiteUrl(path);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: url, languages: { 'de-CH': url } },
    openGraph: { type: 'website', locale: 'de_CH', url, siteName: 'Mec Roland', title: seo.title, description: seo.description, images: [{ url: image, alt: seo.title }] },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description, images: [image] },
  };
}
