import { CATEGORY_META } from "@/lib/category";

export type ContentField = {
  key: string;
  page: "home" | "about" | "contact";
  section: string;
  label: string;
  fieldType: "short_text" | "long_text" | "url" | "image" | "list" | "address_list";
  /**
   * Default value.
   * - Para fieldType "list" es un JSON array stringificado (ej: '["a","b"]').
   * - Para fieldType "address_list" es JSON array de objetos
   *   '[{"address":"...","phone":"..."}]'.
   * - Para el resto es el string crudo.
   */
  defaultValue: string;
  placeholder?: string;
  hint?: string;
};

export const SITE_CONTENT_FIELDS: ContentField[] = [
  // ── HOME / hero ──────────────────────────────────────────
  {
    key: "home.hero.label",
    page: "home",
    section: "hero",
    label: "Etiqueta del hero",
    fieldType: "short_text",
    defaultValue: "Modelaje exclusivo en armazones y anteojos de sol",
  },
  {
    key: "home.hero.subtitle",
    page: "home",
    section: "hero",
    label: "Subtitulo del hero",
    fieldType: "short_text",
    defaultValue: "Con enorme variedad de colores en todas sus lineas.",
  },
  {
    key: "home.hero.cta",
    page: "home",
    section: "hero",
    label: "Texto boton CTA",
    fieldType: "short_text",
    defaultValue: "Escribinos por WhatsApp",
  },
  {
    key: "home.hero.subcta",
    page: "home",
    section: "hero",
    label: "Texto sub-CTA",
    fieldType: "short_text",
    defaultValue: "Venta solo a mayoristas y distribuidores",
  },

  // ── HOME / exclusive ─────────────────────────────────────
  {
    key: "home.exclusive.label",
    page: "home",
    section: "exclusive",
    label: "Etiqueta seccion exclusiva",
    fieldType: "short_text",
    defaultValue: "Oportunidades",
  },
  {
    key: "home.exclusive.title",
    page: "home",
    section: "exclusive",
    label: "Titulo seccion exclusiva",
    fieldType: "short_text",
    defaultValue: "Modelaje Exclusivo",
  },
  {
    key: "home.exclusive.description",
    page: "home",
    section: "exclusive",
    label: "Descripcion seccion exclusiva",
    fieldType: "long_text",
    defaultValue:
      "Calce y diseño de autor. Armazones pensadas para perdurar, con materiales que resisten el paso del tiempo.",
  },

  // ── HOME / collection ────────────────────────────────────
  {
    key: "home.collection.label",
    page: "home",
    section: "collection",
    label: "Etiqueta coleccion",
    fieldType: "short_text",
    defaultValue: "Todos los modelos",
  },
  {
    key: "home.collection.title",
    page: "home",
    section: "collection",
    label: "Titulo coleccion",
    fieldType: "short_text",
    defaultValue: "Nuestra Coleccion",
  },

  // ── HOME / brand ─────────────────────────────────────────
  {
    key: "home.brand.label",
    page: "home",
    section: "brand",
    label: "Etiqueta brand statement",
    fieldType: "short_text",
    defaultValue: "Solo Mayoristas",
  },
  {
    key: "home.brand.primary",
    page: "home",
    section: "brand",
    label: "Texto principal",
    fieldType: "long_text",
    defaultValue:
      "Interesantes ofertas en modelos de temporadas pasadas. Colores variados y amplisimo stock disponible para grandes compradores.",
  },
  {
    key: "home.brand.highlight",
    page: "home",
    section: "brand",
    label: "Frase destacada",
    fieldType: "long_text",
    defaultValue: "",
    hint: "Parrafo aparte, un poco mas grande, debajo del texto principal. Dejar vacio para no mostrarlo.",
  },
  {
    key: "home.brand.secondary",
    page: "home",
    section: "brand",
    label: "Texto secundario",
    fieldType: "long_text",
    defaultValue:
      "Mayoristas y distribuidores con muchos clientes y a la vanguardia de las nuevas tendencias. Consultanos por las opciones.",
  },

  // ── HOME / cta ───────────────────────────────────────────
  {
    key: "home.cta.title",
    page: "home",
    section: "cta",
    label: "Titulo CTA final",
    fieldType: "short_text",
    defaultValue: "Escribinos por WhatsApp",
  },
  {
    key: "home.cta.description",
    page: "home",
    section: "cta",
    label: "Descripcion CTA final",
    fieldType: "long_text",
    defaultValue:
      "Somos mayoristas. Oportunidades para grandes compradores con amplisimos stocks y colores variados en todas nuestras lineas.",
  },

  // ── HOME / categorias (headers de /coleccion/[category]) ──
  {
    key: "categories.sol.title",
    page: "home",
    section: "categories",
    label: "Anteojos de sol — Titulo",
    fieldType: "short_text",
    defaultValue: CATEGORY_META.sol.title,
    hint: "Titulo del header de la pagina /coleccion/sol (y SEO).",
  },
  {
    key: "categories.sol.description",
    page: "home",
    section: "categories",
    label: "Anteojos de sol — Descripcion",
    fieldType: "long_text",
    defaultValue: CATEGORY_META.sol.description,
  },
  {
    key: "categories.recetados.title",
    page: "home",
    section: "categories",
    label: "Anteojos recetados — Titulo",
    fieldType: "short_text",
    defaultValue: CATEGORY_META.recetados.title,
    hint: "Titulo del header de la pagina /coleccion/recetados (y SEO).",
  },
  {
    key: "categories.recetados.description",
    page: "home",
    section: "categories",
    label: "Anteojos recetados — Descripcion",
    fieldType: "long_text",
    defaultValue: CATEGORY_META.recetados.description,
  },

  // ── ABOUT / hero ─────────────────────────────────────────
  {
    key: "about.hero.label",
    page: "about",
    section: "hero",
    label: "Etiqueta hero",
    fieldType: "short_text",
    defaultValue: "Sobre Warszawski",
  },
  {
    key: "about.hero.title",
    page: "about",
    section: "hero",
    label: "Titulo hero",
    fieldType: "short_text",
    defaultValue: "Diseño que habla por si mismo",
  },

  // ── ABOUT / origin ───────────────────────────────────────
  {
    key: "about.origin.image",
    page: "about",
    section: "origin",
    label: "Imagen de la historia",
    fieldType: "image",
    defaultValue: "",
    hint: "Idealmente vertical (proporcion 5:6 o similar). Se muestra junto al texto.",
  },
  {
    key: "about.origin.title",
    page: "about",
    section: "origin",
    label: "Titulo historia",
    fieldType: "short_text",
    defaultValue: "Vision clara, estilo propio",
  },
  {
    key: "about.origin.p1",
    page: "about",
    section: "origin",
    label: "Parrafo 1",
    fieldType: "long_text",
    defaultValue:
      "Warszawski nace de una pasion por el diseño optico de autor. Cada armazon responde a una busqueda constante de calce, proporcion y caracter.",
  },
  {
    key: "about.origin.p2",
    page: "about",
    section: "origin",
    label: "Parrafo 2",
    fieldType: "long_text",
    defaultValue:
      "Esa vision se traduce hoy en anteojos que combinan la rigurosidad del diseño con materiales de primera linea. No buscamos seguir tendencias. Buscamos crear objetos que perduren.",
  },

  // ── ABOUT / values ───────────────────────────────────────
  {
    key: "about.value1.title",
    page: "about",
    section: "values",
    label: "Valor 01 - Titulo",
    fieldType: "short_text",
    defaultValue: "Diseño con intencion",
  },
  {
    key: "about.value1.description",
    page: "about",
    section: "values",
    label: "Valor 01 - Descripcion",
    fieldType: "long_text",
    defaultValue:
      "Cada modelo responde a una idea clara. Nada es arbitrario: la forma, el material, el color tienen un por que.",
  },
  {
    key: "about.value2.title",
    page: "about",
    section: "values",
    label: "Valor 02 - Titulo",
    fieldType: "short_text",
    defaultValue: "Materiales nobles",
  },
  {
    key: "about.value2.description",
    page: "about",
    section: "values",
    label: "Valor 02 - Descripcion",
    fieldType: "long_text",
    defaultValue:
      "Acetato italiano, titanio japones, lentes de primera calidad. Los materiales definen la experiencia tanto como el diseño.",
  },
  {
    key: "about.value3.title",
    page: "about",
    section: "values",
    label: "Valor 03 - Titulo",
    fieldType: "short_text",
    defaultValue: "Atencion personal",
  },
  {
    key: "about.value3.description",
    page: "about",
    section: "values",
    label: "Valor 03 - Descripcion",
    fieldType: "long_text",
    defaultValue:
      "No somos un carrito de compras. Te acompanamos en la eleccion, te asesoramos, y nos aseguramos de que el resultado sea perfecto.",
  },

  // ── ABOUT / cta ──────────────────────────────────────────
  {
    key: "about.cta.title",
    page: "about",
    section: "cta",
    label: "Titulo CTA",
    fieldType: "short_text",
    defaultValue: "Queremos conocerte",
  },
  {
    key: "about.cta.description",
    page: "about",
    section: "cta",
    label: "Descripcion CTA",
    fieldType: "long_text",
    defaultValue:
      "Escribinos por WhatsApp y charlemos sobre lo que estas buscando. Sin apuro, sin compromiso.",
  },

  // ── CONTACT / whatsapp ───────────────────────────────────
  {
    key: "contact.whatsapp.number",
    page: "contact",
    section: "whatsapp",
    label: "Numero de WhatsApp",
    fieldType: "short_text",
    defaultValue: "",
    placeholder: "5491100000000",
    hint: "Codigo de pais + numero, sin + ni espacios. Es uno solo — se usa en todos los CTAs del sitio.",
  },
  {
    key: "contact.whatsapp.maps",
    page: "contact",
    section: "whatsapp",
    label: "Link de Google Maps (showroom)",
    fieldType: "url",
    defaultValue:
      "https://www.google.com/maps/place/Montevideo+536,+C1019ABL+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.6025739,-58.389679,16z/data=!3m1!4b1!4m6!3m5!1s0x95bccac1265e5245:0xe109fa22d96fdd68!8m2!3d-34.6025739!4d-58.389679!16s%2Fg%2F11q2x8287_?entry=ttu",
    hint: "Pega el enlace de Google Maps de la direccion. Alimenta el boton 'Visite nuestro showroom' del inicio. Dejar vacio para ocultarlo.",
  },

  // ── CONTACT / social ─────────────────────────────────────
  {
    key: "contact.social.instagram",
    page: "contact",
    section: "social",
    label: "Instagram",
    fieldType: "url",
    defaultValue: "",
    placeholder: "https://instagram.com/warszawski",
  },
  {
    key: "contact.social.facebook",
    page: "contact",
    section: "social",
    label: "Facebook",
    fieldType: "url",
    defaultValue: "",
    placeholder: "https://facebook.com/warszawski",
  },
  {
    key: "contact.social.tiktok",
    page: "contact",
    section: "social",
    label: "TikTok",
    fieldType: "url",
    defaultValue: "",
    placeholder: "https://tiktok.com/@warszawski",
  },

  // ── CONTACT / address ────────────────────────────────────
  {
    key: "contact.address.list",
    page: "contact",
    section: "address",
    label: "Oficinas",
    fieldType: "address_list",
    defaultValue:
      '[{"address":"Montevideo 536 1A, Capital Federal","phone":""}]',
    hint: "Cada oficina tiene una direccion y un telefono de linea opcional. La primera oficina se considera la principal en el schema SEO.",
  },
];
