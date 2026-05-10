import { Hero } from "@/components/public/home/Hero";
import { ExclusiveSection } from "@/components/public/home/ExclusiveSection";
import { CollectionSection } from "@/components/public/home/CollectionSection";
import { BrandStatement } from "@/components/public/home/BrandStatement";
import { FinalCTA } from "@/components/public/home/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { getContentMap } from "@/lib/content/fetch";
import { getContactInfo } from "@/lib/content/contact";
import { listProducts, listExclusiveProducts } from "@/lib/products/queries";
import { buildHomeMetadata, organizationJsonLd } from "@/lib/seo";

export async function generateMetadata() {
  const content = await getContentMap("home");
  return buildHomeMetadata(content);
}

export default async function HomePage() {
  const [content, allProducts, exclusiveProducts, contact] = await Promise.all([
    getContentMap("home"),
    listProducts(),
    listExclusiveProducts(),
    getContactInfo(),
  ]);

  const hasExclusive = exclusiveProducts.length > 0;

  return (
    <main className="flex flex-col">
      <JsonLd data={organizationJsonLd(contact)} />
      <Hero content={content} />
      {hasExclusive ? (
        <>
          <Divider />
          <ExclusiveSection content={content} products={exclusiveProducts} />
        </>
      ) : null}
      <Divider />
      <CollectionSection content={content} products={allProducts} />
      <BrandStatement content={content} />
      <FinalCTA content={content} />
    </main>
  );
}

function Divider() {
  return (
    <div className="flex w-full justify-center px-6 py-8 md:px-12 md:py-12 lg:px-20">
      <div className="h-px w-full max-w-[1280px] bg-line" />
    </div>
  );
}
