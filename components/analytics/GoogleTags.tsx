"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  GA_ID,
  GOOGLE_ADS_ID,
  analyticsEnabled,
  captureGclidFromUrl,
} from "@/lib/analytics";

/**
 * Carga el Google tag (gtag.js) una sola vez y configura, con el mismo script,
 * GA4 y Google Ads. Estrategia `afterInteractive`: no bloquea la hidratación
 * (recomendado por Next para tag managers / analytics).
 *
 * Si no hay ningún ID en el entorno, no renderiza nada: en dev o antes de tener
 * las cuentas creadas, el sitio no carga scripts de Google.
 */
export function GoogleTags() {
  // Captura el gclid en cada carga de página (incluye navegaciones del cliente,
  // por si el usuario entra por una URL con gclid y luego navega).
  useEffect(() => {
    captureGclidFromUrl();
  }, []);

  if (!analyticsEnabled) return null;

  const primaryId = GA_ID || GOOGLE_ADS_ID;

  return (
    <>
      <Script
        id="gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
          ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
        `}
      </Script>
    </>
  );
}
