import { getSupabasePublic } from "@/lib/supabase/public";
import { DEMO_PRODUCTS } from "@/lib/products/demo";
import type { Product } from "@/types/product";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function listProducts(): Promise<Product[]> {
  if (!supabaseConfigured) return DEMO_PRODUCTS;
  try {
    const sb = getSupabasePublic();
    const { data } = await sb.from("products").select("*").order("display_order");
    return (data ?? []) as Product[];
  } catch {
    return [];
  }
}

export async function listExclusiveProducts(): Promise<Product[]> {
  if (!supabaseConfigured) return DEMO_PRODUCTS.filter((p) => p.is_exclusive).slice(0, 4);
  try {
    const sb = getSupabasePublic();
    const { data } = await sb
      .from("products")
      .select("*")
      .eq("is_exclusive", true)
      .order("display_order")
      .limit(4);
    return (data ?? []) as Product[];
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabaseConfigured) {
    return DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const sb = getSupabasePublic();
    const { data } = await sb
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return (data as Product | null) ?? null;
  } catch {
    return null;
  }
}
