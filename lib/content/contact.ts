import { cache } from "react";
import { getContentMap } from "@/lib/content/fetch";
import { normalizeExternalUrl } from "@/lib/url";

export type ContactInfo = {
  /** Primer numero de la lista (o env var fallback). Usado en CTAs. */
  whatsappNumber: string;
  /** Lista completa de numeros. Renderizada en footer. */
  whatsappNumbers: string[];
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  /** Primera direccion de la lista. Usada como principal en schema. */
  address: string;
  /** Lista completa de direcciones. Renderizada en footer + schema. */
  addresses: string[];
};

/**
 * Parsea un valor de field_type "list" (JSON array stringificado) a array
 * de strings, filtrando vacios. Devuelve [] ante cualquier error.
 */
export function parseListValue(raw: string | undefined | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => (typeof v === "string" ? v : String(v)))
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  } catch {
    return [];
  }
}

/**
 * Lee los datos de contacto desde el contenido editable.
 * Cacheado por request con React `cache()` para deduplicar la query
 * cuando varios componentes server lo invocan en el mismo render.
 */
export const getContactInfo = cache(async (): Promise<ContactInfo> => {
  const content = await getContentMap("contact");

  const whatsappNumbers = parseListValue(content["contact.whatsapp.numbers"]);
  const addresses = parseListValue(content["contact.address.list"]);

  return {
    whatsappNumber:
      whatsappNumbers[0] || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    whatsappNumbers,
    instagramUrl: normalizeExternalUrl(content["contact.social.instagram"]),
    facebookUrl: normalizeExternalUrl(content["contact.social.facebook"]),
    tiktokUrl: normalizeExternalUrl(content["contact.social.tiktok"]),
    address: addresses[0] ?? "",
    addresses,
  };
});

/**
 * Parse defensivo de una direccion individual para schema.org PostalAddress.
 * Splitea por la ultima coma: street = antes, locality = despues.
 * Si no hay coma, todo va a streetAddress y locality default a Buenos Aires.
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
