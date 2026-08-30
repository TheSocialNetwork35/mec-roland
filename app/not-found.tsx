import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSiteContent } from '@/lib/content-store';
import { PublicFrame } from '@/components/public-sections';

export default async function NotFound() {
  const content = await getSiteContent();
  return <PublicFrame content={content}><section className="not-found"><div className="shell"><p className="eyebrow">404</p><h1>Diese Seite ist nicht auf der Karte.</h1><p>Der gesuchte Inhalt wurde nicht gefunden.</p><Link className="button button--primary" href="/"><ArrowLeft aria-hidden="true" /> Zur Startseite</Link></div></section></PublicFrame>;
}
