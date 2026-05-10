"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/guard";
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
  const sb = getSupabaseAdmin();

  const { data: max } = await sb
    .from("products")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const display_order = (max?.display_order ?? 0) + 1;

  const { error } = await sb
    .from("products")
    .insert({ ...toRow(data), display_order });
  if (error) throw new Error(error.message);

  revalidateProductPaths();
  redirect("/admin/productos");
}

export async function updateProductAction(id: string, input: unknown) {
  await requireAdmin();
  const data = productSchema.parse(input);
  const sb = getSupabaseAdmin();

  const { error } = await sb.from("products").update(toRow(data)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateProductPaths();
  redirect("/admin/productos");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const sb = getSupabaseAdmin();
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateProductPaths();
}

export async function reorderProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "") as "up" | "down";
  if (!id || (direction !== "up" && direction !== "down")) return;

  const sb = getSupabaseAdmin();
  const { data: rows } = await sb
    .from("products")
    .select("id,display_order")
    .order("display_order");
  if (!rows) return;

  const idx = rows.findIndex((r) => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= rows.length) return;

  const a = rows[idx];
  const b = rows[swap];
  await sb.from("products").update({ display_order: b.display_order }).eq("id", a.id);
  await sb.from("products").update({ display_order: a.display_order }).eq("id", b.id);

  revalidateProductPaths();
}
