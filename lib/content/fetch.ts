import { unstable_cache } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { SITE_CONTENT_FIELDS } from "@/lib/content/keys";
import type { ContentMap, ContentRow } from "@/types/content";

const DEFAULTS: ContentMap = Object.fromEntries(
  SITE_CONTENT_FIELDS.map((f) => [f.key, f.defaultValue]),
);

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getContentMap = unstable_cache(
  async (page?: "home" | "about"): Promise<ContentMap> => {
    if (!supabaseConfigured) return DEFAULTS;
    try {
      const sb = await getSupabaseServer();
      const q = sb.from("site_content").select("key,value");
      const { data, error } = page ? await q.eq("page", page) : await q;
      if (error || !data) return DEFAULTS;
      const remote = Object.fromEntries(data.map((r) => [r.key, r.value]));
      return { ...DEFAULTS, ...remote };
    } catch {
      return DEFAULTS;
    }
  },
  ["content-map"],
  { tags: ["content"], revalidate: 60 },
);

export async function getAllContentRows(): Promise<ContentRow[]> {
  if (!supabaseConfigured) return [];
  try {
    const sb = await getSupabaseServer();
    const { data } = await sb
      .from("site_content")
      .select("*")
      .order("page")
      .order("sort_order");
    return (data ?? []) as ContentRow[];
  } catch {
    return [];
  }
}
