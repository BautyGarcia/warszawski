"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PRESETS = [
  "#0A0A0A",
  "#2C2C2C",
  "#5A3A1F",
  "#7A5C3E",
  "#A86B2C",
  "#C4A265",
  "#E8DDD0",
  "#F5F2EC",
  "#7A1B2E",
  "#1F3A5C",
];

type Props = {
  value: string;
  onChange: (hex: string) => void;
  className?: string;
};

export function ColorPicker({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function commitDraft() {
    if (/^#[0-9a-fA-F]{6}$/.test(draft)) {
      onChange(draft);
    } else {
      setDraft(value);
    }
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Elegir color"
        className="size-9 shrink-0 rounded-md border border-black/10 transition-shadow hover:shadow-sm"
        style={{ backgroundColor: value }}
      />
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 flex w-[208px] flex-col gap-3 rounded-md border border-black/10 bg-white p-3 shadow-lg">
          <div className="grid grid-cols-5 gap-2">
            {PRESETS.map((c) => {
              const active = value.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                  }}
                  aria-label={c}
                  className={cn(
                    "size-7 rounded-full border-2 transition-transform hover:scale-110",
                    active ? "border-ink" : "border-black/10",
                  )}
                  style={{ backgroundColor: c }}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 border-t border-black/8 pt-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6B6B6B]">
              Hex
            </span>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitDraft}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitDraft();
                  setOpen(false);
                }
              }}
              maxLength={7}
              className="h-8 flex-1 rounded-sm border border-black/10 bg-[#F7F7F5] px-2 font-mono text-xs uppercase outline-none transition-colors focus:border-ink/40 focus:bg-white"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
