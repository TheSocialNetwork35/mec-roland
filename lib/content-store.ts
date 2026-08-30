import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { mediaAssets, siteContent, type MediaAsset } from '@/db/schema';
import { defaultSiteContent, type SiteContent } from '@/lib/site-content';

const CONTENT_ID = 'main';

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const [record] = await getDb().select().from(siteContent).where(eq(siteContent.id, CONTENT_ID)).limit(1);
    if (!record?.data) return defaultSiteContent;
    return { ...defaultSiteContent, ...record.data, labels: { ...defaultSiteContent.labels, ...record.data.labels } };
  } catch {
    return defaultSiteContent;
  }
}

export async function saveSiteContent(data: SiteContent, email: string): Promise<void> {
  await ensureTables();
  await getDb().insert(siteContent).values({ id: CONTENT_ID, data, updatedAt: new Date(), updatedBy: email })
    .onConflictDoUpdate({ target: siteContent.id, set: { data, updatedAt: new Date(), updatedBy: email } });
}

export async function listMedia(): Promise<MediaAsset[]> {
  try { return await getDb().select().from(mediaAssets).orderBy(mediaAssets.createdAt); } catch { return []; }
}

export async function addMedia(asset: MediaAsset): Promise<void> {
  await ensureTables();
  await getDb().insert(mediaAssets).values(asset);
}

export async function findMedia(id: string): Promise<MediaAsset | null> {
  try {
    const [asset] = await getDb().select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
    return asset ?? null;
  } catch { return null; }
}

export async function removeMedia(id: string): Promise<MediaAsset | null> {
  const asset = await findMedia(id);
  if (!asset) return null;
  await env.FILES.delete(asset.objectKey);
  await getDb().delete(mediaAssets).where(eq(mediaAssets.id, id));
  return asset;
}

export async function ensureTables(): Promise<void> {
  const db = env.DB;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      updated_by TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY NOT NULL,
      filename TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      object_key TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL,
      created_by TEXT NOT NULL
    )`),
  ]);
}
