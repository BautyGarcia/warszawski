"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { appendGclidToMessage, trackWhatsAppLead } from "@/lib/analytics";

type Props = {
  number: string;
  message?: string;
  /** Origen del CTA, para atribuir la conversión (footer, exclusivo, …). */
  source?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Link de WhatsApp con tracking (conversión de Google Ads + GCLID en el mensaje),
 * pero SIN estilos propios: el estilo lo define quien lo usa vía `className`.
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
  // SSR y primer render: URL base sin gclid (válida para crawlers y no-JS).
  // Tras montar, si hay un gclid guardado, la "mejoramos" con la referencia.
  const [href, setHref] = useState(() => buildWhatsAppUrl(number, message));

  useEffect(() => {
    setHref(buildWhatsAppUrl(number, appendGclidToMessage(message)));
  }, [number, message]);

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
