"use client";

import { cn } from "@/lib/utils";
import { useProductColor } from "./ProductColorContext";
import type { ProductColor } from "@/types/product";

export function ColorPicker({ colors }: { colors: ProductColor[] }) {
  const { selectedColorId, setSelectedColorId } = useProductColor();
  if (colors.length === 0) return null;

  const active =
    colors.find((c) => c.id === selectedColorId) ?? colors[0];

  return (
    <div className="flex w-full flex-col gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-gold-dark">
        Elegir color
      </span>
      <div className="flex items-center gap-2.5">
        {colors.map((c, i) => (
          <button
            key={c.id ?? c.hex + i}
            type="button"
            onClick={() => setSelectedColorId(c.id)}
            aria-label={c.name}
            aria-pressed={active.id === c.id}
            style={{ backgroundColor: c.hex }}
            className={cn(
              "size-8 shrink-0 rounded-full border-2 transition-colors",
              active.id === c.id ? "border-gold" : "border-transparent",
            )}
          />
        ))}
      </div>
      <span className="text-[13px] text-ink-soft">{active.name}</span>
    </div>
  );
}
