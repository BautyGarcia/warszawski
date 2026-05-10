/**
 * Constantes estáticas del sitio. Datos de contacto (WhatsApp, redes sociales)
 * se editan desde el admin y se leen vía `lib/content/contact.ts`.
 */
export const SITE_CONFIG = {
  brand: {
    name: "WARSZAWSKI",
    tagline: "Anteojos de diseño. Mayoristas y distribuidores.",
    legal: "© Warszawski. Todos los derechos reservados.",
  },
  nav: {
    public: [
      { label: "Coleccion", href: "/#coleccion" },
      { label: "Nosotros", href: "/nosotros" },
    ],
  },
} as const;
