import Image from "next/image";
import type { Product } from "@/types/product";

export function ProductGalleryMain({ product }: { product: Product }) {
  const cover = product.images[0];
  return (
    <div className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-sm bg-bg-warm md:h-160 md:w-auto md:flex-1 md:aspect-auto">
      {cover ? (
        <Image
          src={cover.url}
          alt={cover.alt || product.name}
          fill
          sizes="(min-width: 768px) 60vw, 100vw"
          className="object-cover"
          priority
          unoptimized
        />
      ) : (
        <span className="font-display text-6xl font-light leading-none text-ink/6 md:text-7xl md:leading-[88px]">
          {product.name}
        </span>
      )}
    </div>
  );
}
