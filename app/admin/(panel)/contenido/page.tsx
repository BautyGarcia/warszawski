import { ContentTabs } from "@/components/admin/content/ContentTabs";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_CONTENT_FIELDS } from "@/lib/content/keys";

export const dynamic = "force-dynamic";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

async function loadValues(): Promise<Record<string, string>> {
  const defaults = Object.fromEntries(
    SITE_CONTENT_FIELDS.map((f) => [f.key, f.defaultValue]),
  );
  if (!supabaseConfigured) return defaults;

  try {
    const sb = getSupabaseAdmin();
    const { data } = await sb.from("site_content").select("key,value");
    if (!data) return defaults;
    const remote = Object.fromEntries(data.map((r) => [r.key, r.value]));
    return { ...defaults, ...remote };
  } catch {
    return defaults;
  }
}

export default async function ContentPage() {
  const initialValues = await loadValues();
  return <ContentTabs initialValues={initialValues} />;
}
