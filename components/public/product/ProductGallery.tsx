"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const ANGLES = ["Frente", "Perfil", "Detalle", "Puesto"];

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex w-full flex-col">
      <div className="flex shrink grow basis-0 items-center justify-center rounded-sm bg-bg-warm">
        <span className="font-display text-7xl font-light leading-[88px] text-ink/6">
          {product.name}
        </span>
      </div>

      <div className="flex w-full gap-4 pt-4">
        {ANGLES.map((angle, i) => (
          <button
            key={angle}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={cn(
              "flex h-40 shrink grow basis-0 items-center justify-center rounded-sm border-2 bg-bg-warm transition-colors",
              activeIndex === i ? "border-gold" : "border-transparent",
            )}
            aria-label={`Ver ${angle}`}
          >
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-soft">
              {angle}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
