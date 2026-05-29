"use client";

import { useEffect, useState } from "react";
import { parseListValue } from "@/lib/content/contact";

type Props = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
};

export function ListField({ value, onChange, placeholder }: Props) {
  const [items, setItems] = useState<string[]>(() => parseListValue(value));

  // Sincronizar con value externo si cambia (ej: reset post-save).
  useEffect(() => {
    setItems(parseListValue(value));
  }, [value]);

  function commit(next: string[]) {
    setItems(next);
    onChange(JSON.stringify(next));
  }

  function addItem() {
    commit([...items, ""]);
  }

  function removeItem(idx: number) {
    commit(items.filter((_, i) => i !== idx));
  }

  function setItem(idx: number, val: string) {
    commit(items.map((v, i) => (i === idx ? val : v)));
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(i, e.target.value)}
            placeholder={placeholder}
            className="h-10 flex-1 rounded-md border border-black/10 bg-[#F7F7F5] px-3 text-sm text-ink outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            aria-label="Quitar"
            className="flex size-10 shrink-0 items-center justify-center rounded-md border border-black/10 text-[#DC3545] transition-colors hover:border-[#DC3545]/40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex h-9 w-fit items-center gap-1.5 rounded-md border border-dashed border-black/15 bg-white px-3 text-[13px] text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Agregar
      </button>
    </div>
  );
}
