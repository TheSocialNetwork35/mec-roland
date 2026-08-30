import { env } from 'cloudflare:workers';
import { headers } from 'next/headers';

export type AdminIdentity = { email: string; name: string; provider: 'password' };

const COOKIE_NAME = 'mec_admin_session';
const SESSION_LIFETIME_SECONDS = 12 * 60 * 60;
const encoder = new TextEncoder();
type LoginRecord = { attempts: number; window_started: number; blocked_until: number };

function runtimePassword(): string {
  return env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '';
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  const requestHeaders = await headers();
  const token = readCookie(requestHeaders.get('cookie'), COOKIE_NAME);
  if (!token) return null;
  try {
    const record = await env.DB.prepare('SELECT expires_at FROM admin_sessions WHERE token_hash = ?').bind(await sha256(token)).first<{ expires_at: number }>();
    if (!record || record.expires_at <= Math.floor(Date.now() / 1000)) return null;
    return { email: 'pflege@mec-roland.ch', name: 'Mec Roland', provider: 'password' };
  } catch { return null; }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const configuredPassword = runtimePassword();
  if (!configuredPassword || configuredPassword.length > 256 || password.length > 256) return false;
  const [actual, expected] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(password)),
    crypto.subtle.digest('SHA-256', encoder.encode(configuredPassword)),
  ]);
  return constantTimeEqual(new Uint8Array(actual), new Uint8Array(expected));
}

export async function createSessionCookie(): Promise<string> {
  await ensureAuthTables();
  const expires = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS;
  const random = crypto.getRandomValues(new Uint8Array(32));
  const token = toBase64Url(random.buffer);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').bind(Math.floor(Date.now() / 1000)),
    env.DB.prepare('INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, ?)').bind(await sha256(token), expires),
  ]);
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_LIFETIME_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function revokeSession(cookieHeader: string | null): Promise<void> {
  const token = readCookie(cookieHeader, COOKIE_NAME);
  if (!token) return;
  try { await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(await sha256(token)).run(); } catch { /* A cleared cookie still ends the browser session. */ }
}

export async function getLoginRateLimit(request: Request): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = Math.floor(Date.now() / 1000);
  const { record } = await findLoginRecord(request);
  return record?.blocked_until && record.blocked_until > now ? { allowed: false, retryAfter: record.blocked_until - now } : { allowed: true };
}

export async function recordLoginAttempt(request: Request, success: boolean): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = Math.floor(Date.now() / 1000);
  const { key, record } = await findLoginRecord(request);
  if (success) {
    await env.DB.prepare('DELETE FROM admin_login_attempts WHERE key_hash = ?').bind(key).run();
    return { allowed: true };
  }
  const windowStarted = record && now - record.window_started < 15 * 60 ? record.window_started : now;
  const attempts = record && windowStarted === record.window_started ? record.attempts + 1 : 1;
  const blockedUntil = attempts >= 5 ? now + 15 * 60 : 0;
  await env.DB.prepare(`INSERT INTO admin_login_attempts (key_hash, attempts, window_started, blocked_until) VALUES (?, ?, ?, ?)
    ON CONFLICT(key_hash) DO UPDATE SET attempts = excluded.attempts, window_started = excluded.window_started, blocked_until = excluded.blocked_until`)
    .bind(key, attempts, windowStarted, blockedUntil).run();
  return { allowed: blockedUntil === 0, retryAfter: blockedUntil ? 15 * 60 : undefined };
}

async function findLoginRecord(request: Request): Promise<{ key: string; record: LoginRecord | null }> {
  await ensureAuthTables();
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const key = await sha256(`mec-roland-login-rate-v2:${ip}`);
  const record = await env.DB.prepare('SELECT attempts, window_started, blocked_until FROM admin_login_attempts WHERE key_hash = ?').bind(key).first<LoginRecord>();
  return { key, record };
}

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return value.join('=');
  }
  return null;
}

async function ensureAuthTables(): Promise<void> {
  await env.DB.batch([
    env.DB.prepare('CREATE TABLE IF NOT EXISTS admin_login_attempts (key_hash TEXT PRIMARY KEY NOT NULL, attempts INTEGER NOT NULL, window_started INTEGER NOT NULL, blocked_until INTEGER NOT NULL)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS admin_sessions (token_hash TEXT PRIMARY KEY NOT NULL, expires_at INTEGER NOT NULL)'),
  ]);
}

async function sha256(value: string): Promise<string> { return toBase64Url(await crypto.subtle.digest('SHA-256', encoder.encode(value))); }
function toBase64Url(value: ArrayBuffer): string { return btoa(String.fromCharCode(...new Uint8Array(value))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function constantTimeEqual(actual: Uint8Array, expected: Uint8Array): boolean {
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index];
  return difference === 0;
}
