import Link from "next/link";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/productos/${product.slug}`} className="group flex flex-col">
      <div className="flex aspect-[4/3] shrink-0 items-center justify-center rounded-sm bg-bg-warm transition-colors group-hover:bg-bg-warm/80 md:h-100 md:aspect-auto">
        <span className="font-display text-4xl font-light leading-none text-ink/6 md:text-5xl">
          {product.name}
        </span>
      </div>
      <div className="flex items-start justify-between px-1 pt-4 md:pt-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-lg font-semibold leading-6 text-ink md:text-xl">
            {product.name}
          </h3>
          {product.short_description ? (
            <p className="text-[13px] text-ink-soft">{product.short_description}</p>
          ) : null}
        </div>
        <span className="pt-1.5 text-[11px] font-medium uppercase tracking-widest text-gold-dark">
          Ver mas
        </span>
      </div>
    </Link>
  );
}
