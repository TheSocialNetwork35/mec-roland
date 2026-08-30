import { createSessionCookie, getLoginRateLimit, recordLoginAttempt, verifyAdminPassword } from '@/lib/admin-auth';

export async function POST(request: Request): Promise<Response> {
  if (Number(request.headers.get('content-length') || 0) > 4096) return new Response('Anfrage zu gross', { status: 413 });
  const preflight = await getLoginRateLimit(request);
  if (!preflight.allowed) return redirect(request, 'locked', preflight.retryAfter);
  const form = await request.formData();
  const password = form.get('password');
  const valid = typeof password === 'string' && await verifyAdminPassword(password);
  const rateLimit = await recordLoginAttempt(request, valid);
  if (!valid) return redirect(request, rateLimit.allowed ? 'invalid' : 'locked', rateLimit.retryAfter);
  const response = redirect(request);
  response.headers.append('set-cookie', await createSessionCookie());
  return response;
}

function redirect(request: Request, error?: 'invalid' | 'locked', retryAfter?: number): Response {
  const target = new URL('/pflege/', request.url);
  if (error) target.searchParams.set('error', error);
  const headers = new Headers({ location: target.toString(), 'cache-control': 'no-store' });
  if (retryAfter) headers.set('retry-after', String(retryAfter));
  return new Response(null, { status: 303, headers });
}
