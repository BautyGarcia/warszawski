import { createClient } from "@supabase/supabase-js";

/**
 * Cliente stateless para lecturas del sitio público (anon key).
 * No lee cookies — permite que las páginas que lo usan sean SSG/ISR
 * (vs `getSupabaseServer()` que siempre invoca `cookies()` para refrescar
 * la sesión de auth, lo cual fuerza dynamic rendering).
 */
export function getSupabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
