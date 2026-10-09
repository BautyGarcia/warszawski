import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { withCurrentCoverUrl } from "@/lib/editorial/queries";
import { editorial_posts } from "@/lib/schema";
import type { EditorialPost } from "@/types/editorial";

const dbConfigured = !!process.env.DATABASE_URL;

export async function listAllPostsAdmin(): Promise<EditorialPost[]> {
  if (!dbConfigured) return [];
  const rows = await db.select().from(editorial_posts).orderBy(desc(editorial_posts.updated_at));
  return rows.map(withCurrentCoverUrl);
}

export async function getPostByIdAdmin(id: string): Promise<EditorialPost | null> {
  if (!dbConfigured) return null;
  const [row] = await db.select().from(editorial_posts).where(eq(editorial_posts.id, id)).limit(1);
  return row ? withCurrentCoverUrl(row) : null;
}
