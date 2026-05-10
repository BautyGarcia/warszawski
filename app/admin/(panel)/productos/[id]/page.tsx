import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { FormHeader } from "@/components/admin/products/FormHeader";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { DEMO_PRODUCTS } from "@/lib/products/demo";
import type { Product } from "@/types/product";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

async function fetchProduct(id: string): Promise<Product | null> {
  if (!supabaseConfigured) {
    return DEMO_PRODUCTS.find((p) => p.id === id) ?? null;
  }
  const sb = getSupabaseAdmin();
  const { data } = await sb.from("products").select("*").eq("id", id).maybeSingle();
  return (data as Product | null) ?? null;
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) notFound();

  return (
    <>
      <FormHeader title="Editar producto" subtitle={product.name} />
      <ProductForm mode="edit" product={product} />
    </>
  );
}
