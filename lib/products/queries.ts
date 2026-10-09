import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { DEMO_PRODUCTS } from "@/lib/products/demo";
import { products } from "@/lib/schema";
import { rewriteLegacyStorageUrl } from "@/lib/storage/legacy-url";
import type { Product } from "@/types/product";

const dbConfigured = !!process.env.DATABASE_URL;

/** Maps image URLs still pointing at Supabase Storage to the dbm public bucket. */
export function withCurrentImageUrls(p: Product): Product {
  return {
    ...p,
    images: (p.images ?? []).map((img) => ({ ...img, url: rewriteLegacyStorageUrl(img.url) })),
  };
}

// Products saved before per-color images have colors without ids and images
// without colorId. Give each legacy color a stable, deterministic fallback id
// (positional, so SSR and client agree) so the color picker keys correctly;
// legacy images stay general (colorId null) and fall back gracefully.
function normalizeProduct(p: Product): Product {
  const current = withCurrentImageUrls(p);
  return {
    ...current,
    available_colors: (current.available_colors ?? []).map((c, i) => ({
      ...c,
      id: c.id || `c${i}`,
    })),
    images: current.images.map((img) => ({ ...img, colorId: img.colorId ?? null })),
  };
}

export async function listProducts(): Promise<Product[]> {
  if (!dbConfigured) return DEMO_PRODUCTS;
  try {
    const rows = await db.select().from(products).orderBy(asc(products.display_order));
    return rows.map(normalizeProduct);
  } catch {
    return [];
  }
}

export async function listExclusiveProducts(): Promise<Product[]> {
  if (!dbConfigured) return DEMO_PRODUCTS.filter((p) => p.is_exclusive);
  try {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.is_exclusive, true))
      .orderBy(asc(products.display_order));
    return rows.map(normalizeProduct);
  } catch {
    return [];
  }
}

export async function listProductsByCategory(
  category: "recetados" | "sol",
): Promise<Product[]> {
  if (!dbConfigured) {
    return DEMO_PRODUCTS.filter((p) => p.category === category);
  }
  try {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.category, category))
      .orderBy(asc(products.display_order));
    return rows.map(normalizeProduct);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!dbConfigured) {
    return DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return row ? normalizeProduct(row) : null;
  } catch {
    return null;
  }
}
