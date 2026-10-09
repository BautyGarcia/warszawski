import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { editorial_posts } from "@/lib/schema";
import { rewriteLegacyStorageUrl } from "@/lib/storage/legacy-url";
import type { EditorialPost } from "@/types/editorial";

const dbConfigured = !!process.env.DATABASE_URL;

export function withCurrentCoverUrl(p: EditorialPost): EditorialPost {
  return { ...p, cover_image: rewriteLegacyStorageUrl(p.cover_image) };
}

// Public reads only see published posts (was the "editorial public read" RLS policy on Supabase).
export async function listPublishedPosts(): Promise<EditorialPost[]> {
  if (!dbConfigured) return [];
  try {
    const rows = await db
      .select()
      .from(editorial_posts)
      .where(eq(editorial_posts.published, true))
      .orderBy(desc(editorial_posts.published_at));
    return rows.map(withCurrentCoverUrl);
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<EditorialPost | null> {
  if (!dbConfigured) return null;
  try {
    const [row] = await db
      .select()
      .from(editorial_posts)
      .where(and(eq(editorial_posts.slug, slug), eq(editorial_posts.published, true)))
      .limit(1);
    return row ? withCurrentCoverUrl(row) : null;
  } catch {
    return null;
  }
}
