export const SITE_CONFIG = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000",
  instagramUrl: "https://instagram.com/warszawski",
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
