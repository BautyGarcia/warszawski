import { cache } from "react";
import { getContentMap } from "@/lib/content/fetch";
import { parseAddressListValue, type ContactInfo } from "@/lib/content/contact-parse";
import { normalizeExternalUrl } from "@/lib/url";

// Server-only (reads the database). Client components import the parsers from contact-parse.ts.
export {
  getMapsHref,
  parseAddressForSchema,
  parseAddressListValue,
  parseListValue,
  type ContactInfo,
  type OfficeAddress,
} from "@/lib/content/contact-parse";
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
