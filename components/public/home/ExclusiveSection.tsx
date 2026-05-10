import { ExclusiveBlock } from "./ExclusiveBlock";
import { SectionHeader } from "./SectionHeader";
import type { Product } from "@/types/product";
import type { ContentMap } from "@/types/content";

export function ExclusiveSection({
  content,
  products,
}: {
  content: ContentMap;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="flex w-full flex-col gap-6">
      <SectionHeader
        label={content["home.exclusive.label"]}
        title={content["home.exclusive.title"]}
        description={content["home.exclusive.description"]}
      />
      {products.slice(0, 4).map((product, i) => (
        <ExclusiveBlock
          key={product.id}
          index={i + 1}
          product={product}
          align={i % 2 === 0 ? "image-left" : "image-right"}
        />
      ))}
    </section>
  );
}
