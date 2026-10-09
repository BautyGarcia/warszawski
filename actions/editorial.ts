"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { editorial_posts } from "@/lib/schema";
import { editorialSchema, type EditorialInput } from "@/schemas/editorial";

function nullify(v: string): string | null {
  return v.trim().length === 0 ? null : v;
}

function toRow(input: EditorialInput, now: string) {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: nullify(input.excerpt),
    content: input.content,
    cover_image: nullify(input.cover_image),
    author_name: input.author_name || "Warszawski",
    published: input.published,
    published_at: input.published ? now : null,
    seo_title: nullify(input.seo_title),
    seo_description: nullify(input.seo_description),
    updated_at: now,
  };
}

function revalidateEditorialPaths(slug?: string | null) {
  revalidatePath("/editorial");
  if (slug) revalidatePath(`/editorial/${slug}`);
  revalidatePath("/admin/editorial");
}

export async function createPostAction(input: unknown) {
  await requireAdmin();
  const data = editorialSchema.parse(input);
  const now = new Date().toISOString();

  await db.insert(editorial_posts).values(toRow(data, now));

  revalidateEditorialPaths(data.slug);
  redirect("/admin/editorial");
}

export async function updatePostAction(id: string, input: unknown) {
  await requireAdmin();
  const data = editorialSchema.parse(input);
  const now = new Date().toISOString();

  // Preserve previous published_at if already published and still published.
  const [existing] = await db
    .select({ published: editorial_posts.published, published_at: editorial_posts.published_at })
    .from(editorial_posts)
    .where(eq(editorial_posts.id, id))
    .limit(1);

  const row = toRow(data, now);
  if (data.published && existing?.published && existing?.published_at) {
    row.published_at = existing.published_at;
  }

  await db.update(editorial_posts).set(row).where(eq(editorial_posts.id, id));

  revalidateEditorialPaths(data.slug);
  redirect("/admin/editorial");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const [post] = await db
    .select({ slug: editorial_posts.slug })
    .from(editorial_posts)
    .where(eq(editorial_posts.id, id))
    .limit(1);

  await db.delete(editorial_posts).where(eq(editorial_posts.id, id));

  revalidateEditorialPaths(post?.slug ?? null);
}
