import { getAdminIdentity } from '@/lib/admin-auth';
import { removeMedia } from '@/lib/content-store';

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  if (!(await getAdminIdentity())) return Response.json({ error: 'Nicht autorisiert' }, { status: 401 });
  const { id } = await context.params;
  const removed = await removeMedia(id);
  if (!removed) return Response.json({ error: 'Datei nicht gefunden' }, { status: 404 });
  return Response.json({ ok: true });
}
