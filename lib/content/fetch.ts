import { asc, eq } from "drizzle-orm";
import { SITE_CONTENT_FIELDS } from "@/lib/content/keys";
import { db } from "@/lib/db";
import { site_content } from "@/lib/schema";
import { rewriteLegacyStorageUrl } from "@/lib/storage/legacy-url";
import type { ContentMap, ContentPage, ContentRow } from "@/types/content";

const DEFAULTS: ContentMap = Object.fromEntries(
  SITE_CONTENT_FIELDS.map((f) => [f.key, f.defaultValue]),
);

const dbConfigured = !!process.env.DATABASE_URL;

export async function getContentMap(page?: ContentPage): Promise<ContentMap> {
  if (!dbConfigured) return DEFAULTS;
  try {
    const q = db.select({ key: site_content.key, value: site_content.value }).from(site_content);
    const rows = page ? await q.where(eq(site_content.page, page)) : await q;
    const remote = Object.fromEntries(rows.map((r) => [r.key, rewriteLegacyStorageUrl(r.value)]));
    return { ...DEFAULTS, ...remote };
  } catch {
    return DEFAULTS;
  }
}

export async function getAllContentRows(): Promise<ContentRow[]> {
  if (!dbConfigured) return [];
  try {
    const rows = await db
      .select()
      .from(site_content)
      .orderBy(asc(site_content.page), asc(site_content.sort_order));
    return rows.map((r) => ({ ...r, value: rewriteLegacyStorageUrl(r.value) })) as ContentRow[];
  } catch {
    return [];
  }
}
