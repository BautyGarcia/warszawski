/**
 * Medición de Google (GA4 + Google Ads) para el sitio.
 *
 * El modelo de negocio no tiene checkout: la conversión es el click al CTA de
 * WhatsApp. Por eso la "conversión" que reportamos a Google Ads es el lead de
 * WhatsApp. Para poder cerrar el loop con conversiones offline (cuando un lead
 * de WhatsApp termina en venta), arrastramos el GCLID de Google Ads dentro del
 * mensaje de WhatsApp: el operador lo ve, lo asocia a la venta y lo sube a
 * Google Ads como conversión offline.
 *
 * Todos los IDs se leen de variables de entorno públicas. Si no están seteadas,
 * el tracking se desactiva solo (no rompe nada, no carga scripts).
 */

// ── IDs (se cargan desde el .env; ver .env.example) ──────────────────────────

/** GA4 measurement ID, formato `G-XXXXXXX`. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** Google Ads conversion ID, formato `AW-XXXXXXXXX`. */
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

/**
 * Label de la acción de conversión "lead de WhatsApp" que Google Ads te da al
 * crear la conversión. Es la parte después de la barra en el `send_to`:
 * `AW-XXXXXXXXX/AbC-D_efGhIj`  →  el label es `AbC-D_efGhIj`.
 */
export const GOOGLE_ADS_WHATSAPP_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL ?? "";

/** Hay al menos un tag configurado → cargar gtag.js. */
export const analyticsEnabled = GA_ID !== "" || GOOGLE_ADS_ID !== "";

// ── GCLID: captura y persistencia ────────────────────────────────────────────

const GCLID_KEY = "wz_gclid";
const GCLID_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 días

type StoredGclid = { value: string; ts: number };

/**
 * Lee el `gclid` (o `gbraid`/`wbraid`) de la URL actual y lo guarda en
 * localStorage con TTL. Se llama una vez al montar en cada carga de página.
 * Idempotente: si la URL no trae gclid, no pisa el que ya estaba guardado.
 */
export function captureGclidFromUrl(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const gclid =
    params.get("gclid") || params.get("gbraid") || params.get("wbraid");
  if (!gclid) return;
  try {
    const payload: StoredGclid = { value: gclid, ts: Date.now() };
    window.localStorage.setItem(GCLID_KEY, JSON.stringify(payload));
  } catch {
    // localStorage bloqueado (modo privado / cookies off): seguimos sin romper.
  }
}

/** Devuelve el gclid guardado si no venció, o "" si no hay/venció. */
export function getStoredGclid(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(GCLID_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as StoredGclid;
    if (!parsed?.value || Date.now() - parsed.ts > GCLID_TTL_MS) return "";
    return parsed.value;
  } catch {
    return "";
  }
}

/**
 * Adjunta el gclid al final del mensaje de WhatsApp en una línea aparte, para
 * que el operador pueda copiarlo y subir la conversión offline. Si no hay gclid,
 * devuelve el mensaje tal cual.
 */
export function appendGclidToMessage(message: string | undefined): string | undefined {
  const gclid = getStoredGclid();
  if (!gclid) return message;
  const tag = `[ref: ${gclid}]`;
  return message ? `${message}\n\n${tag}` : tag;
}

// ── Eventos ──────────────────────────────────────────────────────────────────

/**
 * Reporta un lead de WhatsApp: evento GA4 + conversión de Google Ads. Es la
 * conversión primaria del sitio. `source` identifica desde qué CTA se disparó
 * (hero, cta_final, producto, header, footer, coleccion).
 */
export function trackWhatsAppLead(source: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "whatsapp_lead", { source });

  if (GOOGLE_ADS_ID && GOOGLE_ADS_WHATSAPP_LABEL) {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_WHATSAPP_LABEL}`,
    });
  }
}

/** Evento secundario (no conversión): click al botón de showroom/mapa. */
export function trackShowroomClick(): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "showroom_click");
}
