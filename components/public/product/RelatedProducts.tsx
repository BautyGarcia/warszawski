import { ProductCard } from "@/components/public/home/ProductCard";
import type { Product } from "@/types/product";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="flex w-full flex-col">
      <div className="flex w-full flex-col items-center bg-bg px-20 pb-12 pt-25">
        <div className="mb-25 h-px w-full bg-bg-warm" />
        <span className="mb-6 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-gold-dark">
          Tambien te puede gustar
        </span>
        <h2 className="font-display text-[40px] font-bold leading-12 tracking-[-0.02em] text-ink">
          Modelos relacionados
        </h2>
      </div>

      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-12 px-20 pb-25 md:grid-cols-3">
        {products.slice(0, 3).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
