"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/guard";
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
  const sb = getSupabaseAdmin();
  const now = new Date().toISOString();

  const { error } = await sb.from("editorial_posts").insert(toRow(data, now));
  if (error) throw new Error(error.message);

  revalidateEditorialPaths(data.slug);
  redirect("/admin/editorial");
}

export async function updatePostAction(id: string, input: unknown) {
  await requireAdmin();
  const data = editorialSchema.parse(input);
  const sb = getSupabaseAdmin();
  const now = new Date().toISOString();

  // Preserve previous published_at if already published and still published.
  const { data: existing } = await sb
    .from("editorial_posts")
    .select("published, published_at")
    .eq("id", id)
    .maybeSingle();

  const row = toRow(data, now);
  if (data.published && existing?.published && existing?.published_at) {
    row.published_at = existing.published_at;
  }

  const { error } = await sb.from("editorial_posts").update(row).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateEditorialPaths(data.slug);
  redirect("/admin/editorial");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const sb = getSupabaseAdmin();
  const { data: post } = await sb
    .from("editorial_posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await sb.from("editorial_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateEditorialPaths(post?.slug ?? null);
}
