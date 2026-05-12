import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { EditorialPost } from "@/types/editorial";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function listAllPostsAdmin(): Promise<EditorialPost[]> {
  if (!supabaseConfigured) return [];
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("editorial_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data ?? []) as EditorialPost[];
}

export async function getPostByIdAdmin(id: string): Promise<EditorialPost | null> {
  if (!supabaseConfigured) return null;
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("editorial_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as EditorialPost | null) ?? null;
}
