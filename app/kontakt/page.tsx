import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Notice, PageHero, PublicFrame, VisitSection } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.contact, '/kontakt/'); }

export default async function ContactPage() {
  const content = await getSiteContent(); const g = content.global;
  return <PublicFrame content={content}><PageHero title={content.contact.title} image={content.home.heroImage} eyebrow="Wir freuen uns auf Sie" />
    <section className="shell section-grid page-intro"><div><div className="prose prose--lead">{content.contact.paragraphs.map((p) => <p key={p}>{p}</p>)}<p className="capacity">{content.contact.capacity}</p></div><address className="contact-card"><h2>{content.contact.addressLabel}</h2><p><MapPin aria-hidden="true" /> {g.companyName}<br />{g.addressStreet}<br />{g.addressPostalCity}</p><a href={`tel:${g.phoneHref}`}><Phone aria-hidden="true" /> {g.phoneDisplay}</a><a href={`mailto:${g.emailPrimary}`}><Mail aria-hidden="true" /> {g.emailPrimary}</a></address></div><Notice content={content.notice} /></section>
    <section className="map-block shell"><a href={g.mapUrl} target="_blank" rel="noreferrer"><img src={g.mapImage} alt={`Karte zur ${g.addressStreet} in ${g.addressPostalCity}`} width="600" height="483" loading="lazy" /><span>Route in Google Maps öffnen</span></a></section><VisitSection content={content} /></PublicFrame>;
}
