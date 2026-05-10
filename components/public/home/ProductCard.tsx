import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];

  return (
    <Link href={`/productos/${product.slug}`} className="group flex flex-col">
      <div className="relative flex aspect-[4/3] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-bg-warm transition-colors duration-500 ease-out group-hover:bg-[#DDD8CD] md:h-100 md:aspect-auto">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || product.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            unoptimized
          />
        ) : (
          <span className="font-display text-4xl font-light leading-none text-ink/8 transition-transform duration-700 ease-out group-hover:scale-[1.04] md:text-5xl">
            {product.name}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between px-1 pt-4 md:pt-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-lg font-semibold leading-6 text-ink transition-colors duration-300 group-hover:text-ink-soft md:text-xl">
            {product.name}
          </h3>
          {product.short_description ? (
            <p className="text-[13px] text-ink-soft">{product.short_description}</p>
          ) : null}
        </div>
        <span className="pt-1.5 text-[11px] font-medium uppercase tracking-widest text-gold-dark transition-colors duration-300 group-hover:text-gold">
          Ver mas
        </span>
      </div>
    </Link>
  );
}
