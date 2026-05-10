import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/product/Breadcrumbs";
import { ProductGallery } from "@/components/public/product/ProductGallery";
import { ProductInfo } from "@/components/public/product/ProductInfo";
import { RelatedProducts } from "@/components/public/product/RelatedProducts";
import { getProductBySlug, listProducts } from "@/lib/products/queries";

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "No encontrado — Warszawski" };
  return {
    title: product.seo_title ?? `${product.name} — Warszawski`,
    description: product.seo_description ?? product.short_description ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await listProducts();
  const related = all.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="flex flex-col">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Coleccion", href: "/#coleccion" },
          { label: product.name },
        ]}
      />
      <ProductGallery
        product={product}
        infoSlot={<ProductInfo product={product} />}
      />
      <RelatedProducts products={related} />
    </main>
  );
}
