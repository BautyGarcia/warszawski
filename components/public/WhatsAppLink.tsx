"use client";

import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppLead } from "@/lib/analytics";

type Props = {
  number: string;
  message?: string;
  /** Origen del CTA, para atribuir la conversión (footer, exclusivo, …). */
  source?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Link de WhatsApp con tracking (conversión de Google Ads), pero SIN estilos
 * propios: el estilo lo define quien lo usa vía `className`.
 * Para CTAs de WhatsApp que no son el botón sólido estándar (footer, bloque de
 * producto exclusivo). Comparte exactamente la lógica de medición de
 * WhatsAppButton — todos los CTAs de WhatsApp del sitio deben pasar por uno de
 * los dos para que la conversión se dispare.
 */
export function WhatsAppLink({
  number,
  message,
  source = "generico",
  className,
  children,
}: Props) {
  const href = buildWhatsAppUrl(number, message);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppLead(source)}
      className={className}
    >
      {children}
    </Link>
  );
}
