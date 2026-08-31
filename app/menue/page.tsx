import type { Metadata } from 'next';
import { Download, Phone } from 'lucide-react';
import { Notice, PageHero, PublicFrame } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.menu, '/menue/'); }

export default async function MenuPage() {
  const content = await getSiteContent();
  return <PublicFrame content={content}>
    <PageHero title={content.menu.title} image={content.menu.gallery[6]?.src || content.home.heroImage} eyebrow={content.labels.menuEyebrow} indexLabel={content.labels.pageIndex} titlePath="menu.title" imagePath={content.menu.gallery[6] ? 'menu.gallery.6.src' : 'home.heroImage'} eyebrowPath="labels.menuEyebrow" />
    <section className="shell section-grid page-intro" data-reveal><div><div className="prose prose--lead">{content.menu.introParagraphs.map((p, index) => <p key={`${p}-${index}`} data-cms-text={`menu.introParagraphs.${index}`} data-cms-label={`Menü-Absatz ${index + 1}`}>{p}</p>)}</div><div className="order-callout"><Phone aria-hidden="true" /><p data-cms-text="menu.preOrderText" data-cms-label="Vorbestelltext">{content.menu.preOrderText}</p><a href={`tel:${content.global.phoneHref}`} data-cms-link="global.phoneHref" data-cms-label="Telefon-Link"><span data-cms-text="global.phoneDisplay" data-cms-label="Telefonnummer">{content.global.phoneDisplay}</span></a></div><p className="rest-day" data-cms-text="menu.restDayText" data-cms-label="Ruhetag-Text">{content.menu.restDayText}</p><a className="button button--primary pdf-button" href={content.menu.pdfUrl} target="_blank" rel="noreferrer" data-cms-file="menu.pdfUrl" data-cms-label="Speisekarten-PDF"><Download aria-hidden="true" /> <span data-cms-text="menu.pdfLabel" data-cms-label="PDF-Linktext">{content.menu.pdfLabel}</span></a></div><Notice content={content.notice} /></section>
    <section className="gallery-section"><div className="shell"><div className="gallery-heading" data-reveal><p className="eyebrow eyebrow--dark" data-cms-text="labels.galleryEyebrow" data-cms-label="Galerie-Kicker">{content.labels.galleryEyebrow}</p><h2 data-cms-text="labels.galleryTitle" data-cms-label="Galerie-Titel">{content.labels.galleryTitle}</h2><p data-cms-text="labels.galleryLead" data-cms-label="Galerie-Einleitung">{content.labels.galleryLead}</p></div><div className="food-grid">{content.menu.gallery.map((image, index) => <a key={`${image.src}-${index}`} href={image.src} target="_blank" rel="noreferrer" data-reveal><img src={image.src} alt={image.alt} width="1200" height="800" loading="lazy" data-cms-image={`menu.gallery.${index}.src`} data-cms-alt={`menu.gallery.${index}.alt`} data-cms-label={`Galeriebild ${index + 1}`} /><span>{String(index + 1).padStart(2, '0')}</span></a>)}</div></div></section>
  </PublicFrame>;
}
