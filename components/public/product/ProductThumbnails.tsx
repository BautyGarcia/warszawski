"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const ANGLES = ["Frente", "Perfil", "Detalle", "Puesto"];

export function ProductThumbnails() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex w-full gap-3 px-6 pt-4 md:gap-4 md:px-12 lg:px-20">
      {ANGLES.map((angle, i) => (
        <button
          key={angle}
          type="button"
          onClick={() => setActiveIndex(i)}
          className={cn(
            "flex aspect-[2/1] shrink grow basis-0 items-center justify-center rounded-sm border-2 bg-bg-warm transition-colors md:h-40 md:aspect-auto",
            activeIndex === i ? "border-gold" : "border-transparent",
          )}
          aria-label={`Ver ${angle}`}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-ink-soft md:text-[11px]">
            {angle}
          </span>
        </button>
      ))}
    </div>
  );
}
