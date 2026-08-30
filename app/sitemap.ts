import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mec-roland.ch';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/menue/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/team/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/kontakt/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/links/`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/impressum/`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
