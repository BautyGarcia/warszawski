import { cache } from "react";
import { getContentMap } from "@/lib/content/fetch";
import { normalizeExternalUrl } from "@/lib/url";

export type OfficeAddress = {
  /** Nombre opcional del local. Ej: "Showroom". Vacio = se muestra la direccion. */
  name: string;
  /** Direccion postal completa. Ej: "Montevideo 536 1A, Capital Federal" */
  address: string;
  /** Telefono de linea opcional asociado a esta oficina. Vacio = no mostrar. */
  phone: string;
  /** Link de Google Maps opcional. Vacio = se busca la direccion en Maps. */
  mapsUrl: string;
};

export type ContactInfo = {
  /** Numero de WhatsApp (uno solo). Usado en TODOS los CTAs del sitio. */
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  /** Lista de oficinas. La primera es la principal en el schema SEO. */
  addresses: OfficeAddress[];
};

/**
 * Parsea un valor de field_type "list" (JSON array de strings) a array
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
 * Parsea un valor de field_type "address_list" (JSON array de objetos
 * {name, address, phone, mapsUrl}) a OfficeAddress[]. Acepta defensivamente
 * strings sueltos y objetos sin name/mapsUrl (formatos anteriores).
 */
export function parseAddressListValue(
  raw: string | undefined | null,
): OfficeAddress[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item): OfficeAddress | null => {
        if (typeof item === "string") {
          const address = item.trim();
          if (!address) return null;
          return { name: "", address, phone: "", mapsUrl: "" };
        }
        if (item && typeof item === "object") {
          const obj = item as Record<string, unknown>;
          const str = (k: string) => String(obj[k] ?? "").trim();
          const address = str("address");
          if (!address) return null;
          return {
            name: str("name"),
            address,
            phone: str("phone"),
            mapsUrl: normalizeExternalUrl(str("mapsUrl")),
          };
        }
        return null;
      })
      .filter((it): it is OfficeAddress => it !== null);
  } catch {
    return [];
  }
}

/**
 * Link de Google Maps de un local: el cargado en el admin, o una busqueda de
 * la direccion si no hay link (asi el boton nunca queda sin destino).
 */
export function getMapsHref(office: OfficeAddress): string {
  if (office.mapsUrl) return office.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`;
}

/**
 * Lee los datos de contacto desde el contenido editable.
 * Cacheado por request con React `cache()` para deduplicar la query
 * cuando varios componentes server lo invocan en el mismo render.
 *
 * Fallback al env var `NEXT_PUBLIC_WHATSAPP_NUMBER` si la DB tiene el
 * WhatsApp vacio — util hasta que el usuario lo configure desde el admin.
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
    addresses: parseAddressListValue(content["contact.address.list"]),
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
