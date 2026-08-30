import { headers } from 'next/headers';
import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';

export type AdminIdentity = { email: string; name: string; provider: 'cloudflare-access' | 'sites' };

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const requestHeaders = await headers();
  const accessEmail = requestHeaders.get('cf-access-authenticated-user-email');
  if (accessEmail) return { email: accessEmail, name: accessEmail, provider: 'cloudflare-access' };
  const sitesUser = await getChatGPTUser();
  if (!sitesUser) return null;
  const allowedEmails = (env.ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
  const isLocalPreview = sitesUser.email.endsWith('@sites.test');
  if (!isLocalPreview && !allowedEmails.includes(sitesUser.email.toLowerCase())) return null;
  return { email: sitesUser.email, name: sitesUser.displayName, provider: 'sites' };
}
