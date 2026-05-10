import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { DEMO_PRODUCTS } from "@/lib/products/demo";
import type { Product } from "@/types/product";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function listProductsAdmin(): Promise<Product[]> {
  if (!supabaseConfigured) return DEMO_PRODUCTS;
  const sb = getSupabaseAdmin();
  const { data } = await sb.from("products").select("*").order("display_order");
  return (data ?? []) as Product[];
}

export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  if (!supabaseConfigured) {
    return DEMO_PRODUCTS.find((p) => p.id === id) ?? null;
  }
  const sb = getSupabaseAdmin();
  const { data } = await sb.from("products").select("*").eq("id", id).maybeSingle();
  return (data as Product | null) ?? null;
}
