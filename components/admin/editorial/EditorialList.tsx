"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EditorialDeleteButton } from "./EditorialDeleteButton";
import { SelectField } from "@/components/admin/ui/SelectField";
import type { EditorialPost } from "@/types/editorial";

export function EditorialList({ posts }: { posts: EditorialPost[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (status === "published" && !p.published) return false;
        if (status === "draft" && p.published) return false;
        return true;
      }),
    [posts, search, status],
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-ink">Editorial</h1>
          <p className="text-[13px] text-[#6B6B6B]">{filtered.length} notas en total</p>
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
              placeholder="Buscar nota..."
              className="w-44 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#999]"
            />
          </div>
          <SelectField
            value={status === "all" ? null : status}
            onChange={(v) => setStatus((v as "published" | "draft" | null) ?? "all")}
            options={[
              { value: "published", label: "Publicadas" },
              { value: "draft", label: "Borradores" },
            ]}
            placeholder="Estado"
            size="sm"
            className="w-32"
          />
          <Link
            href="/admin/editorial/nuevo"
            className="flex h-9 items-center gap-1.5 rounded-md bg-ink px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-ink-soft"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva nota
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex h-9 items-center border-b border-black/8 px-3">
          <span className="w-80 shrink-0 text-[11px] font-medium uppercase tracking-[0.06em] text-[#999]">
            Título
          </span>
          <span className="w-32 shrink-0 text-[11px] font-medium uppercase tracking-[0.06em] text-[#999]">
            Estado
          </span>
          <span className="w-40 shrink-0 text-[11px] font-medium uppercase tracking-[0.06em] text-[#999]">
            Actualizada
          </span>
          <span className="grow shrink basis-0 text-right text-[11px] font-medium uppercase tracking-[0.06em] text-[#999]">
            Acciones
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-[#999]">
            {posts.length === 0
              ? "Todavía no hay notas. Creá la primera."
              : "Ninguna nota coincide con la búsqueda."}
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="flex items-center border-b border-black/5 px-3 py-3 transition-colors hover:bg-black/[0.015]"
            >
              <div className="flex w-80 shrink-0 flex-col gap-0.5">
                <Link
                  href={`/admin/editorial/${p.id}`}
                  className="text-sm font-medium text-ink hover:underline"
                >
                  {p.title}
                </Link>
                <span className="text-xs text-[#999]">{p.slug}</span>
              </div>
              <div className="w-32 shrink-0">
                {p.published ? (
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-[#3D7A4F]">
                    <span className="size-1.5 rounded-full bg-[#3D7A4F]" />
                    Publicada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6B6B6B]">
                    <span className="size-1.5 rounded-full bg-[#999]" />
                    Borrador
                  </span>
                )}
              </div>
              <div className="w-40 shrink-0 text-[13px] text-[#6B6B6B]">
                {new Date(p.updated_at).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="flex grow shrink basis-0 items-center justify-end gap-1.5">
                <Link
                  href={`/admin/editorial/${p.id}`}
                  aria-label={`Editar ${p.title}`}
                  className="flex size-7 items-center justify-center rounded-[5px] border border-black/10 text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </Link>
                <EditorialDeleteButton id={p.id} title={p.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
