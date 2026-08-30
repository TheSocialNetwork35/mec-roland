import { env } from 'cloudflare:workers';

const FALLBACK_SITE_URL = 'https://mec-roland.ch';

export function getSiteUrl(): string {
  const configured = env.SITE_URL || process.env.SITE_URL || FALLBACK_SITE_URL;
  try {
    const url = new URL(configured);
    return `${url.protocol}//${url.host}`;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function absoluteSiteUrl(path = '/'): string {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
