import { ProductForm } from "@/components/admin/products/ProductForm";
import { FormHeader } from "@/components/admin/products/FormHeader";

export default function NewProductPage() {
  return (
    <>
      <FormHeader title="Nuevo producto" />
      <ProductForm mode="create" />
    </>
  );
}
