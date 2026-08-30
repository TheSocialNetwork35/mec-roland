import { clearSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request): Promise<Response> {
  return new Response(null, { status: 303, headers: { location: new URL('/pflege/', request.url).toString(), 'set-cookie': clearSessionCookie(), 'cache-control': 'no-store' } });
}
