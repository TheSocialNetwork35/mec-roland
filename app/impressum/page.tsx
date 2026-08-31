import type { Metadata } from 'next';
import { PageHero, PublicFrame } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.imprint, '/impressum/'); }

export default async function ImprintPage() {
  const content = await getSiteContent(); const g = content.global;
  return <PublicFrame content={content}><PageHero title={content.imprint.title} image={content.home.featureImage} eyebrow={content.labels.imprintEyebrow} indexLabel={content.labels.pageIndex} titlePath="imprint.title" imagePath="home.featureImage" eyebrowPath="labels.imprintEyebrow" /><section className="shell legal" data-reveal><p className="eyebrow eyebrow--dark" data-cms-text="imprint.contactLabel" data-cms-label="Kontakt-Überschrift">{content.imprint.contactLabel}</p><h2 data-cms-text="global.companyName" data-cms-label="Firmenname">{g.companyName}</h2><address><span data-cms-text="global.addressStreet" data-cms-label="Strasse">{g.addressStreet}</span><br /><span data-cms-text="global.addressPostalCity" data-cms-label="PLZ und Ort">{g.addressPostalCity}</span><br /><br /><span data-cms-text="labels.legalPhone" data-cms-label="Telefon-Label">{content.labels.legalPhone}</span>: <a href={`tel:${g.phoneHref}`} data-cms-link="global.phoneHref" data-cms-label="Telefon-Link"><span data-cms-text="global.phoneDisplay" data-cms-label="Telefonnummer">{g.phoneDisplay}</span></a><br /><span data-cms-text="labels.legalEmail" data-cms-label="E-Mail-Label">{content.labels.legalEmail}</span>: <a href={`mailto:${g.emailImprint}`} data-cms-link="global.emailImprint" data-cms-label="Impressum-E-Mail-Link"><span data-cms-text="global.emailImprint" data-cms-label="Impressum-E-Mail">{g.emailImprint}</span></a></address></section></PublicFrame>;
}
