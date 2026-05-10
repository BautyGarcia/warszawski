import { cache } from "react";
import { getContentMap } from "@/lib/content/fetch";

export type ContactInfo = {
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
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
      content["contact.whatsapp_number"] ||
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
      "",
    instagramUrl: content["contact.instagram_url"] ?? "",
    facebookUrl: content["contact.facebook_url"] ?? "",
    tiktokUrl: content["contact.tiktok_url"] ?? "",
  };
});
