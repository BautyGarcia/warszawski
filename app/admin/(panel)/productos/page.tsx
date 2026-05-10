import { ProductsListClient } from "@/components/admin/products/ProductsListClient";
import { listProducts } from "@/lib/products/queries";

export default async function ProductsPage() {
  const products = await listProducts();
  return <ProductsListClient products={products} />;
}
