import { ProductsListClient } from "@/components/admin/products/ProductsListClient";
import { listProductsAdmin } from "@/lib/products/admin-queries";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProductsAdmin();
  return <ProductsListClient products={products} />;
}
