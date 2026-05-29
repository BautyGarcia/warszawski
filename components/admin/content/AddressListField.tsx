"use client";

import { useEffect, useState } from "react";
import {
  parseAddressListValue,
  type OfficeAddress,
} from "@/lib/content/contact";

type Props = {
  value: string;
  onChange: (next: string) => void;
};

export function AddressListField({ value, onChange }: Props) {
  const [items, setItems] = useState<OfficeAddress[]>(() =>
    parseAddressListValue(value),
  );

  // Sincronizar con value externo si cambia (ej: reset post-save).
  useEffect(() => {
    setItems(parseAddressListValue(value));
  }, [value]);

  function commit(next: OfficeAddress[]) {
    setItems(next);
    onChange(JSON.stringify(next));
  }

  function addItem() {
    commit([...items, { address: "", phone: "" }]);
  }

  function removeItem(idx: number) {
    commit(items.filter((_, i) => i !== idx));
  }

  function setField(
    idx: number,
    field: keyof OfficeAddress,
    val: string,
  ) {
    commit(items.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-md border border-black/8 bg-white p-3"
        >
          <div className="flex items-start gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B6B6B]">
                Direccion
              </span>
              <input
                type="text"
                value={item.address}
                onChange={(e) => setField(i, "address", e.target.value)}
                placeholder="Montevideo 536 1A, Capital Federal"
                className="h-10 rounded-md border border-black/10 bg-[#F7F7F5] px-3 text-sm text-ink outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white"
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(i)}
              aria-label="Quitar oficina"
              className="mt-[22px] flex size-10 shrink-0 items-center justify-center rounded-md border border-black/10 text-[#DC3545] transition-colors hover:border-[#DC3545]/40"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B6B6B]">
              Telefono de linea
            </span>
            <input
              type="text"
              value={item.phone}
              onChange={(e) => setField(i, "phone", e.target.value)}
              placeholder="011 4321-5678 (opcional)"
              className="h-10 rounded-md border border-black/10 bg-[#F7F7F5] px-3 text-sm text-ink outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white"
            />
          </div>
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
        Agregar oficina
      </button>
    </div>
  );
}
