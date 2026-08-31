import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { PageHero, PublicFrame } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.links, '/links/'); }

export default async function LinksPage() {
  const content = await getSiteContent();
  return <PublicFrame content={content}><PageHero title={content.links.title} image={content.menu.gallery[2]?.src || content.home.heroImage} eyebrow={content.labels.linksEyebrow} indexLabel={content.labels.pageIndex} titlePath="links.title" imagePath={content.menu.gallery[2] ? 'menu.gallery.2.src' : 'home.heroImage'} eyebrowPath="labels.linksEyebrow" /><section className="shell supplier-list">{content.links.items.map((item, index) => <a key={`${item.href}-${index}`} href={item.href} target="_blank" rel="noreferrer" data-reveal data-cms-link={`links.items.${index}.href`} data-cms-label={`Linkziel ${item.label}`}><span>{String(index + 1).padStart(2, '0')}</span><div><p data-cms-text={`links.items.${index}.intro`} data-cms-label={`Einleitung ${item.label}`}>{item.intro}</p><h2 data-cms-text={`links.items.${index}.label`} data-cms-label={`Linkname ${index + 1}`}>{item.label}</h2></div><ArrowUpRight aria-hidden="true" /></a>)}</section></PublicFrame>;
}
