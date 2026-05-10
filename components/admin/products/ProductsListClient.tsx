"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductTableRow } from "./ProductTableRow";
import { SelectField } from "@/components/admin/ui/SelectField";
import type { Product } from "@/types/product";

const HEADERS = [
  { label: "Nombre", className: "w-60" },
  { label: "Categoría", className: "w-30" },
  { label: "Tipo lente", className: "w-30" },
  { label: "Exclusivo", className: "w-25" },
  { label: "Orden", className: "w-20" },
  { label: "Acciones", className: "grow shrink basis-0 text-right" },
];

export function ProductsListClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "recetados" | "sol">("all");

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (category !== "all" && p.category !== category) return false;
        return true;
      }),
    [products, search, category],
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-ink">Productos</h1>
          <p className="text-[13px] text-[#6B6B6B]">{filtered.length} productos en total</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 items-center gap-2 rounded-md border border-black/12 px-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-44 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#999]"
            />
          </div>
          <SelectField
            value={category === "all" ? null : category}
            onChange={(v) => setCategory((v as "recetados" | "sol" | null) ?? "all")}
            options={[
              { value: "recetados", label: "Recetados" },
              { value: "sol", label: "Sol" },
            ]}
            placeholder="Categoría"
            size="sm"
            className="w-32"
          />
          <Link
            href="/admin/productos/nuevo"
            className="flex h-9 items-center gap-1.5 rounded-md bg-ink px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-ink-soft"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar producto
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="flex h-9 items-center border-b border-black/8 px-3">
            <div className="mr-3 size-10 shrink-0" />
            {HEADERS.map((h) => (
              <span
                key={h.label}
                className={`${h.className} inline-block text-[11px] font-medium uppercase tracking-[0.06em] text-[#999]`}
              >
                {h.label}
              </span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-[#999]">
              {products.length === 0
                ? "Todavía no hay productos. Creá el primero."
                : "Ningún producto coincide con la búsqueda."}
            </div>
          ) : (
            filtered.map((p) => <ProductTableRow key={p.id} product={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
