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
      <section className="flex h-fit w-full bg-bg px-20 pt-6">
        <div className="flex h-160 shrink grow basis-0 items-center justify-center rounded-sm bg-bg-warm">
          <span className="font-display text-7xl font-light leading-[88px] text-ink/6">
            {product.name}
          </span>
        </div>
        <div className="shrink-0 grow-0 basis-[480px]">
          <ProductInfo product={product} />
        </div>
      </section>
      <ProductGalleryThumbs product={product} />
      <RelatedProducts products={related} />
    </main>
  );
}

function ProductGalleryThumbs({ product }: { product: Awaited<ReturnType<typeof getProductBySlug>> }) {
  if (!product) return null;
  return (
    <div className="px-20">
      <ProductGallery product={product} />
    </div>
  );
}
