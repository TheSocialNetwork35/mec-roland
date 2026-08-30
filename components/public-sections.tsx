import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, Phone } from 'lucide-react';
import type { SiteContent } from '@/lib/site-content';
import { SiteFooter, SiteHeader } from '@/components/site-shell';

export function PublicFrame({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <><SiteHeader content={content.global} /><main id="main-content">{children}</main><SiteFooter content={content.global} /></>;
}

export function PageHero({ title, image, eyebrow }: { title: string; image: string; eyebrow?: string }) {
  return <section className="page-hero"><img src={image} alt="" width="1600" height="733" fetchPriority="high" /><div className="page-hero__shade" /><div className="shell"><p className="eyebrow">{eyebrow ?? 'Mec Roland · Kaltbrunn'}</p><h1>{title}</h1></div></section>;
}

export function Notice({ content }: { content: SiteContent['notice'] }) {
  return <aside className="notice" aria-labelledby="current-notice"><p className="notice__label">{content.label}</p><h3 id="current-notice">{content.title}</h3><p>{content.body}</p></aside>;
}

export function VisitSection({ content }: { content: SiteContent }) {
  const global = content.global;
  return <section className="visit" aria-label="Besuchsangaben"><div className="shell visit__grid">
    <article><Clock3 aria-hidden="true" /><p className="eyebrow eyebrow--dark">Öffnungszeiten</p><h2>Willkommen</h2>{global.openingTimes.map((line) => <p key={line}>{line}</p>)}</article>
    <article><Phone aria-hidden="true" /><p className="eyebrow eyebrow--dark">Vorbestellen</p><h2>Einfach anrufen</h2><p>{global.orderingNote}</p><a className="text-link" href={`tel:${global.phoneHref}`}>{global.phoneDisplay} <ArrowRight aria-hidden="true" /></a></article>
    <article><MapPin aria-hidden="true" /><p className="eyebrow eyebrow--dark">Hier finden Sie uns</p><h2>Kaltbrunn</h2><p>{global.addressStreet}<br />{global.addressPostalCity}</p><a className="text-link" href={global.mapUrl} target="_blank" rel="noreferrer">Route öffnen <ArrowRight aria-hidden="true" /></a></article>
  </div></section>;
}

export function PageLinks() {
  return <div className="next-pages"><div className="shell next-pages__grid"><Link href="/menue/"><span>01</span><strong>Menü</strong><ArrowRight aria-hidden="true" /></Link><Link href="/team/"><span>02</span><strong>Team</strong><ArrowRight aria-hidden="true" /></Link><Link href="/kontakt/"><span>03</span><strong>Kontakt</strong><ArrowRight aria-hidden="true" /></Link></div></div>;
}
