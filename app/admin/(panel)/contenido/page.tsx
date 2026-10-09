import { ContentTabs } from "@/components/admin/content/ContentTabs";
import { SITE_CONTENT_FIELDS } from "@/lib/content/keys";
import { db } from "@/lib/db";
import { site_content } from "@/lib/schema";
import { rewriteLegacyStorageUrl } from "@/lib/storage/legacy-url";

export const dynamic = "force-dynamic";

const dbConfigured = !!process.env.DATABASE_URL;

async function loadValues(): Promise<Record<string, string>> {
  const defaults = Object.fromEntries(
    SITE_CONTENT_FIELDS.map((f) => [f.key, f.defaultValue]),
  );
  if (!dbConfigured) return defaults;

  try {
    const rows = await db.select({ key: site_content.key, value: site_content.value }).from(site_content);
    const remote = Object.fromEntries(rows.map((r) => [r.key, rewriteLegacyStorageUrl(r.value)]));
    return { ...defaults, ...remote };
  } catch {
    return defaults;
  }
}

export default async function ContentPage() {
  const initialValues = await loadValues();
  return <ContentTabs initialValues={initialValues} />;
}
