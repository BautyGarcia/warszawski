"use client";

import { ContentField } from "./ContentField";
import type { ContentField as ContentFieldDef } from "@/lib/content/keys";

type Props = {
  title: string;
  fields: ContentFieldDef[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

export function ContentSection({ title, fields, values, onChange }: Props) {
  return (
    <section className="flex flex-col gap-5 border-b border-black/8 pb-10">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B6B6B]">
        {title}
      </h2>
      <div className="flex flex-col gap-5">
        {fields.map((f) => (
          <ContentField
            key={f.key}
            field={f}
            value={values[f.key] ?? ""}
            onChange={(v) => onChange(f.key, v)}
          />
        ))}
      </div>
    </section>
  );
}
