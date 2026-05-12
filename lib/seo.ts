import type { Metadata } from "next";
import type { Product } from "@/types/product";
import type { ContactInfo } from "@/lib/content/contact";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://warszawski.com"
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

  const whatsappDigits = contact?.whatsappNumber?.replace(/\D/g, "") ?? "";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Warszawski",
    alternateName: "Warszawski Eyewear",
    url: SITE_URL,
    logo: `${SITE_URL}/web-app-manifest-512x512.png`,
    description: BRAND_DESCRIPTION,
    slogan: "See Beyond",
    keywords: BRAND_KEYWORDS,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    },
    ...(FOUNDING_YEAR ? { foundingDate: FOUNDING_YEAR } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(whatsappDigits
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            areaServed: "AR",
            availableLanguage: ["Spanish"],
            url: `https://wa.me/${whatsappDigits}`,
          },
        }
      : {}),
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
