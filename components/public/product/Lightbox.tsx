"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.5;
const ZOOM_DOUBLE = 2.5;
const DRAG_THRESHOLD = 4;

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
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const movedRef = useRef(false);

  const isZoomed = scale > 1;

  function resetZoom() {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  useEffect(() => {
    resetZoom();
  }, [index]);

  useEffect(() => {
    if (!open) resetZoom();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP));
        return;
      }
      if (e.key === "-" || e.key === "_") {
        setScale((s) => {
          const next = Math.max(MIN_SCALE, s - SCALE_STEP);
          if (next === 1) setOffset({ x: 0, y: 0 });
          return next;
        });
        return;
      }
      if (e.key === "0") {
        resetZoom();
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

  function zoomIn() {
    setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP));
  }

  function zoomOut() {
    setScale((s) => {
      const next = Math.max(MIN_SCALE, s - SCALE_STEP);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }

  function toggleZoom() {
    if (isZoomed) resetZoom();
    else setScale(ZOOM_DOUBLE);
  }

  function handleWheel(e: React.WheelEvent) {
    const delta = e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
    setScale((s) => {
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s + delta));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!isZoomed) return;
    e.preventDefault();
    movedRef.current = false;
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      movedRef.current = true;
    }
    setOffset({
      x: dragStart.current.ox + dx,
      y: dragStart.current.oy + dy,
    });
  }

  function handlePointerUp(e: React.PointerEvent) {
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }

  function handleImageClick() {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    toggleZoom();
  }

  const cursorClass = isZoomed
    ? dragging
      ? "cursor-grabbing"
      : "cursor-grab"
    : "cursor-zoom-in";

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
        className="relative h-[85vh] w-[90vw] touch-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        <div
          className={cn(
            "absolute inset-0 select-none",
            cursorClass,
            !dragging && "transition-transform duration-200 ease-out",
            scale === 1 && "motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300",
          )}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
          onClick={handleImageClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <Image
            key={active.url}
            src={active.url}
            alt={active.alt || productName}
            fill
            className="pointer-events-none object-contain"
            sizes="90vw"
            priority
            draggable={false}
          />
        </div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-ink/60 px-2 py-1.5 backdrop-blur md:left-8 md:translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          aria-label="Reducir"
          className="flex size-7 items-center justify-center rounded-full text-bg/70 transition-colors hover:text-bg disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={resetZoom}
          aria-label="Ajustar a pantalla"
          className="min-w-[44px] rounded-full px-2 py-1 text-[11px] font-medium tabular-nums text-bg/70 transition-colors hover:text-bg"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          aria-label="Ampliar"
          className="flex size-7 items-center justify-center rounded-full text-bg/70 transition-colors hover:text-bg disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {hasMultiple ? (
        <span className="pointer-events-none absolute bottom-7 right-6 text-[11px] uppercase tracking-[0.2em] text-bg/50 md:right-8">
          {index + 1} / {images.length}
        </span>
      ) : null}
    </div>
  );
}
