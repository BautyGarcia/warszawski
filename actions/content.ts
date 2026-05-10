"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/guard";
import { SITE_CONTENT_FIELDS } from "@/lib/content/keys";

type Update = { key: string; value: string };

export async function updateContentAction(updates: Update[]) {
  await requireAdmin();
  if (updates.length === 0) return { ok: true };

  const sb = getSupabaseAdmin();
  const now = new Date().toISOString();

  const rows = updates.map((u) => {
    const idx = SITE_CONTENT_FIELDS.findIndex((f) => f.key === u.key);
    const field = SITE_CONTENT_FIELDS[idx];
    if (!field) throw new Error(`Key desconocida: ${u.key}`);
    return {
      key: u.key,
      value: u.value,
      page: field.page,
      section: field.section,
      label: field.label,
      field_type: field.fieldType,
      sort_order: idx + 1,
      updated_at: now,
    };
  });

  const { error } = await sb
    .from("site_content")
    .upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  return { ok: true };
}
