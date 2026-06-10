"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductColor } from "@/types/product";

type ImageItem = { url: string; alt?: string; colorId?: string | null };

type IndexedItem = { img: ImageItem; index: number };

type Props = {
  value: ImageItem[];
  onChange: (next: ImageItem[]) => void;
  colors: ProductColor[];
};

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

export function ImageUploader({ value, onChange, colors }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingColorId = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validIds = new Set(colors.map((c) => c.id));
  const hasColors = colors.length > 0;

  async function handleFiles(files: FileList | null, colorId: string | null) {
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
          return { url, alt: "", colorId } satisfies ImageItem;
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

  function openPicker(colorId: string | null) {
    pendingColorId.current = colorId;
    inputRef.current?.click();
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function updateAlt(index: number, alt: string) {
    onChange(value.map((img, i) => (i === index ? { ...img, alt } : img)));
  }

  function reassign(index: number, colorId: string | null) {
    onChange(value.map((img, i) => (i === index ? { ...img, colorId } : img)));
  }

  // Move an image to the front of its own group (its color's "principal"),
  // keeping the relative order of everything else intact.
  function makePrimary(index: number) {
    const target = value[index];
    const inGeneral = isGeneral(target);
    const rest = value.filter((_, i) => i !== index);
    const sameGroup = (img: ImageItem) =>
      inGeneral ? isGeneral(img) : img.colorId === target.colorId;
    const insertAt = rest.findIndex(sameGroup);
    const next =
      insertAt === -1
        ? [target, ...rest]
        : [...rest.slice(0, insertAt), target, ...rest.slice(insertAt)];
    onChange(next);
  }

  function isGeneral(img: ImageItem): boolean {
    return img.colorId == null || !validIds.has(img.colorId);
  }

  const indexed: IndexedItem[] = value.map((img, index) => ({ img, index }));
  const generalItems = indexed.filter((e) => isGeneral(e.img));

  const sectionHandlers = {
    colors,
    showReassign: hasColors,
    uploading,
    onOpenPicker: openPicker,
    onRemove: remove,
    onUpdateAlt: updateAlt,
    onReassign: reassign,
    onMakePrimary: makePrimary,
  };

  return (
    <div className="flex flex-col gap-7">
      {hasColors
        ? colors.map((color) => (
            <Section
              key={color.id}
              title={color.name}
              swatch={color.hex}
              colorId={color.id}
              items={indexed.filter((e) => e.img.colorId === color.id)}
              {...sectionHandlers}
            />
          ))
        : null}

      <Section
        title={hasColors ? "General" : undefined}
        subtitle={hasColors ? "Se muestran en cualquier color" : undefined}
        colorId={null}
        items={generalItems}
        {...sectionHandlers}
      />

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files, pendingColorId.current)}
      />

      {error ? <p className="text-[12px] text-red-700">{error}</p> : null}
      <p className="text-[12px] text-[#6B6B6B]">
        JPG, PNG, WebP o AVIF. Máximo 5MB por imagen. La primera imagen de cada
        color es la principal de ese color.
        {hasColors
          ? " Las imágenes en “General” se usan como respaldo cuando un color no tiene fotos propias."
          : null}{" "}
        El texto alternativo describe la imagen para buscadores y lectores de pantalla.
      </p>
    </div>
  );
}

type SectionProps = {
  title?: string;
  subtitle?: string;
  swatch?: string;
  colorId: string | null;
  items: IndexedItem[];
  colors: ProductColor[];
  showReassign: boolean;
  uploading: boolean;
  onOpenPicker: (colorId: string | null) => void;
  onRemove: (index: number) => void;
  onUpdateAlt: (index: number, alt: string) => void;
  onReassign: (index: number, colorId: string | null) => void;
  onMakePrimary: (index: number) => void;
};

function Section({
  title,
  subtitle,
  swatch,
  colorId,
  items,
  colors,
  showReassign,
  uploading,
  onOpenPicker,
  onRemove,
  onUpdateAlt,
  onReassign,
  onMakePrimary,
}: SectionProps) {
  const primaryIndex = items[0]?.index;

  return (
    <div className="flex flex-col gap-3">
      {title ? (
        <div className="flex items-center gap-2">
          {swatch ? (
            <span
              className="size-4 rounded-full border border-black/10"
              style={{ backgroundColor: swatch }}
              aria-hidden
            />
          ) : null}
          <span className="text-[13px] font-medium text-ink">{title}</span>
          {subtitle ? (
            <span className="text-[12px] text-[#6B6B6B]">— {subtitle}</span>
          ) : null}
          <span className="text-[12px] text-[#A3A3A3]">· {items.length}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((entry) => (
          <Thumb
            key={entry.index}
            entry={entry}
            isPrimary={entry.index === primaryIndex}
            colors={colors}
            showReassign={showReassign}
            onRemove={onRemove}
            onUpdateAlt={onUpdateAlt}
            onReassign={onReassign}
            onMakePrimary={onMakePrimary}
          />
        ))}

        <button
          type="button"
          onClick={() => onOpenPicker(colorId)}
          disabled={uploading}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-1 self-start rounded-md border border-dashed border-black/15 bg-white text-sm text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink",
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
    </div>
  );
}

type ThumbProps = {
  entry: IndexedItem;
  isPrimary: boolean;
  colors: ProductColor[];
  showReassign: boolean;
  onRemove: (index: number) => void;
  onUpdateAlt: (index: number, alt: string) => void;
  onReassign: (index: number, colorId: string | null) => void;
  onMakePrimary: (index: number) => void;
};

function Thumb({
  entry,
  isPrimary,
  colors,
  showReassign,
  onRemove,
  onUpdateAlt,
  onReassign,
  onMakePrimary,
}: ThumbProps) {
  const { img, index } = entry;
  // Orphan: assigned to a color that no longer exists → reads as unassigned.
  const selectValue = colors.some((c) => c.id === img.colorId)
    ? (img.colorId as string)
    : "";

  return (
    <div className="flex flex-col gap-2">
      <div className="group relative aspect-square overflow-hidden rounded-md bg-[#F0EDE8]">
        <Image
          src={img.url}
          alt={img.alt ?? ""}
          fill
          sizes="240px"
          className="object-cover"
          unoptimized
        />
        {isPrimary ? (
          <span className="absolute left-2 top-2 rounded-sm bg-gold px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-white">
            Principal
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 p-2 opacity-0 transition-opacity group-hover:opacity-100">
          {!isPrimary ? (
            <button
              type="button"
              onClick={() => onMakePrimary(index)}
              className="rounded-sm bg-white/90 px-2 py-0.5 text-[11px] font-medium text-ink shadow-sm hover:bg-white"
            >
              Hacer principal
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label="Quitar imagen"
            className="rounded-sm bg-white/90 px-2 py-0.5 text-[11px] font-medium text-[#DC3545] shadow-sm hover:bg-white"
          >
            Quitar
          </button>
        </div>
      </div>

      {showReassign ? (
        <select
          value={selectValue}
          onChange={(e) => onReassign(index, e.target.value === "" ? null : e.target.value)}
          aria-label={`Color de la imagen ${index + 1}`}
          className="h-8 rounded-md border border-black/10 bg-[#F7F7F5] px-2 text-[12px] text-ink outline-none transition-colors focus:border-ink/40 focus:bg-white"
        >
          <option value="">General</option>
          {colors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      ) : null}

      <input
        type="text"
        value={img.alt ?? ""}
        onChange={(e) => onUpdateAlt(index, e.target.value)}
        placeholder="Texto alternativo (alt)"
        aria-label={`Alt text de la imagen ${index + 1}`}
        className="h-8 rounded-md border border-black/10 bg-[#F7F7F5] px-2 text-[12px] text-ink outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white"
      />
    </div>
  );
}
