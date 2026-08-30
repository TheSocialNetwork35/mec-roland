import type { Metadata } from 'next';
import { Notice, PageHero, PublicFrame } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.team, '/team/'); }

export default async function TeamPage() {
  const content = await getSiteContent();
  return <PublicFrame content={content}><PageHero title={content.team.title} image={content.team.heroImage} eyebrow={content.labels.teamEyebrow} indexLabel={content.labels.pageIndex} />
    <section className="shell section-grid team-intro" data-reveal><figure className="team-hero"><img src={content.team.heroImage} alt={content.team.heroImageAlt} width="1200" height="478" /></figure><Notice content={content.notice} /></section>
    <section className="shell team-grid" aria-label="Teammitglieder">{content.team.members.map((member, index) => <article key={member.name} data-reveal><div className="team-image"><img src={member.image} alt={member.alt} width="700" height="700" loading="lazy" /></div><p className="team-number">{String(index + 1).padStart(2, '0')}</p><h2>{member.name}</h2><p>{member.description}</p></article>)}</section>
  </PublicFrame>;
}
