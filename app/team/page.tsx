import type { Metadata } from 'next';
import { Notice, PageHero, PublicFrame } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.team, '/team/'); }

export default async function TeamPage() {
  const content = await getSiteContent();
  return <PublicFrame content={content}><PageHero title={content.team.title} image={content.team.heroImage} eyebrow={content.labels.teamEyebrow} indexLabel={content.labels.pageIndex} titlePath="team.title" imagePath="team.heroImage" eyebrowPath="labels.teamEyebrow" />
    <section className="shell section-grid team-intro" data-reveal><figure className="team-hero"><img src={content.team.heroImage} alt={content.team.heroImageAlt} width="1200" height="478" data-cms-image="team.heroImage" data-cms-alt="team.heroImageAlt" data-cms-label="Teambild" /></figure><Notice content={content.notice} /></section>
    <section className="shell team-grid" aria-label="Teammitglieder">{content.team.members.map((member, index) => <article key={`${member.name}-${index}`} data-reveal><div className="team-image"><img src={member.image} alt={member.alt} width="700" height="700" loading="lazy" data-cms-image={`team.members.${index}.image`} data-cms-alt={`team.members.${index}.alt`} data-cms-label={`Portrait ${member.name}`} /></div><p className="team-number">{String(index + 1).padStart(2, '0')}</p><h2 data-cms-text={`team.members.${index}.name`} data-cms-label={`Name ${index + 1}`}>{member.name}</h2><p data-cms-text={`team.members.${index}.description`} data-cms-label={`Beschreibung ${member.name}`}>{member.description}</p></article>)}</section>
  </PublicFrame>;
}
