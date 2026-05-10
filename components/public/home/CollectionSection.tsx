import { Reveal } from "@/components/public/Reveal";
import { ProductCard } from "./ProductCard";
import { SectionHeader } from "./SectionHeader";
import type { Product } from "@/types/product";
import type { ContentMap } from "@/types/content";

export function CollectionSection({
  content,
  products,
}: {
  content: ContentMap;
  products: Product[];
}) {
  return (
    <section id="coleccion" className="flex w-full flex-col pb-20 md:pb-25">
      <SectionHeader
        label={content["home.collection.label"]}
        title={content["home.collection.title"]}
      />
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-12 px-6 md:grid-cols-2 md:gap-y-16 md:px-12 lg:px-20">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 4) * 80}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
