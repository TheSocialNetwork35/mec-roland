import { getAdminIdentity } from '@/lib/admin-auth';
import { getSiteContent, saveSiteContent } from '@/lib/content-store';
import { siteContentSchema } from '@/lib/content-schema';
import { z } from 'zod';

export async function GET(): Promise<Response> {
  if (!(await getAdminIdentity())) return Response.json({ error: 'Nicht autorisiert' }, { status: 401 });
  return Response.json(await getSiteContent());
}

export async function PUT(request: Request): Promise<Response> {
  const user = await getAdminIdentity();
  if (!user) return Response.json({ error: 'Nicht autorisiert' }, { status: 401 });
  const parsed = siteContentSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: 'Ungültige Inhalte', details: z.treeifyError(parsed.error) }, { status: 400 });
  await saveSiteContent(parsed.data, user.email);
  return Response.json({ ok: true, updatedAt: new Date().toISOString() });
}
