"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductColor } from "@/types/product";

export function ColorPicker({ colors }: { colors: ProductColor[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (colors.length === 0) return null;
  const active = colors[activeIndex];

  return (
    <div className="flex w-full flex-col gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-gold-dark">
        Elegir color
      </span>
      <div className="flex items-center gap-2.5">
        {colors.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={c.name}
            style={{ backgroundColor: c.hex }}
            className={cn(
              "size-8 shrink-0 rounded-full border-2 transition-colors",
              activeIndex === i ? "border-gold" : "border-transparent",
            )}
          />
        ))}
      </div>
      <span className="text-[13px] text-ink-soft">{active.name}</span>
    </div>
  );
}
