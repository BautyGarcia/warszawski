import Link from "next/link";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col"
    >
      <div className="flex h-100 shrink-0 items-center justify-center rounded-sm bg-bg-warm transition-colors group-hover:bg-bg-warm/80">
        <span className="font-display text-5xl font-light leading-[58px] text-ink/6">
          {product.name}
        </span>
      </div>
      <div className="flex items-start justify-between px-1 pt-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-xl font-semibold leading-6 text-ink">
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
