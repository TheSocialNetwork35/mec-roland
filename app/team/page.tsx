import type { Metadata } from 'next';
import { Notice, PageHero, PublicFrame, VisitSection } from '@/components/public-sections';
import { getSiteContent } from '@/lib/content-store';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> { return pageMetadata((await getSiteContent()).seo.team, '/team/'); }

export default async function TeamPage() {
  const content = await getSiteContent();
  return <PublicFrame content={content}><PageHero title={content.team.title} image={content.home.heroImage} eyebrow="Mit Freude und Leidenschaft" />
    <section className="shell section-grid team-intro"><figure className="team-hero"><img src={content.team.heroImage} alt={content.team.heroImageAlt} width="1200" height="478" /></figure><Notice content={content.notice} /></section>
    <section className="shell team-grid" aria-label="Teammitglieder">{content.team.members.map((member) => <article key={member.name}><img src={member.image} alt={member.alt} width="700" height="700" loading="lazy" /><p className="team-number">{String(content.team.members.indexOf(member) + 1).padStart(2, '0')}</p><h2>{member.name}</h2><p>{member.description}</p></article>)}</section>
    <VisitSection content={content} /></PublicFrame>;
}
