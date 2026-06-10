"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
const GENERAL_GROUP = "__general__";

export function ImageUploader({ value, onChange, colors }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingColorId = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validIds = new Set(colors.map((c) => c.id));
  const hasColors = colors.length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function isGeneral(img: ImageItem): boolean {
    return img.colorId == null || !validIds.has(img.colorId);
  }

  function groupKeyOf(img: ImageItem): string {
    return isGeneral(img) ? GENERAL_GROUP : (img.colorId as string);
  }

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

  // Reorder within a single group (color or general). The reordered images are
  // written back into the same global slots the group occupied, so the other
  // groups keep their positions untouched. Cross-group drags are ignored.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeUrl = String(active.id);
    const overUrl = String(over.id);
    const activeImg = value.find((im) => im.url === activeUrl);
    const overImg = value.find((im) => im.url === overUrl);
    if (!activeImg || !overImg) return;
    if (groupKeyOf(activeImg) !== groupKeyOf(overImg)) return;

    const group = groupKeyOf(activeImg);
    const groupIndices = value
      .map((img, i) => ({ img, i }))
      .filter((e) => groupKeyOf(e.img) === group)
      .map((e) => e.i);
    const groupImages = groupIndices.map((i) => value[i]);

    const from = groupImages.findIndex((im) => im.url === activeUrl);
    const to = groupImages.findIndex((im) => im.url === overUrl);
    if (from === -1 || to === -1) return;

    const reordered = arrayMove(groupImages, from, to);
    const next = [...value];
    groupIndices.forEach((globalIdx, k) => {
      next[globalIdx] = reordered[k];
    });
    onChange(next);
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
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
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
          JPG, PNG, WebP o AVIF. Máximo 5MB por imagen. Arrastrá las fotos desde
          el ícono para cambiar el orden; la primera de cada color es la
          principal.
          {hasColors
            ? " Las imágenes en “General” se usan como respaldo cuando un color no tiene fotos propias."
            : null}{" "}
          El texto alternativo describe la imagen para buscadores y lectores de pantalla.
        </p>
      </div>
    </DndContext>
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
}: SectionProps) {
  const primaryIndex = items[0]?.index;
  const ids = items.map((e) => e.img.url);

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
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          {items.map((entry) => (
            <Thumb
              key={entry.img.url}
              entry={entry}
              isPrimary={entry.index === primaryIndex}
              colors={colors}
              showReassign={showReassign}
              onRemove={onRemove}
              onUpdateAlt={onUpdateAlt}
              onReassign={onReassign}
            />
          ))}
        </SortableContext>

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
};

function Thumb({
  entry,
  isPrimary,
  colors,
  showReassign,
  onRemove,
  onUpdateAlt,
  onReassign,
}: ThumbProps) {
  const { img, index } = entry;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: img.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Orphan: assigned to a color that no longer exists → reads as unassigned.
  const selectValue = colors.some((c) => c.id === img.colorId)
    ? (img.colorId as string)
    : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex flex-col gap-2", isDragging && "z-20 opacity-80")}
    >
      {/* The whole photo is the drag surface; inner controls stop propagation
          so they stay clickable and don't start a drag. */}
      <div
        className="group relative aspect-square cursor-grab touch-none overflow-hidden rounded-md bg-[#F0EDE8] active:cursor-grabbing"
        aria-label="Arrastrar para reordenar"
        {...attributes}
        {...listeners}
      >
        <Image
          src={img.url}
          alt={img.alt ?? ""}
          fill
          sizes="240px"
          className="object-cover"
          unoptimized
          draggable={false}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-2 top-2 flex size-7 items-center justify-center rounded-sm bg-white/85 text-ink/70 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        >
          <GripVertical size={15} />
        </span>
        {isPrimary ? (
          <span className="absolute left-2 top-2 rounded-sm bg-gold px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-white">
            Principal
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 flex justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onRemove(index)}
            onPointerDown={(e) => e.stopPropagation()}
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
