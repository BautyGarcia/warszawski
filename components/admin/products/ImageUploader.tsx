"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ImageItem = { url: string; alt?: string };

type Props = {
  value: ImageItem[];
  onChange: (next: ImageItem[]) => void;
};

export function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: fd,
          });
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { error?: string };
            throw new Error(body.error ?? `Falló la subida de ${file.name}`);
          }
          const { url } = (await res.json()) as { url: string };
          return { url, alt: "" };
        }),
      );
      onChange([...value, ...uploads]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error subiendo imágenes");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function setPrimary(idx: number) {
    if (idx === 0) return;
    const next = [...value];
    const [picked] = next.splice(idx, 1);
    next.unshift(picked);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {value.map((img, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-md bg-[#F0EDE8]"
          >
            <Image
              src={img.url}
              alt={img.alt ?? ""}
              fill
              sizes="200px"
              className="object-cover"
              unoptimized
            />
            {i === 0 ? (
              <span className="absolute left-2 top-2 rounded-sm bg-gold px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-white">
                Principal
              </span>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              {i !== 0 ? (
                <button
                  type="button"
                  onClick={() => setPrimary(i)}
                  className="rounded-sm bg-white/90 px-2 py-0.5 text-[11px] font-medium text-ink shadow-sm hover:bg-white"
                >
                  Hacer principal
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Quitar imagen"
                className="rounded-sm bg-white/90 px-2 py-0.5 text-[11px] font-medium text-[#DC3545] shadow-sm hover:bg-white"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed border-black/15 bg-white text-sm text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink",
            uploading && "opacity-60",
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {uploading ? "Subiendo..." : "Subir imagen"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error ? <p className="text-[12px] text-red-700">{error}</p> : null}
      <p className="text-[12px] text-[#6B6B6B]">
        JPG, PNG, WebP o AVIF. Máximo 5MB por imagen. La primera imagen es la principal.
      </p>
    </div>
  );
}
