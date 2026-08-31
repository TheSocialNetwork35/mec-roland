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
  const marqueeWords = content.labels.marquee
    .split('·')
    .map((word) => word.trim())
    .filter(Boolean);
  const marqueeSequence = Array.from(
    { length: 12 },
    () => marqueeWords.length > 0 ? marqueeWords : [content.labels.marquee],
  ).flat();

  return <PublicFrame content={content}>
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero__image" src={content.home.heroImage} alt="Frisch zubereiteter Burger mit Pommes" width="1600" height="733" fetchPriority="high" data-cms-image="home.heroImage" data-cms-label="Hero-Bild" />
      <div className="hero__shade" />
      <div className="shell hero__content">
        <p className="eyebrow" data-cms-text="home.heroEyebrow" data-cms-label="Hero-Kicker">{content.home.heroEyebrow}</p>
        <h1 id="hero-title" data-cms-text="home.heroTitle" data-cms-label="Hero-Titel">{content.home.heroTitle.split('\n').map((line, index) => <span key={`${line}-${index}`}>{line}<br /></span>)}</h1>
        <p className="hero__lead" data-cms-text="home.heroLead" data-cms-label="Hero-Einleitung">{content.home.heroLead}</p>
        <div className="hero__actions"><Link className="button button--primary" href="/menue/"><span data-cms-text="labels.heroMenuCta" data-cms-label="Menü-Button">{content.labels.heroMenuCta}</span> <ArrowRight aria-hidden="true" /></Link><a className="button button--glass" href={`tel:${content.global.phoneHref}`} data-cms-link="global.phoneHref" data-cms-label="Telefon-Link"><Phone aria-hidden="true" /> <span data-cms-text="global.phoneDisplay" data-cms-label="Telefonnummer">{content.global.phoneDisplay}</span></a></div>
      </div>
      <p className="hero__note"><span data-cms-text="global.restaurantName" data-cms-label="Restaurantname">{content.global.restaurantName}</span> · Kaltbrunn</p>
      <div className="hero__scroll" aria-hidden="true"><span /> <span data-cms-text="labels.heroScroll" data-cms-label="Scroll-Hinweis">{content.labels.heroScroll}</span></div>
    </section>
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((group) => <div className="marquee__group" key={group} data-cms-text="labels.marquee" data-cms-label="Laufband-Text">{marqueeSequence.map((word, index) => <span className="marquee__item" key={`${group}-${index}`}>{word}</span>)}</div>)}
      </div>
    </div>
    <section className="welcome shell section-grid" aria-labelledby="welcome-title" data-reveal>
      <div><p className="eyebrow eyebrow--dark" data-cms-text="home.welcomeEyebrow" data-cms-label="Willkommen-Kicker">{content.home.welcomeEyebrow}</p><h2 id="welcome-title" data-cms-text="home.welcomeTitle" data-cms-label="Willkommen-Titel">{content.home.welcomeTitle}</h2><div className="prose">{content.home.welcomeParagraphs.map((paragraph, index) => <p key={`${paragraph}-${index}`} data-cms-text={`home.welcomeParagraphs.${index}`} data-cms-label={`Willkommen-Absatz ${index + 1}`}>{paragraph}</p>)}</div><Link className="text-link text-link--large" href="/team/"><span data-cms-text="labels.homeTeamCta" data-cms-label="Team-Linktext">{content.labels.homeTeamCta}</span> <ArrowRight aria-hidden="true" /></Link></div>
      <Notice content={content.notice} />
      <figure className="feature-photo" data-reveal><img src={content.home.featureImage} alt={content.home.featureImageAlt} width="1200" height="800" loading="lazy" data-cms-image="home.featureImage" data-cms-alt="home.featureImageAlt" data-cms-label="Startseiten-Foto" /><figcaption data-cms-text="labels.homeFeatureCaption" data-cms-label="Bildlegende">{content.labels.homeFeatureCaption}</figcaption></figure>
    </section>
    <VisitSection content={content} /><PageLinks content={content} />
  </PublicFrame>;
}
