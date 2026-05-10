import { unstable_cache } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export const listProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const sb = await getSupabaseServer();
    const { data } = await sb.from("products").select("*").order("display_order");
    return (data ?? []) as Product[];
  },
  ["products-list"],
  { tags: ["products"], revalidate: 60 },
);

export const listExclusiveProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const sb = await getSupabaseServer();
    const { data } = await sb
      .from("products")
      .select("*")
      .eq("is_exclusive", true)
      .order("display_order")
      .limit(4);
    return (data ?? []) as Product[];
  },
  ["products-exclusive"],
  { tags: ["products"], revalidate: 60 },
);

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = await getSupabaseServer();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Product | null) ?? null;
}
