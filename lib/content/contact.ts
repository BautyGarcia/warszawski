import { cache } from "react";
import { getContentMap } from "@/lib/content/fetch";
import { normalizeExternalUrl } from "@/lib/url";

export type ContactInfo = {
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  address: string;
};

/**
 * Lee los datos de contacto desde el contenido editable.
 * Cacheado por request con React `cache()` para deduplicar la query
 * cuando varios componentes server lo invocan en el mismo render.
 *
 * Fallback al env var `NEXT_PUBLIC_WHATSAPP_NUMBER` si la DB tiene
 * el WhatsApp vacío — útil hasta que el usuario lo configure desde el admin.
 */
export const getContactInfo = cache(async (): Promise<ContactInfo> => {
  const content = await getContentMap("contact");
  return {
    whatsappNumber:
      content["contact.whatsapp.number"] ||
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
      "",
    instagramUrl: normalizeExternalUrl(content["contact.social.instagram"]),
    facebookUrl: normalizeExternalUrl(content["contact.social.facebook"]),
    tiktokUrl: normalizeExternalUrl(content["contact.social.tiktok"]),
    address: (content["contact.address.full"] ?? "").trim(),
  };
});

/**
 * Parse defensivo de la direccion para JSON-LD schema.org PostalAddress.
 * El usuario edita un string libre; intentamos sacar locality del ultimo
 * fragmento despues de coma, sino default Buenos Aires.
 */
export function parseAddressForSchema(full: string): {
  streetAddress: string;
  addressLocality: string;
  addressCountry: string;
} {
  const trimmed = full.trim();
  if (!trimmed) {
    return {
      streetAddress: "",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    };
  }
  const idx = trimmed.lastIndexOf(",");
  if (idx === -1) {
    return {
      streetAddress: trimmed,
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    };
  }
  return {
    streetAddress: trimmed.slice(0, idx).trim(),
    addressLocality: trimmed.slice(idx + 1).trim() || "Buenos Aires",
    addressCountry: "AR",
  };
}
