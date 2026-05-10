import { ProductCard } from "@/components/public/home/ProductCard";
import type { Product } from "@/types/product";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center bg-bg px-6 pb-10 pt-16 md:px-12 md:pb-12 md:pt-25 lg:px-20">
        <div className="mb-16 h-px w-full bg-bg-warm md:mb-25" />
        <span className="mb-4 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:mb-6 md:text-[11px]">
          Tambien te puede gustar
        </span>
        <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-ink md:text-[40px] md:leading-12">
          Modelos relacionados
        </h2>
      </div>

      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 px-6 pb-20 md:grid-cols-3 md:gap-y-12 md:px-12 md:pb-25 lg:px-20">
        {products.slice(0, 3).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
