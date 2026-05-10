"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const NULL_SENTINEL = "__null__";

type Option = { value: string; label: string };

type Props = {
  label?: string;
  hint?: string;
  error?: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: Option[];
  placeholder?: string;
  size?: "sm" | "default";
  className?: string;
  includeEmpty?: boolean;
};

export function SelectField({
  label,
  hint,
  error,
  value,
  onChange,
  options,
  placeholder = "—",
  size = "default",
  className,
  includeEmpty = true,
}: Props) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label ? <span className="text-[13px] font-medium text-ink">{label}</span> : null}
      <Select
        value={value ?? NULL_SENTINEL}
        onValueChange={(v) => onChange(v === NULL_SENTINEL ? null : v)}
      >
        <SelectTrigger
          size={size}
          className={cn(
            "rounded-md border-black/10 bg-[#F7F7F5] text-sm text-ink shadow-none transition-colors focus-visible:border-ink/40 focus-visible:bg-white",
            size === "default" && "h-10",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {includeEmpty ? <SelectItem value={NULL_SENTINEL}>—</SelectItem> : null}
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <span className="text-[12px] text-red-700">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-[#6B6B6B]">{hint}</span>
      ) : null}
    </label>
  );
}
