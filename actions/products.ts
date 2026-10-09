"use server";

import { asc, eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { productSchema, type ProductInput } from "@/schemas/product";

function nullify(v: string): string | null {
  return v.trim().length === 0 ? null : v;
}

function toRow(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    short_description: nullify(input.short_description),
    description: nullify(input.description),
    materials: nullify(input.materials),
    lens_type: input.lens_type,
    category: input.category,
    available_colors: input.available_colors,
    images: input.images,
    is_exclusive: input.is_exclusive,
    seo_title: nullify(input.seo_title),
    seo_description: nullify(input.seo_description),
  };
}

function revalidateProductPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
}

export async function createProductAction(input: unknown) {
  await requireAdmin();
  const data = productSchema.parse(input);

  const [{ maxOrder }] = await db.select({ maxOrder: max(products.display_order) }).from(products);
  const display_order = (maxOrder ?? 0) + 1;

  await db.insert(products).values({ ...toRow(data), display_order });

  revalidateProductPaths();
  redirect("/admin/productos");
}

export async function updateProductAction(id: string, input: unknown) {
  await requireAdmin();
  const data = productSchema.parse(input);

  await db.update(products).set(toRow(data)).where(eq(products.id, id));

  revalidateProductPaths();
  redirect("/admin/productos");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.delete(products).where(eq(products.id, id));

  revalidateProductPaths();
}

export async function reorderProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "") as "up" | "down";
  if (!id || (direction !== "up" && direction !== "down")) return;

  const rows = await db
    .select({ id: products.id, display_order: products.display_order })
    .from(products)
    .orderBy(asc(products.display_order));

  const idx = rows.findIndex((r) => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= rows.length) return;

  const a = rows[idx];
  const b = rows[swap];
  await db.transaction(async (tx) => {
    await tx.update(products).set({ display_order: b.display_order }).where(eq(products.id, a.id));
    await tx.update(products).set({ display_order: a.display_order }).where(eq(products.id, b.id));
  });

  revalidateProductPaths();
}
