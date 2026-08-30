import type { Metadata } from 'next';
import { PageHero, PublicFrame } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.imprint, '/impressum/'); }

export default async function ImprintPage() {
  const content = await getSiteContent(); const g = content.global;
  return <PublicFrame content={content}><PageHero title={content.imprint.title} image={content.home.heroImage} /><section className="shell legal"><p className="eyebrow eyebrow--dark">{content.imprint.contactLabel}</p><h2>{g.companyName}</h2><address>{g.addressStreet}<br />{g.addressPostalCity}<br /><br />Telefon: <a href={`tel:${g.phoneHref}`}>{g.phoneDisplay}</a><br />Mail: <a href={`mailto:${g.emailImprint}`}>{g.emailImprint}</a></address></section></PublicFrame>;
}
