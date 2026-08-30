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
        <div className="hero__actions"><Link className="button button--primary" href="/menue/">Speisekarte entdecken <ArrowRight aria-hidden="true" /></Link><a className="button button--glass" href={`tel:${content.global.phoneHref}`}><Phone aria-hidden="true" /> {content.global.phoneDisplay}</a></div>
      </div>
      <p className="hero__note">{content.global.restaurantName} · Kaltbrunn</p>
    </section>
    <section className="welcome shell section-grid" aria-labelledby="welcome-title">
      <div><p className="eyebrow eyebrow--dark">{content.home.welcomeEyebrow}</p><h2 id="welcome-title">{content.home.welcomeTitle}</h2><div className="prose">{content.home.welcomeParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
      <Notice content={content.notice} />
      <figure className="feature-photo"><img src={content.home.featureImage} alt={content.home.featureImageAlt} width="1200" height="800" loading="lazy" /></figure>
    </section>
    <VisitSection content={content} /><PageLinks />
  </PublicFrame>;
}
