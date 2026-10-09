/**
 * Files copied from Supabase Storage live in the dbm bucket under `<bucket>/<key>`, served from
 * S3_PUBLIC_BASE_URL. Rows written before the migration still hold the Supabase public URL, so reads
 * map them on the fly. `scripts/rewrite-storage-urls.ts` fixes the rows for good (re-run it after
 * cutover, since the cutover re-copies the Supabase data).
 */
const LEGACY_PUBLIC_URL = /^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;

export function rewriteLegacyStorageUrl<T extends string | null | undefined>(url: T): T {
  const base = process.env.S3_PUBLIC_BASE_URL;
  if (!url || !base) return url;
  const m = LEGACY_PUBLIC_URL.exec(url);
  if (!m) return url;
  return `${base}/${m[1]}/${m[2]}` as T;
}
