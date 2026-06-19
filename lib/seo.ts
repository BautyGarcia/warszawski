import type { Metadata } from "next";
import type { Product } from "@/types/product";
import { type ContactInfo, parseAddressForSchema } from "@/lib/content/contact";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://warszawski.com.ar"
).replace(/\/$/, "");

const BRAND_DESCRIPTION =
  "Anteojos de diseño. Mayoristas y distribuidores. Modelos exclusivos en armazones recetados y de sol con diseño de autor.";

const BRAND_KEYWORDS = [
  "anteojos recetados",
  "anteojos de sol",
  "anteojos de diseño",
  "lentes de diseño",
  "óptica mayorista",
  "marcos de anteojos",
  "anteojos mayoristas Argentina",
  "Warszawski",
];

const FOUNDING_YEAR = process.env.NEXT_PUBLIC_FOUNDING_YEAR ?? "";

// ── Metadata builders ────────────────────────────────────────────────────────

export function buildHomeMetadata(content: Record<string, string>): Metadata {
  const description = content["home.brand.primary"] || BRAND_DESCRIPTION;
  return {
    title: { absolute: "Warszawski — Anteojos de diseño" },
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
      url: SITE_URL,
      title: "Warszawski — Anteojos de diseño",
      description,
      type: "website",
    },
  };
}

export function buildAboutMetadata(content: Record<string, string>): Metadata {
  const description =
    content["about.origin.p1"] || "Diseño que habla por sí mismo. Conocé Warszawski.";
  return {
    title: "Nosotros",
    description,
    alternates: { canonical: `${SITE_URL}/nosotros` },
    openGraph: {
      url: `${SITE_URL}/nosotros`,
      title: "Nosotros — Warszawski",
      description,
      type: "website",
    },
  };
}

export function buildProductMetadata(p: Product): Metadata {
  const url = `${SITE_URL}/productos/${p.slug}`;
  const title = p.seo_title || `${p.name}`;
  const description =
    p.seo_description || p.short_description || p.description || BRAND_DESCRIPTION;
  const ogImage = p.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${p.name} — Warszawski`,
      description,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

// ── JSON-LD builders ─────────────────────────────────────────────────────────

export function organizationJsonLd(contact?: ContactInfo) {
  const sameAs = [
    contact?.instagramUrl,
    contact?.facebookUrl,
    contact?.tiktokUrl,
  ].filter((u): u is string => !!u);

  // contactPoint top-level: WhatsApp (uno solo, fijo).
  const whatsappDigits = contact?.whatsappNumber?.replace(/\D/g, "") ?? "";
  const contactPoint = whatsappDigits
    ? {
        "@type": "ContactPoint" as const,
        contactType: "sales",
        areaServed: "AR",
        availableLanguage: ["Spanish"],
        url: `https://wa.me/${whatsappDigits}`,
      }
    : null;

  // Oficinas: cada una es un Place con su address + telephone opcional.
  const validOffices = (contact?.addresses ?? []).filter(
    (a) => a.address.length > 0,
  );

  const locations = validOffices.map((office, i) => {
    const parsed = parseAddressForSchema(office.address);
    return {
      "@type": "Place" as const,
      name: i === 0 ? "Oficina principal" : `Oficina ${i + 1}`,
      address: {
        "@type": "PostalAddress" as const,
        streetAddress: parsed.streetAddress,
        addressLocality: parsed.addressLocality,
        addressCountry: parsed.addressCountry,
      },
      ...(office.phone ? { telephone: office.phone } : {}),
    };
  });

  // address principal (top-level): la primera oficina.
  const primaryAddress = locations[0]?.address ?? null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Warszawski",
    alternateName: "Warszawski Eyewear",
    url: SITE_URL,
    logo: `${SITE_URL}/web-app-manifest-512x512.png`,
    description: BRAND_DESCRIPTION,
    slogan: "See Beyond",
    keywords: BRAND_KEYWORDS,
    ...(primaryAddress ? { address: primaryAddress } : {}),
    ...(locations.length > 1 ? { location: locations } : {}),
    ...(FOUNDING_YEAR ? { foundingDate: FOUNDING_YEAR } : {}),
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/#founder`,
      name: "Alfredo Warszawski",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(contactPoint ? { contactPoint } : {}),
  };
}

// Extrae lat/lng de un link de Google Maps. Soporta el formato del path
// (`!3d<lat>!4d<lng>`) y el del centro del mapa (`@<lat>,<lng>`).
function parseLatLngFromMapsUrl(
  url: string | undefined | null,
): { lat: number; lng: number } | null {
  if (!url) return null;
  const place = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (place) return { lat: Number(place[1]), lng: Number(place[2]) };
  const center = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (center) return { lat: Number(center[1]), lng: Number(center[2]) };
  return null;
}

/**
 * LocalBusiness (OpticalStore) para el showroom físico. Habilita rich results
 * de mapa/local y aporta una entidad local fuerte para buscadores y AI search.
 * Devuelve null si no hay direccion cargada (no tiene sentido sin ella).
 * Geo se deriva del link de Google Maps editable (contact.mapsUrl).
 */
export function localBusinessJsonLd(contact?: ContactInfo) {
  const primary = (contact?.addresses ?? []).find((a) => a.address.length > 0);
  if (!primary) return null;

  const parsed = parseAddressForSchema(primary.address);
  const geo = parseLatLngFromMapsUrl(contact?.mapsUrl);
  const whatsappDigits = contact?.whatsappNumber?.replace(/\D/g, "") ?? "";
  const telephone = primary.phone || (whatsappDigits ? `+${whatsappDigits}` : "");
  const sameAs = [
    contact?.instagramUrl,
    contact?.facebookUrl,
    contact?.tiktokUrl,
  ].filter((u): u is string => !!u);

  return {
    "@context": "https://schema.org",
    "@type": "OpticalStore",
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Warszawski",
    url: SITE_URL,
    image: `${SITE_URL}/web-app-manifest-512x512.png`,
    description: BRAND_DESCRIPTION,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: parsed.streetAddress,
      addressLocality: parsed.addressLocality,
      addressCountry: parsed.addressCountry,
    },
    ...(geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: geo.lat,
            longitude: geo.lng,
          },
        }
      : {}),
    ...(telephone ? { telephone } : {}),
    ...(contact?.mapsUrl ? { hasMap: contact.mapsUrl } : {}),
    areaServed: "AR",
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Warszawski",
    alternateName: "Warszawski Eyewear",
    url: SITE_URL,
    inLanguage: "es-AR",
    publisher: {
      "@type": "Organization",
      name: "Warszawski",
      url: SITE_URL,
    },
  };
}

export function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description ?? p.short_description ?? "",
    image: p.images.length > 0 ? p.images.map((i) => i.url) : undefined,
    brand: { "@type": "Brand", name: "Warszawski" },
    category: p.category ?? undefined,
    url: `${SITE_URL}/productos/${p.slug}`,
  };
}

export function collectionPageJsonLd(opts: {
  url: string;
  name: string;
  description: string;
  numberOfItems: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: "es-AR",
    isPartOf: { "@type": "WebSite", name: "Warszawski", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.numberOfItems,
    },
  };
}

type BlogIndexPost = {
  slug: string;
  title: string;
  cover_image?: string | null;
  author_name?: string;
  published_at?: string | null;
  created_at: string;
  updated_at?: string | null;
};

/** Schema del índice editorial: un Blog con la lista de BlogPosting. */
export function blogJsonLd(posts: BlogIndexPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/editorial#blog`,
    name: "Editorial Warszawski",
    description:
      "Notas sobre diseño, materiales, calce y cultura óptica. Editorial Warszawski.",
    url: `${SITE_URL}/editorial`,
    inLanguage: "es-AR",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting" as const,
      headline: p.title,
      url: `${SITE_URL}/editorial/${p.slug}`,
      ...(p.cover_image ? { image: p.cover_image } : {}),
      ...(p.author_name
        ? { author: { "@type": "Person" as const, name: p.author_name } }
        : {}),
      datePublished: p.published_at ?? p.created_at,
      ...(p.updated_at ? { dateModified: p.updated_at } : {}),
    })),
  };
}

export function articleJsonLd(opts: {
  url: string;
  title: string;
  description: string;
  image?: string;
  authorName: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image ? [opts.image] : undefined,
    author: { "@type": "Person", name: opts.authorName },
    publisher: {
      "@type": "Organization",
      name: "Warszawski",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/web-app-manifest-512x512.png`,
      },
    },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    inLanguage: "es-AR",
  };
}

export function breadcrumbJsonLd(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url } : {}),
    })),
  };
}
