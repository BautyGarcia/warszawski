"use server";

import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { SITE_CONTENT_FIELDS } from "@/lib/content/keys";
import { db } from "@/lib/db";
import { site_content } from "@/lib/schema";

type Update = { key: string; value: string };

export async function updateContentAction(updates: Update[]) {
  await requireAdmin();
  if (updates.length === 0) return { ok: true };

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

  await db
    .insert(site_content)
    .values(rows)
    .onConflictDoUpdate({
      target: site_content.key,
      set: {
        value: sql`excluded.value`,
        page: sql`excluded.page`,
        section: sql`excluded.section`,
        label: sql`excluded.label`,
        field_type: sql`excluded.field_type`,
        sort_order: sql`excluded.sort_order`,
        updated_at: sql`excluded.updated_at`,
      },
    });

  revalidatePath("/", "layout");
  return { ok: true };
}
