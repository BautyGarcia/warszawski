/**
 * Normaliza una URL externa: si no empieza con `http://` o `https://`,
 * antepone `https://`. Devuelve string vacío si el input está vacío.
 *
 * Cubre los casos comunes que un editor puede pegar:
 *   "https://instagram.com/warszawski"  → "https://instagram.com/warszawski"
 *   "instagram.com/warszawski"          → "https://instagram.com/warszawski"
 *   "www.instagram.com/warszawski"      → "https://www.instagram.com/warszawski"
 *   ""                                  → ""
 */
export function normalizeExternalUrl(input: string | null | undefined): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
