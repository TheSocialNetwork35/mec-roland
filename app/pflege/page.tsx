import { VisualSiteEditor } from '@/components/visual-site-editor';
import Link from 'next/link';
import { getAdminIdentity } from '@/lib/admin-auth';
import { getSiteContent, listMedia } from '@/lib/content-store';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Website-Pflege',
  referrer: 'no-referrer',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default async function PflegePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getAdminIdentity();
  if (!user) {
    const { error } = await searchParams;
    const message = error === 'locked' ? 'Zu viele Versuche. Bitte in 15 Minuten erneut probieren.' : error === 'invalid' ? 'Das Passwort ist nicht korrekt.' : '';
    return <main className="admin-auth"><section className="admin-auth__card"><img src="/media/99-Mec-Roland-Weiss-breit.png" alt="Mec Roland" width="425" height="215" /><p className="eyebrow">Geschützter Bereich</p><h1>Website-Pflege</h1><p>Mit dem persönlichen Pflege-Passwort anmelden.</p><form action="/api/pflege/login" method="post"><label htmlFor="admin-password">Passwort</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required />{message && <p className="admin-auth__error" role="alert">{message}</p>}<button className="button button--primary" type="submit">Anmelden</button></form><Link className="admin-auth__back" href="/">Zur öffentlichen Website</Link></section></main>;
  }
  const [content, media] = await Promise.all([getSiteContent(), listMedia()]);
  return <VisualSiteEditor initialContent={content} initialMedia={media.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} user={user} />;
}
