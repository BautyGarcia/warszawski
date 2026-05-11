"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function ImageField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Falló la subida de ${file.name}`);
      }
      const { url } = (await res.json()) as { url: string };
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error subiendo");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="group relative aspect-[5/6] w-full max-w-[240px] overflow-hidden rounded-md bg-[#F0EDE8]">
          <Image src={value} alt="" fill sizes="240px" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2 p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-sm bg-white/90 px-2 py-0.5 text-[11px] font-medium text-ink shadow-sm hover:bg-white"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-sm bg-white/90 px-2 py-0.5 text-[11px] font-medium text-[#DC3545] shadow-sm hover:bg-white"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex aspect-[5/6] w-full max-w-[240px] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-black/15 bg-white text-sm text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink",
            uploading && "opacity-60",
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {uploading ? "Subiendo..." : "Subir imagen"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error ? <p className="text-[12px] text-red-700">{error}</p> : null}
      <p className="text-[12px] text-[#6B6B6B]">JPG, PNG, WebP o AVIF. Máximo 5MB.</p>
    </div>
  );
}
