import { env } from 'cloudflare:workers';
import { findMedia } from '@/lib/content-store';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;
  const asset = await findMedia(id);
  if (!asset) return new Response('Nicht gefunden', { status: 404 });
  const object = await env.FILES.get(asset.objectKey);
  if (!object) return new Response('Nicht gefunden', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('x-content-type-options', 'nosniff');
  return new Response(object.body, { headers });
}
