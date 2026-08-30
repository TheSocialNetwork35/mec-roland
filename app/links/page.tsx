import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { PageHero, PublicFrame } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.links, '/links/'); }

export default async function LinksPage() {
  const content = await getSiteContent();
  return <PublicFrame content={content}><PageHero title={content.links.title} image={content.menu.gallery[2]?.src || content.home.heroImage} eyebrow={content.labels.linksEyebrow} indexLabel={content.labels.pageIndex} /><section className="shell supplier-list">{content.links.items.map((item, index) => <a key={item.href} href={item.href} target="_blank" rel="noreferrer" data-reveal><span>{String(index + 1).padStart(2, '0')}</span><div><p>{item.intro}</p><h2>{item.label}</h2></div><ArrowUpRight aria-hidden="true" /></a>)}</section></PublicFrame>;
}
