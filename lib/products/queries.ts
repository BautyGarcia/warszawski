import { getSupabasePublic } from "@/lib/supabase/public";
import { DEMO_PRODUCTS } from "@/lib/products/demo";
import type { Product } from "@/types/product";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Products saved before per-color images have colors without ids and images
// without colorId. Give each legacy color a stable, deterministic fallback id
// (positional, so SSR and client agree) so the color picker keys correctly;
// legacy images stay general (colorId null) and fall back gracefully.
function normalizeProduct(p: Product): Product {
  return {
    ...p,
    available_colors: (p.available_colors ?? []).map((c, i) => ({
      ...c,
      id: c.id || `c${i}`,
    })),
    images: (p.images ?? []).map((img) => ({ ...img, colorId: img.colorId ?? null })),
  };
}

export async function listProducts(): Promise<Product[]> {
  if (!supabaseConfigured) return DEMO_PRODUCTS;
  try {
    const sb = getSupabasePublic();
    const { data } = await sb.from("products").select("*").order("display_order");
    return ((data ?? []) as Product[]).map(normalizeProduct);
  } catch {
    return [];
  }
}

export async function listExclusiveProducts(): Promise<Product[]> {
  if (!supabaseConfigured) return DEMO_PRODUCTS.filter((p) => p.is_exclusive);
  try {
    const sb = getSupabasePublic();
    const { data } = await sb
      .from("products")
      .select("*")
      .eq("is_exclusive", true)
      .order("display_order");
    return ((data ?? []) as Product[]).map(normalizeProduct);
  } catch {
    return [];
  }
}

export async function listProductsByCategory(
  category: "recetados" | "sol",
): Promise<Product[]> {
  if (!supabaseConfigured) {
    return DEMO_PRODUCTS.filter((p) => p.category === category);
  }
  try {
    const sb = getSupabasePublic();
    const { data } = await sb
      .from("products")
      .select("*")
      .eq("category", category)
      .order("display_order");
    return ((data ?? []) as Product[]).map(normalizeProduct);
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
    const product = (data as Product | null) ?? null;
    return product ? normalizeProduct(product) : null;
  } catch {
    return null;
  }
}
