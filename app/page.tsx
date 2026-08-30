import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Notice, PageLinks, PublicFrame, VisitSection } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata((await getSiteContent()).seo.home, '/');
}

export default async function Home() {
  const content = await getSiteContent();
  return <PublicFrame content={content}>
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero__image" src={content.home.heroImage} alt="Frisch zubereiteter Burger mit Pommes" width="1600" height="733" fetchPriority="high" />
      <div className="hero__shade" />
      <div className="shell hero__content">
        <p className="eyebrow">{content.home.heroEyebrow}</p>
        <h1 id="hero-title">{content.home.heroTitle.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h1>
        <p className="hero__lead">{content.home.heroLead}</p>
        <div className="hero__actions"><Link className="button button--primary" href="/menue/">{content.labels.heroMenuCta} <ArrowRight aria-hidden="true" /></Link><a className="button button--glass" href={`tel:${content.global.phoneHref}`}><Phone aria-hidden="true" /> {content.global.phoneDisplay}</a></div>
      </div>
      <p className="hero__note">{content.global.restaurantName} · Kaltbrunn</p>
      <div className="hero__scroll" aria-hidden="true"><span /> {content.labels.heroScroll}</div>
    </section>
    <div className="marquee" aria-hidden="true"><div>{content.labels.marquee}</div></div>
    <section className="welcome shell section-grid" aria-labelledby="welcome-title" data-reveal>
      <div><p className="eyebrow eyebrow--dark">{content.home.welcomeEyebrow}</p><h2 id="welcome-title">{content.home.welcomeTitle}</h2><div className="prose">{content.home.welcomeParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><Link className="text-link text-link--large" href="/team/">{content.labels.homeTeamCta} <ArrowRight aria-hidden="true" /></Link></div>
      <Notice content={content.notice} />
      <figure className="feature-photo" data-reveal><img src={content.home.featureImage} alt={content.home.featureImageAlt} width="1200" height="800" loading="lazy" /><figcaption>{content.labels.homeFeatureCaption}</figcaption></figure>
    </section>
    <VisitSection content={content} /><PageLinks content={content} />
  </PublicFrame>;
}
