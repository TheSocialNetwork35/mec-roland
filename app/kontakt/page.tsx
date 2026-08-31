import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Notice, PageHero, PublicFrame } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.contact, '/kontakt/'); }

export default async function ContactPage() {
  const content = await getSiteContent(); const g = content.global;
  return <PublicFrame content={content}><PageHero title={content.contact.title} image={content.home.featureImage} eyebrow={content.labels.contactEyebrow} indexLabel={content.labels.pageIndex} titlePath="contact.title" imagePath="home.featureImage" eyebrowPath="labels.contactEyebrow" />
    <section className="shell section-grid page-intro" data-reveal><div><div className="prose prose--lead">{content.contact.paragraphs.map((p, index) => <p key={`${p}-${index}`} data-cms-text={`contact.paragraphs.${index}`} data-cms-label={`Kontakt-Absatz ${index + 1}`}>{p}</p>)}<p className="capacity" data-cms-text="contact.capacity" data-cms-label="Kapazität">{content.contact.capacity}</p></div><address className="contact-card"><h2 data-cms-text="contact.addressLabel" data-cms-label="Adress-Titel">{content.contact.addressLabel}</h2><p><MapPin aria-hidden="true" /> <span><span data-cms-text="global.companyName" data-cms-label="Firmenname">{g.companyName}</span><br /><span data-cms-text="global.addressStreet" data-cms-label="Strasse">{g.addressStreet}</span><br /><span data-cms-text="global.addressPostalCity" data-cms-label="PLZ und Ort">{g.addressPostalCity}</span></span></p><a href={`tel:${g.phoneHref}`} data-cms-link="global.phoneHref" data-cms-label="Telefon-Link"><Phone aria-hidden="true" /> <span data-cms-text="global.phoneDisplay" data-cms-label="Telefonnummer">{g.phoneDisplay}</span></a><a href={`mailto:${g.emailPrimary}`} data-cms-link="global.emailPrimary" data-cms-label="E-Mail-Link"><Mail aria-hidden="true" /> <span data-cms-text="global.emailPrimary" data-cms-label="E-Mail-Adresse">{g.emailPrimary}</span></a></address></div><Notice content={content.notice} /></section>
    <section className="map-block shell" data-reveal><a href={g.mapUrl} target="_blank" rel="noreferrer" data-cms-link="global.mapUrl" data-cms-label="Google-Maps-Link"><img src={g.mapImage} alt={`Karte zur ${g.addressStreet} in ${g.addressPostalCity}`} width="600" height="483" loading="lazy" data-cms-image="global.mapImage" data-cms-label="Kartenbild" /><span data-cms-text="labels.mapCta" data-cms-label="Karten-Linktext">{content.labels.mapCta}</span></a></section></PublicFrame>;
}
