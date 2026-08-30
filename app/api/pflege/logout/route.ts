import { clearSessionCookie, revokeSession } from '@/lib/admin-auth';

export async function POST(request: Request): Promise<Response> {
  await revokeSession(request.headers.get('cookie'));
  return new Response(null, { status: 303, headers: { location: new URL('/pflege/', request.url).toString(), 'set-cookie': clearSessionCookie(), 'cache-control': 'no-store' } });
}
