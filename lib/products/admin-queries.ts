import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { DEMO_PRODUCTS } from "@/lib/products/demo";
import { withCurrentImageUrls } from "@/lib/products/queries";
import { products } from "@/lib/schema";
import type { Product } from "@/types/product";

const dbConfigured = !!process.env.DATABASE_URL;

export async function listProductsAdmin(): Promise<Product[]> {
  if (!dbConfigured) return DEMO_PRODUCTS;
  const rows = await db.select().from(products).orderBy(asc(products.display_order));
  return rows.map(withCurrentImageUrls);
}

export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  if (!dbConfigured) {
    return DEMO_PRODUCTS.find((p) => p.id === id) ?? null;
  }
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row ? withCurrentImageUrls(row) : null;
}
