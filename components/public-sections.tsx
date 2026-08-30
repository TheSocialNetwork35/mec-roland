import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, Phone } from 'lucide-react';
import type { SiteContent } from '@/lib/site-content';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { MotionLayer } from '@/components/motion-layer';

export function PublicFrame({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <><SiteHeader content={content.global} /><main id="main-content">{children}</main><SiteFooter content={content} /><MotionLayer /></>;
}

export function PageHero({ title, image, eyebrow, indexLabel }: { title: string; image: string; eyebrow: string; indexLabel: string }) {
  return <section className="page-hero"><img src={image} alt="" width="1600" height="733" fetchPriority="high" /><div className="page-hero__shade" /><div className="page-hero__index">{indexLabel}</div><div className="shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><span className="page-hero__line" /></div></section>;
}

export function Notice({ content }: { content: SiteContent['notice'] }) {
  return <aside className="notice" aria-labelledby="current-notice" data-reveal><p className="notice__label">{content.label}</p><h3 id="current-notice">{content.title}</h3><p>{content.body}</p></aside>;
}

export function VisitSection({ content }: { content: SiteContent }) {
  const global = content.global;
  return <section className="visit" aria-label="Besuchsangaben" data-reveal><div className="shell visit__grid">
    <article><Clock3 aria-hidden="true" /><p className="eyebrow eyebrow--dark">{content.labels.visitHoursEyebrow}</p><h2>{content.labels.visitHoursTitle}</h2>{global.openingTimes.map((line) => <p key={line}>{line}</p>)}</article>
    <article><Phone aria-hidden="true" /><p className="eyebrow eyebrow--dark">{content.labels.visitOrderEyebrow}</p><h2>{content.labels.visitOrderTitle}</h2><p>{global.orderingNote}</p><a className="text-link" href={`tel:${global.phoneHref}`}>{global.phoneDisplay} <ArrowRight aria-hidden="true" /></a></article>
    <article><MapPin aria-hidden="true" /><p className="eyebrow eyebrow--dark">{content.labels.visitPlaceEyebrow}</p><h2>{content.labels.visitPlaceTitle}</h2><p>{global.addressStreet}<br />{global.addressPostalCity}</p><a className="text-link" href={global.mapUrl} target="_blank" rel="noreferrer">{content.labels.routeCta} <ArrowRight aria-hidden="true" /></a></article>
  </div></section>;
}

export function PageLinks({ content }: { content: SiteContent }) {
  const links = content.global.navigation.filter((item) => ['/menue/', '/team/', '/kontakt/'].includes(item.href));
  return <div className="next-pages"><div className="shell next-pages__grid">{links.map((item, index) => <Link href={item.href} key={item.href}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.label}</strong><ArrowRight aria-hidden="true" /></Link>)}</div></div>;
}
