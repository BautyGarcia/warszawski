import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/product/Breadcrumbs";
import { ProductGallery } from "@/components/public/product/ProductGallery";
import { ProductInfo } from "@/components/public/product/ProductInfo";
import { ProductColorProvider } from "@/components/public/product/ProductColorContext";
import { RelatedProducts } from "@/components/public/product/RelatedProducts";
import { JsonLd } from "@/components/JsonLd";
import { getProductBySlug, listProducts } from "@/lib/products/queries";
import {
  SITE_URL,
  breadcrumbJsonLd,
  buildProductMetadata,
  productJsonLd,
} from "@/lib/seo";

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
  if (!product) return { title: "No encontrado" };
  return buildProductMetadata(product);
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

  const collectionHref = product.category
    ? `/coleccion/${product.category}`
    : "/#coleccion";
  const collectionUrl = product.category
    ? `${SITE_URL}/coleccion/${product.category}`
    : `${SITE_URL}/#coleccion`;

  return (
    <main className="flex flex-col">
      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: "Inicio", url: SITE_URL },
            { name: "Coleccion", url: collectionUrl },
            { name: product.name },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Coleccion", href: collectionHref },
          { label: product.name },
        ]}
      />
      <ProductColorProvider
        initialColorId={product.available_colors[0]?.id ?? null}
      >
        <ProductGallery
          product={product}
          infoSlot={<ProductInfo product={product} />}
        />
      </ProductColorProvider>
      <RelatedProducts products={related} />
    </main>
  );
}
