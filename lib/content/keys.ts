import { CATEGORY_META } from "@/lib/category";
import type { ContentPage } from "@/types/content";

const SHOWROOM_MAPS_URL =
  "https://www.google.com/maps/place/Montevideo+536,+C1019ABL+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.6025739,-58.389679,16z/data=!3m1!4b1!4m6!3m5!1s0x95bccac1265e5245:0xe109fa22d96fdd68!8m2!3d-34.6025739!4d-58.389679!16s%2Fg%2F11q2x8287_?entry=ttu";

export type ContentField = {
  key: string;
  page: ContentPage;
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
  /** Si es true, el campo puede quedar vacio (la web oculta ese elemento). */
  optional?: boolean;
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
    key: "home.hero.showroomcta",
    page: "home",
    section: "hero",
    label: "Texto boton locales (un solo local)",
    fieldType: "short_text",
    defaultValue: "Visite nuestro showroom",
    hint: "Se usa cuando hay un solo local cargado: el boton abre directo su Google Maps. Los locales se cargan en Contacto > Locales.",
  },
  {
    key: "home.hero.locationscta",
    page: "home",
    section: "hero",
    label: "Texto boton locales (varios locales)",
    fieldType: "short_text",
    defaultValue: "Visite nuestros locales",
    hint: "Se usa cuando hay dos o mas locales: el boton despliega la lista para elegir a cual ir.",
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
    optional: true,
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


  // ── WHOLESALE (/mayoristas, landing de Google Ads) / hero ─────────
  // Esta pagina es el destino de los anuncios de Busqueda. Sus textos
  // repiten las promesas de los anuncios ("por mayor", "desde 1959",
  // "envios a todo el pais", "descuentos por volumen") a proposito: Google
  // puntua la relevancia entre anuncio y pagina, y eso abarata cada clic.
  {
    key: "wholesale.hero.label",
    page: "wholesale",
    section: "hero",
    label: "Etiqueta del hero",
    fieldType: "short_text",
    defaultValue: "Venta mayorista · Desde 1959 · Buenos Aires",
  },
  {
    key: "wholesale.hero.title",
    page: "wholesale",
    section: "hero",
    label: "Titulo principal (H1)",
    fieldType: "short_text",
    defaultValue: "Anteojos y armazones por mayor",
    hint: "Conviene que diga \"por mayor\" o \"mayorista\": es lo que busca la gente que llega desde Google Ads.",
  },
  {
    key: "wholesale.hero.subtitle",
    page: "wholesale",
    section: "hero",
    label: "Bajada del hero",
    fieldType: "long_text",
    defaultValue:
      "Proveedor de ópticas, distribuidores y revendedores de todo el país. Importación directa, amplio stock y descuentos por volumen.",
  },
  {
    key: "wholesale.hero.cta",
    page: "wholesale",
    section: "hero",
    label: "Texto boton WhatsApp",
    fieldType: "short_text",
    defaultValue: "Pedir lista de precios por WhatsApp",
  },
  {
    key: "wholesale.hero.showroomcta",
    page: "wholesale",
    section: "hero",
    label: "Texto boton showroom",
    fieldType: "short_text",
    defaultValue: "Visitar showroom en Once",
    hint: "Lleva a la seccion Showroom de esta misma pagina.",
  },
  {
    key: "wholesale.hero.subcta",
    page: "wholesale",
    section: "hero",
    label: "Texto sub-CTA",
    fieldType: "short_text",
    defaultValue: "Venta exclusiva a mayoristas y distribuidores · Respondemos en el día",
  },

  // ── WHOLESALE / proof (franja de 4 promesas) ─────────────────────
  {
    key: "wholesale.proof1.title",
    page: "wholesale",
    section: "proof",
    label: "Promesa 01 - Titulo",
    fieldType: "short_text",
    defaultValue: "Desde 1959",
  },
  {
    key: "wholesale.proof1.description",
    page: "wholesale",
    section: "proof",
    label: "Promesa 01 - Descripcion",
    fieldType: "short_text",
    defaultValue: "Tres generaciones en el rubro óptico.",
  },
  {
    key: "wholesale.proof2.title",
    page: "wholesale",
    section: "proof",
    label: "Promesa 02 - Titulo",
    fieldType: "short_text",
    defaultValue: "Envíos al país",
  },
  {
    key: "wholesale.proof2.description",
    page: "wholesale",
    section: "proof",
    label: "Promesa 02 - Descripcion",
    fieldType: "short_text",
    defaultValue: "Despachamos a todas las provincias.",
  },
  {
    key: "wholesale.proof3.title",
    page: "wholesale",
    section: "proof",
    label: "Promesa 03 - Titulo",
    fieldType: "short_text",
    defaultValue: "Por volumen",
  },
  {
    key: "wholesale.proof3.description",
    page: "wholesale",
    section: "proof",
    label: "Promesa 03 - Descripcion",
    fieldType: "short_text",
    defaultValue: "Descuentos escalonados y financiación.",
  },
  {
    key: "wholesale.proof4.title",
    page: "wholesale",
    section: "proof",
    label: "Promesa 04 - Titulo",
    fieldType: "short_text",
    defaultValue: "Garantía",
  },
  {
    key: "wholesale.proof4.description",
    page: "wholesale",
    section: "proof",
    label: "Promesa 04 - Descripcion",
    fieldType: "short_text",
    defaultValue: "Cambio por fallas de fabricación.",
  },

  // ── WHOLESALE / categories (que vendemos) ────────────────────────
  {
    key: "wholesale.categories.label",
    page: "wholesale",
    section: "categories",
    label: "Etiqueta de la seccion",
    fieldType: "short_text",
    defaultValue: "Qué vendemos por mayor",
  },
  {
    key: "wholesale.categories.title",
    page: "wholesale",
    section: "categories",
    label: "Titulo de la seccion",
    fieldType: "short_text",
    defaultValue: "Sol, receta y modelaje exclusivo",
  },
  {
    key: "wholesale.categories.description",
    page: "wholesale",
    section: "categories",
    label: "Texto de la seccion",
    fieldType: "long_text",
    defaultValue:
      "Reposición constante, enorme variedad de colores en todas las líneas y precios mayoristas desde la primera compra.",
  },
  {
    key: "wholesale.cat1.image",
    page: "wholesale",
    section: "categories",
    label: "Categoria 01 - Imagen",
    fieldType: "image",
    defaultValue: "",
    hint: "Idealmente cuadrada o 4:3. Sin imagen se muestra un bloque de color.",
  },
  {
    key: "wholesale.cat1.title",
    page: "wholesale",
    section: "categories",
    label: "Categoria 01 - Titulo",
    fieldType: "short_text",
    defaultValue: "Anteojos de sol",
  },
  {
    key: "wholesale.cat1.description",
    page: "wholesale",
    section: "categories",
    label: "Categoria 01 - Descripcion",
    fieldType: "short_text",
    defaultValue: "Polarizados, TR90, metal y acetato. Lo que más rota en vidriera.",
  },
  {
    key: "wholesale.cat2.image",
    page: "wholesale",
    section: "categories",
    label: "Categoria 02 - Imagen",
    fieldType: "image",
    defaultValue: "",
  },
  {
    key: "wholesale.cat2.title",
    page: "wholesale",
    section: "categories",
    label: "Categoria 02 - Titulo",
    fieldType: "short_text",
    defaultValue: "Armazones de receta",
  },
  {
    key: "wholesale.cat2.description",
    page: "wholesale",
    section: "categories",
    label: "Categoria 02 - Descripcion",
    fieldType: "short_text",
    defaultValue: "Armazones para óptica, listos para el taller. Calce y terminaciones cuidadas.",
  },
  {
    key: "wholesale.cat3.image",
    page: "wholesale",
    section: "categories",
    label: "Categoria 03 - Imagen",
    fieldType: "image",
    defaultValue: "",
  },
  {
    key: "wholesale.cat3.title",
    page: "wholesale",
    section: "categories",
    label: "Categoria 03 - Titulo",
    fieldType: "short_text",
    defaultValue: "Modelaje exclusivo",
  },
  {
    key: "wholesale.cat3.description",
    page: "wholesale",
    section: "categories",
    label: "Categoria 03 - Descripcion",
    fieldType: "short_text",
    defaultValue: "Diseño propio que no vas a encontrar en otro mayorista. Ideal para diferenciarte.",
  },

  // ── WHOLESALE / steps (como comprar) ─────────────────────────────
  {
    key: "wholesale.steps.label",
    page: "wholesale",
    section: "steps",
    label: "Etiqueta de la seccion",
    fieldType: "short_text",
    defaultValue: "Cómo comprar",
  },
  {
    key: "wholesale.steps.title",
    page: "wholesale",
    section: "steps",
    label: "Titulo de la seccion",
    fieldType: "short_text",
    defaultValue: "Tres pasos, sin vueltas",
  },
  {
    key: "wholesale.steps.description",
    page: "wholesale",
    section: "steps",
    label: "Texto de la seccion",
    fieldType: "long_text",
    defaultValue:
      "Sin mínimos complicados ni registro previo. Escribís, te pasamos precios y armamos el pedido juntos.",
  },
  {
    key: "wholesale.step1.title",
    page: "wholesale",
    section: "steps",
    label: "Paso 01 - Titulo",
    fieldType: "short_text",
    defaultValue: "Escribinos por WhatsApp",
  },
  {
    key: "wholesale.step1.description",
    page: "wholesale",
    section: "steps",
    label: "Paso 01 - Descripcion",
    fieldType: "long_text",
    defaultValue:
      "Contanos qué tipo de negocio tenés (óptica, local, reventa) y qué líneas te interesan.",
  },
  {
    key: "wholesale.step2.title",
    page: "wholesale",
    section: "steps",
    label: "Paso 02 - Titulo",
    fieldType: "short_text",
    defaultValue: "Recibís catálogo y lista de precios",
  },
  {
    key: "wholesale.step2.description",
    page: "wholesale",
    section: "steps",
    label: "Paso 02 - Descripcion",
    fieldType: "long_text",
    defaultValue:
      "Precios mayoristas, stock actualizado y descuentos según cantidad. Todo por el mismo chat.",
  },
  {
    key: "wholesale.step3.title",
    page: "wholesale",
    section: "steps",
    label: "Paso 03 - Titulo",
    fieldType: "short_text",
    defaultValue: "Retirás en Once o te lo enviamos",
  },
  {
    key: "wholesale.step3.description",
    page: "wholesale",
    section: "steps",
    label: "Paso 03 - Descripcion",
    fieldType: "long_text",
    defaultValue:
      "Pasás por el showroom a elegir en persona, o despachamos a cualquier punto del país.",
  },

  // ── WHOLESALE / showroom ─────────────────────────────────────────
  {
    key: "wholesale.showroom.image",
    page: "wholesale",
    section: "showroom",
    label: "Imagen del showroom",
    fieldType: "image",
    defaultValue: "",
    hint: "Foto del local o de la exhibicion. Sin imagen se muestra un bloque oscuro.",
  },
  {
    key: "wholesale.showroom.label",
    page: "wholesale",
    section: "showroom",
    label: "Etiqueta de la seccion",
    fieldType: "short_text",
    defaultValue: "Showroom en Once",
  },
  {
    key: "wholesale.showroom.title",
    page: "wholesale",
    section: "showroom",
    label: "Titulo de la seccion",
    fieldType: "short_text",
    defaultValue: "Vení a ver la colección completa",
  },
  {
    key: "wholesale.showroom.description",
    page: "wholesale",
    section: "showroom",
    label: "Texto de la seccion",
    fieldType: "long_text",
    defaultValue:
      "Mayoristas de anteojos en Once, Capital Federal. Elegí modelos y colores en mano y llevate el pedido en el día.",
  },
  {
    key: "wholesale.showroom.hours",
    page: "wholesale",
    section: "showroom",
    label: "Horario de atencion",
    fieldType: "short_text",
    defaultValue: "Lunes a viernes · 9 a 17 h",
    hint: "Se muestra debajo de cada local. Los locales se cargan en Contacto > Locales.",
  },

  // ── WHOLESALE / cta ──────────────────────────────────────────────
  {
    key: "wholesale.cta.title",
    page: "wholesale",
    section: "cta",
    label: "Titulo CTA final",
    fieldType: "short_text",
    defaultValue: "Pedí tu lista de precios mayorista",
  },
  {
    key: "wholesale.cta.description",
    page: "wholesale",
    section: "cta",
    label: "Descripcion CTA final",
    fieldType: "long_text",
    defaultValue:
      "Respondemos en el día. Contanos qué buscás y te pasamos catálogo, precios y disponibilidad.",
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
    label: "Locales",
    fieldType: "address_list",
    defaultValue: JSON.stringify([
      {
        name: "Showroom",
        address: "Montevideo 536 1A, Capital Federal",
        phone: "",
        mapsUrl: SHOWROOM_MAPS_URL,
      },
    ]),
    hint: "Cada local tiene nombre, direccion, telefono y link de Google Maps (opcionales salvo la direccion). Alimentan el boton de locales del inicio y el footer. El primero se considera el principal en el schema SEO.",
  },
];
