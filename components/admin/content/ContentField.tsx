"use client";

import type { ContentField as ContentFieldDef } from "@/lib/content/keys";

const inputCls =
  "h-10 rounded-md border border-black/10 bg-[#F7F7F5] px-3 text-sm text-ink outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white";

const textareaCls =
  "min-h-24 rounded-md border border-black/10 bg-[#F7F7F5] px-3 py-2 text-sm leading-6 text-ink outline-none transition-colors placeholder:text-[#999] focus:border-ink/40 focus:bg-white";

type Props = {
  field: ContentFieldDef;
  value: string;
  onChange: (v: string) => void;
};

export function ContentField({ field, value, onChange }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink">{field.label}</span>
      {field.fieldType === "long_text" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={textareaCls}
        />
      ) : (
        <input
          type={field.fieldType === "url" ? "url" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </label>
  );
}
