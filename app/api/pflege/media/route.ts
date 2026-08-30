import { env } from 'cloudflare:workers';
import { getAdminIdentity } from '@/lib/admin-auth';
import { addMedia, listMedia } from '@/lib/content-store';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']);
const MAX_BYTES = 20 * 1024 * 1024;

export async function GET(): Promise<Response> {
  if (!(await getAdminIdentity())) return Response.json({ error: 'Nicht autorisiert' }, { status: 401 });
  return Response.json(await listMedia());
}

export async function POST(request: Request): Promise<Response> {
  const user = await getAdminIdentity();
  if (!user) return Response.json({ error: 'Nicht autorisiert' }, { status: 401 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Keine Datei ausgewählt' }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) return Response.json({ error: 'Nur JPG, PNG, WebP, AVIF und PDF sind erlaubt.' }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: 'Die Datei ist grösser als 20 MB.' }, { status: 413 });

  const id = crypto.randomUUID();
  const safeName = file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'datei';
  const objectKey = `uploads/${id}/${safeName}`;
  await env.FILES.put(objectKey, file.stream(), { httpMetadata: { contentType: file.type, contentDisposition: 'inline' }, customMetadata: { originalName: file.name, uploadedBy: user.email } });
  const asset = { id, filename: file.name, contentType: file.type, size: file.size, objectKey, createdAt: new Date(), createdBy: user.email };
  await addMedia(asset);
  return Response.json({ ...asset, url: `/media-file/${id}` }, { status: 201 });
}
