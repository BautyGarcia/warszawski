"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";
import { useProductColor } from "./ProductColorContext";
import { visibleImagesForColor } from "@/lib/products/color-images";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  infoSlot: React.ReactNode;
};

export function ProductGallery({ product, infoSlot }: Props) {
  const { selectedColorId } = useProductColor();
  const images = useMemo(
    () =>
      visibleImagesForColor(
        product.images,
        product.available_colors,
        selectedColorId,
      ),
    [product.images, product.available_colors, selectedColorId],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  // Switching color swaps the image set; jump back to the first image so the
  // active index can never point past the (possibly shorter) new array.
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedColorId]);

  const active = images[activeIndex] ?? images[0];
  const canZoom = images.length > 0;
  const hasThumbs = images.length > 1;

  // Track scroll position so the edge fades only show when there's more to see.
  const updateEdges = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setEdges({
      left: scrollLeft > 1,
      right: scrollLeft + clientWidth < scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      ro.disconnect();
    };
  }, [updateEdges, images.length]);

  // Keep the active thumbnail in view (e.g. after color switch or lightbox nav).
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const node = el.querySelector<HTMLElement>('[data-active="true"]');
    node?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [activeIndex]);

  return (
    <section className="flex w-full flex-col gap-8 bg-bg px-6 pt-6 md:gap-12 md:px-12 lg:flex-row lg:items-start lg:gap-12 lg:px-20">
      <div className="flex w-full min-w-0 flex-col gap-3 md:gap-4 lg:flex-1">
        {canZoom ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Ver imagen ampliada"
            className="group relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-sm bg-bg-warm"
          >
            <Image
              key={active!.url}
              src={active!.url}
              alt={active!.alt || product.name}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              priority
            />
            <span className="pointer-events-none absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink/70 text-bg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </span>
          </button>
        ) : (
          <div className="relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-sm bg-bg-warm">
            <span className="font-display text-6xl font-light leading-none text-ink/6 md:text-7xl">
              {product.name}
            </span>
          </div>
        )}

        {hasThumbs ? (
          <div className="relative">
            <div
              ref={stripRef}
              className="flex snap-x gap-3 overflow-x-auto scroll-smooth pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden"
            >
              {images.map((img, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={img.url + i}
                    type="button"
                    data-active={isActive}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Imagen ${i + 1} de ${images.length}`}
                    aria-pressed={isActive}
                    className={cn(
                      "relative aspect-[3/2] w-24 shrink-0 snap-start overflow-hidden rounded-sm border-2 bg-bg-warm transition-colors sm:w-28 md:w-32",
                      isActive ? "border-gold" : "border-transparent hover:border-line",
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `${product.name} — imagen ${i + 1}`}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-bg to-transparent transition-opacity duration-300",
                edges.left ? "opacity-100" : "opacity-0",
              )}
            />
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg to-transparent transition-opacity duration-300",
                edges.right ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
        ) : null}
      </div>

      <div className="lg:max-w-[480px] lg:shrink-0 lg:basis-[480px]">
        {infoSlot}
      </div>

      <Lightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        index={activeIndex}
        onIndexChange={setActiveIndex}
        productName={product.name}
      />
    </section>
  );
}
