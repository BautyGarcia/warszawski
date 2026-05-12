import { getSupabasePublic } from "@/lib/supabase/public";
import type { EditorialPost } from "@/types/editorial";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function listPublishedPosts(): Promise<EditorialPost[]> {
  if (!supabaseConfigured) return [];
  try {
    const sb = getSupabasePublic();
    const { data } = await sb
      .from("editorial_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return (data ?? []) as EditorialPost[];
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<EditorialPost | null> {
  if (!supabaseConfigured) return null;
  try {
    const sb = getSupabasePublic();
    const { data } = await sb
      .from("editorial_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return (data as EditorialPost | null) ?? null;
  } catch {
    return null;
  }
}
