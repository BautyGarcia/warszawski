import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { FormHeader } from "@/components/admin/products/FormHeader";
import { getProductByIdAdmin } from "@/lib/products/admin-queries";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductByIdAdmin(id);
  if (!product) notFound();

  return (
    <>
      <FormHeader title="Editar producto" subtitle={product.name} />
      <ProductForm mode="edit" product={product} />
    </>
  );
}
