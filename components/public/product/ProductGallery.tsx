"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  infoSlot: React.ReactNode;
};

export function ProductGallery({ product, infoSlot }: Props) {
  const images = product.images;
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <>
      <section className="flex w-full flex-col bg-bg px-6 pt-6 md:flex-row md:px-12 lg:px-20">
        <div className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-sm bg-bg-warm md:h-160 md:w-auto md:flex-1 md:aspect-auto">
          {active ? (
            <Image
              key={active.url}
              src={active.url}
              alt={active.alt || product.name}
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
        <div className="md:shrink-0 md:grow-0 md:basis-[480px]">{infoSlot}</div>
      </section>

      {images.length > 1 ? (
        <div className="flex w-full gap-3 px-6 pt-4 md:gap-4 md:px-12 lg:px-20">
          {images.map((img, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={img.url + i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Imagen ${i + 1}`}
                aria-pressed={isActive}
                className={cn(
                  "relative flex aspect-[2/1] shrink grow basis-0 items-center justify-center overflow-hidden rounded-sm border-2 bg-bg-warm transition-colors md:h-32 md:aspect-auto",
                  isActive ? "border-gold" : "border-transparent hover:border-line",
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${product.name} — imagen ${i + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
