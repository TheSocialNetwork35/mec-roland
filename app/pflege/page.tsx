import { chatGPTSignInPath } from '@/app/chatgpt-auth';
import { AdminEditor } from '@/components/admin-editor';
import { getAdminIdentity } from '@/lib/admin-auth';
import { getSiteContent, listMedia } from '@/lib/content-store';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Website-Pflege', robots: { index: false, follow: false } };

export default async function PflegePage() {
  const user = await getAdminIdentity();
  if (!user) {
    return <main className="admin-auth"><div><img src="/media/99-Mec-Roland-Weiss-breit.png" alt="Mec Roland" width="425" height="215" /><p className="eyebrow">Geschützter Bereich</p><h1>Website-Pflege</h1><p>Für die Verwaltung ist eine Anmeldung erforderlich.</p><a className="button button--primary" href={chatGPTSignInPath('/pflege/') } target="_top">Sicher anmelden</a></div></main>;
  }
  const [content, media] = await Promise.all([getSiteContent(), listMedia()]);
  return <AdminEditor initialContent={content} initialMedia={media.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} user={user} />;
}
