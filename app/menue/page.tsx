import type { Metadata } from 'next';
import { Download, Phone } from 'lucide-react';
import { Notice, PageHero, PublicFrame } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.menu, '/menue/'); }

export default async function MenuPage() {
  const content = await getSiteContent();
  return <PublicFrame content={content}>
    <PageHero title={content.menu.title} image={content.menu.gallery[6]?.src || content.home.heroImage} eyebrow={content.labels.menuEyebrow} indexLabel={content.labels.pageIndex} />
    <section className="shell section-grid page-intro" data-reveal><div><div className="prose prose--lead">{content.menu.introParagraphs.map((p) => <p key={p}>{p}</p>)}</div><div className="order-callout"><Phone aria-hidden="true" /><p>{content.menu.preOrderText}</p><a href={`tel:${content.global.phoneHref}`}>{content.global.phoneDisplay}</a></div><p className="rest-day">{content.menu.restDayText}</p><a className="button button--primary pdf-button" href={content.menu.pdfUrl} target="_blank" rel="noreferrer"><Download aria-hidden="true" /> {content.menu.pdfLabel}</a></div><Notice content={content.notice} /></section>
    <section className="gallery-section"><div className="shell"><div className="gallery-heading" data-reveal><p className="eyebrow eyebrow--dark">{content.labels.galleryEyebrow}</p><h2>{content.labels.galleryTitle}</h2><p>{content.labels.galleryLead}</p></div><div className="food-grid">{content.menu.gallery.map((image, index) => <a key={`${image.src}-${index}`} href={image.src} target="_blank" rel="noreferrer" data-reveal><img src={image.src} alt={image.alt} width="1200" height="800" loading="lazy" /><span>{String(index + 1).padStart(2, '0')}</span></a>)}</div></div></section>
  </PublicFrame>;
}
