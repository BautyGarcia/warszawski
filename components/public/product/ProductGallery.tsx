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
  const thumbs = images.slice(0, 4);

  return (
    <section className="flex w-full flex-col gap-8 bg-bg px-6 pt-6 md:gap-12 md:px-12 lg:flex-row lg:items-start lg:gap-12 lg:px-20">
      <div className="flex w-full flex-col gap-3 md:gap-4 lg:flex-1">
        <div className="relative flex aspect-square w-full max-w-[640px] items-center justify-center overflow-hidden rounded-sm bg-bg-warm">
          {active ? (
            <Image
              key={active.url}
              src={active.url}
              alt={active.alt || product.name}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <span className="font-display text-6xl font-light leading-none text-ink/6 md:text-7xl">
              {product.name}
            </span>
          )}
        </div>

        {thumbs.length > 1 ? (
          <div className="flex gap-3 md:gap-4">
            {thumbs.map((img, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={img.url + i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Imagen ${i + 1}`}
                  aria-pressed={isActive}
                  className={cn(
                    "relative aspect-square w-24 shrink-0 overflow-hidden rounded-sm border-2 bg-bg-warm transition-colors md:w-28",
                    isActive ? "border-gold" : "border-transparent hover:border-line",
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${product.name} — imagen ${i + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="lg:max-w-[480px] lg:shrink-0 lg:basis-[480px]">
        {infoSlot}
      </div>
    </section>
  );
}
