import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { SiteContent } from '@/lib/site-content';

export const siteContent = sqliteTable('site_content', {
  id: text('id').primaryKey(),
  data: text('data', { mode: 'json' }).$type<SiteContent>().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  updatedBy: text('updated_by').notNull(),
});

export const mediaAssets = sqliteTable('media_assets', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  objectKey: text('object_key').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  createdBy: text('created_by').notNull(),
});

export type MediaAsset = typeof mediaAssets.$inferSelect;
