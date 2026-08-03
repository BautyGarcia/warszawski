/**
 * Medición de Google (GA4 + Google Ads) para el sitio.
 *
 * El modelo de negocio no tiene checkout: la conversión es el click al CTA de
 * WhatsApp. Por eso la "conversión" que reportamos a Google Ads es el lead de
 * WhatsApp, y ahí termina la medición: no arrastramos el GCLID a la conversación
 * (ensuciaba el primer mensaje del lead y hoy no alimenta ninguna puja — ambas
 * campañas son Maximizar Clics). Si algún día hace falta cerrar el loop con
 * conversiones offline, ver el commit 305d783.
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
