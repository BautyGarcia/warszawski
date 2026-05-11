"use client";

import Image from "next/image";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

type Props = {
  open: boolean;
  onClose: () => void;
  images: ProductImage[];
  index: number;
  onIndexChange: (next: number) => void;
  productName: string;
};

export function Lightbox({
  open,
  onClose,
  images,
  index,
  onIndexChange,
  productName,
}: Props) {
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (images.length <= 1) return;
      if (e.key === "ArrowLeft") {
        onIndexChange((index - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        onIndexChange((index + 1) % images.length);
      }
    }

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, index, images.length, onClose, onIndexChange]);

  if (!open || images.length === 0) return null;

  const active = images[index];
  const hasMultiple = images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ${index + 1} de ${images.length} — ${productName}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Cerrar"
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full text-bg/70 transition-colors hover:text-bg md:right-8 md:top-8"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + images.length) % images.length);
            }}
            aria-label="Imagen anterior"
            className="absolute left-2 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full text-bg/70 transition-colors hover:text-bg md:left-8"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % images.length);
            }}
            aria-label="Imagen siguiente"
            className="absolute right-2 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full text-bg/70 transition-colors hover:text-bg md:right-8"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      ) : null}

      <div
        className={cn(
          "relative flex h-[85vh] w-[90vw] items-center justify-center motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt || productName}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>

      {hasMultiple ? (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-bg/50">
          {index + 1} / {images.length}
        </span>
      ) : null}
    </div>
  );
}
