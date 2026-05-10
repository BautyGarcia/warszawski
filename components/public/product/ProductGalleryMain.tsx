import type { Product } from "@/types/product";

export function ProductGalleryMain({ product }: { product: Product }) {
  return (
    <div className="flex aspect-square w-full shrink-0 items-center justify-center rounded-sm bg-bg-warm md:h-160 md:w-auto md:flex-1 md:aspect-auto">
      <span className="font-display text-6xl font-light leading-none text-ink/6 md:text-7xl md:leading-[88px]">
        {product.name}
      </span>
    </div>
  );
}
