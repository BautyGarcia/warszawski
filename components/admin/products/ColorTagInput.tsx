"use client";

import { useState } from "react";
import { ColorPicker } from "./ColorPicker";
import type { ProductColor } from "@/types/product";

type Props = {
  value: ProductColor[];
  onChange: (next: ProductColor[]) => void;
};

export function ColorTagInput({ value, onChange }: Props) {
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#0A0A0A");

  function add() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    onChange([...value, { id: crypto.randomUUID(), name: trimmed, hex }]);
    setName("");
    setHex("#0A0A0A");
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {value.map((c, i) => (
          <span
            key={c.id ?? i}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#F7F7F5] py-1 pl-1 pr-2.5 text-[13px] text-ink"
          >
            <span
              className="size-5 rounded-full border border-black/10"
              style={{ backgroundColor: c.hex }}
              aria-hidden
            />
            {c.name}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Quitar ${c.name}`}
              className="text-[#999] transition-colors hover:text-ink"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del color"
          className="h-9 grow rounded-md border border-black/10 bg-[#F7F7F5] px-3 text-sm outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <ColorPicker value={hex} onChange={setHex} />
        <button
          type="button"
          onClick={add}
          className="h-9 rounded-md border border-black/10 px-4 text-[13px] text-ink transition-colors hover:border-ink/30"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
