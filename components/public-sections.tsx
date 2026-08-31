import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, Phone } from 'lucide-react';
import type { SiteContent } from '@/lib/site-content';
import { SiteFooter, SiteHeader } from '@/components/site-shell';
import { MotionLayer } from '@/components/motion-layer';

export function PublicFrame({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <><SiteHeader content={content.global} /><main id="main-content">{children}</main><SiteFooter content={content} /><MotionLayer /></>;
}

export function PageHero({ title, image, eyebrow, indexLabel, titlePath, imagePath, eyebrowPath }: { title: string; image: string; eyebrow: string; indexLabel: string; titlePath: string; imagePath: string; eyebrowPath: string }) {
  return <section className="page-hero"><img src={image} alt="" width="1600" height="733" fetchPriority="high" data-cms-image={imagePath} data-cms-label="Seitenbild" /><div className="page-hero__shade" /><div className="page-hero__index" data-cms-text="labels.pageIndex" data-cms-label="Seitenindex">{indexLabel}</div><div className="shell"><p className="eyebrow" data-cms-text={eyebrowPath} data-cms-label="Seiten-Kicker">{eyebrow}</p><h1 data-cms-text={titlePath} data-cms-label="Seitentitel">{title}</h1><span className="page-hero__line" /></div></section>;
}

export function Notice({ content }: { content: SiteContent['notice'] }) {
  return <aside className="notice" aria-labelledby="current-notice" data-reveal><p className="notice__label" data-cms-text="notice.label" data-cms-label="Meldungs-Label">{content.label}</p><h3 id="current-notice" data-cms-text="notice.title" data-cms-label="Meldungs-Titel">{content.title}</h3><p data-cms-text="notice.body" data-cms-label="Meldungs-Text">{content.body}</p></aside>;
}

export function VisitSection({ content }: { content: SiteContent }) {
  const global = content.global;
  return <section className="visit" aria-label="Besuchsangaben" data-reveal><div className="shell visit__grid">
    <article><Clock3 aria-hidden="true" /><p className="eyebrow eyebrow--dark" data-cms-text="labels.visitHoursEyebrow" data-cms-label="Öffnungszeiten-Kicker">{content.labels.visitHoursEyebrow}</p><h2 data-cms-text="labels.visitHoursTitle" data-cms-label="Öffnungszeiten-Titel">{content.labels.visitHoursTitle}</h2>{global.openingTimes.map((line, index) => <p key={`${line}-${index}`} data-cms-text={`global.openingTimes.${index}`} data-cms-label={`Öffnungszeit ${index + 1}`}>{line}</p>)}</article>
    <article><Phone aria-hidden="true" /><p className="eyebrow eyebrow--dark" data-cms-text="labels.visitOrderEyebrow" data-cms-label="Vorbestellen-Kicker">{content.labels.visitOrderEyebrow}</p><h2 data-cms-text="labels.visitOrderTitle" data-cms-label="Vorbestellen-Titel">{content.labels.visitOrderTitle}</h2><p data-cms-text="global.orderingNote" data-cms-label="Vorbestell-Hinweis">{global.orderingNote}</p><a className="text-link" href={`tel:${global.phoneHref}`} data-cms-link="global.phoneHref" data-cms-label="Telefon-Link"><span data-cms-text="global.phoneDisplay" data-cms-label="Telefonnummer">{global.phoneDisplay}</span> <ArrowRight aria-hidden="true" /></a></article>
    <article><MapPin aria-hidden="true" /><p className="eyebrow eyebrow--dark" data-cms-text="labels.visitPlaceEyebrow" data-cms-label="Ort-Kicker">{content.labels.visitPlaceEyebrow}</p><h2 data-cms-text="labels.visitPlaceTitle" data-cms-label="Ort-Titel">{content.labels.visitPlaceTitle}</h2><p><span data-cms-text="global.addressStreet" data-cms-label="Strasse">{global.addressStreet}</span><br /><span data-cms-text="global.addressPostalCity" data-cms-label="PLZ und Ort">{global.addressPostalCity}</span></p><a className="text-link" href={global.mapUrl} target="_blank" rel="noreferrer" data-cms-link="global.mapUrl" data-cms-label="Google-Maps-Link"><span data-cms-text="labels.routeCta" data-cms-label="Routen-Linktext">{content.labels.routeCta}</span> <ArrowRight aria-hidden="true" /></a></article>
  </div></section>;
}

export function PageLinks({ content }: { content: SiteContent }) {
  const links = content.global.navigation.filter((item) => ['/menue/', '/team/', '/kontakt/'].includes(item.href));
  return <div className="next-pages"><div className="shell next-pages__grid">{links.map((item, index) => { const sourceIndex = content.global.navigation.findIndex((entry) => entry.href === item.href); return <Link href={item.href} key={item.href} data-cms-link={`global.navigation.${sourceIndex}.href`} data-cms-label={`Linkziel ${item.label}`}><span>{String(index + 1).padStart(2, '0')}</span><strong data-cms-text={`global.navigation.${sourceIndex}.label`} data-cms-label={`Navigation: ${item.label}`}>{item.label}</strong><ArrowRight aria-hidden="true" /></Link>; })}</div></div>;
}
