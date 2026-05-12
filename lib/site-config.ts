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
      // TEMP: Editorial temporalmente escondido del nav publico hasta
      // confirmar con el cliente si la seccion se va a usar. Las rutas
      // /editorial y /editorial/[slug] siguen existiendo y funcionando si
      // alguien las visita por URL directa; solo se ocultan los links.
      // Para reactivar: descomentar la linea de abajo.
      // { label: "Editorial", href: "/editorial" },
      { label: "Nosotros", href: "/nosotros" },
    ],
  },
} as const;
