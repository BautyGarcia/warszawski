"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [hexDraft, setHexDraft] = useState(value);

  function commitHex() {
    if (/^#[0-9a-fA-F]{6}$/.test(hexDraft)) {
      onChange(hexDraft);
    } else {
      setHexDraft(value);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setHexDraft(value);
      }}
    >
      <PopoverTrigger
        type="button"
        aria-label="Elegir color"
        className={cn(
          "size-10 shrink-0 rounded-md border border-black/10 transition-shadow hover:shadow-sm",
          className,
        )}
        style={{ backgroundColor: value }}
      />
      <PopoverContent
        align="end"
        sideOffset={8}
        className="flex w-56 flex-col gap-3 p-3"
      >
        <div className="color-picker-wrapper">
          <HexColorPicker
            color={value}
            onChange={(c) => {
              onChange(c);
              setHexDraft(c);
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6B6B6B]">
            Hex
          </span>
          <input
            type="text"
            value={hexDraft}
            onChange={(e) => setHexDraft(e.target.value)}
            onBlur={commitHex}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitHex();
              }
            }}
            maxLength={7}
            className="h-8 flex-1 rounded-sm border border-black/10 bg-[#F7F7F5] px-2 font-mono text-xs uppercase outline-none transition-colors focus:border-ink/40 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-5 gap-1.5 border-t border-black/8 pt-3">
          {PRESETS.map((c) => {
            const active = value.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setHexDraft(c);
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
      </PopoverContent>
    </Popover>
  );
}
