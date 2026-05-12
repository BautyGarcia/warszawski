import { notFound } from "next/navigation";
import { Reveal } from "@/components/public/Reveal";
import { Breadcrumbs } from "@/components/public/product/Breadcrumbs";
import { ProductCard } from "@/components/public/home/ProductCard";
import { FinalCTA } from "@/components/public/home/FinalCTA";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { JsonLd } from "@/components/JsonLd";
import { listProductsByCategory } from "@/lib/products/queries";
import { getContentMap } from "@/lib/content/fetch";
import { getContactInfo } from "@/lib/content/contact";
import { CATEGORIES, CATEGORY_META, isCategory } from "@/lib/category";
import {
  SITE_URL,
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo";

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategory(category)) return { title: "No encontrado" };
  const meta = CATEGORY_META[category];
  const url = `${SITE_URL}/coleccion/${category}`;
  return {
    title: meta.metaTitle,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${meta.metaTitle} — Warszawski`,
      description: meta.description,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const [products, content, contact] = await Promise.all([
    listProductsByCategory(category),
    getContentMap("home"),
    getContactInfo(),
  ]);

  const meta = CATEGORY_META[category];
  const url = `${SITE_URL}/coleccion/${category}`;

  return (
    <main className="flex flex-col">
      <JsonLd
        data={[
          collectionPageJsonLd({
            url,
            name: `${meta.title} — Warszawski`,
            description: meta.description,
            numberOfItems: products.length,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", url: SITE_URL },
            { name: "Coleccion", url: `${SITE_URL}/#coleccion` },
            { name: meta.label },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Coleccion", href: "/#coleccion" },
          { label: meta.label },
        ]}
      />

      <section className="flex w-full flex-col items-center bg-bg px-6 pb-12 pt-16 text-center md:px-12 md:pb-16 md:pt-25 lg:px-20">
        <Reveal immediate delay={0}>
          <span className="mb-6 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:mb-8 md:text-[11px]">
            Coleccion
          </span>
        </Reveal>
        <Reveal immediate delay={140}>
          <h1 className="font-display text-[clamp(2.5rem,8vw,4.5rem)] font-black leading-[1.05] tracking-[-0.02em] text-ink">
            {meta.title}
          </h1>
        </Reveal>
        <Reveal immediate delay={280}>
          <p className="mt-6 max-w-[560px] text-sm font-light leading-7 text-ink-soft md:mt-8 md:text-base md:leading-8">
            {meta.description}
          </p>
        </Reveal>
      </section>

      {products.length === 0 ? (
        <section className="flex w-full flex-col items-center bg-bg px-6 pb-20 text-center md:px-12 md:pb-25 lg:px-20">
          <Reveal>
            <p className="max-w-[480px] text-sm font-light leading-7 text-ink-soft md:text-base">
              Estamos sumando modelos en esta categoría. Escribinos por WhatsApp y te contamos qué hay disponible.
            </p>
          </Reveal>
          {contact.whatsappNumber ? (
            <Reveal delay={120}>
              <WhatsAppButton
                number={contact.whatsappNumber}
                size="md"
                className="mt-8"
              >
                Consultar disponibilidad
              </WhatsAppButton>
            </Reveal>
          ) : null}
        </section>
      ) : (
        <section className="flex w-full flex-col pb-20 md:pb-25">
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-12 px-6 md:grid-cols-2 md:gap-y-16 md:px-12 lg:px-20">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 4) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <FinalCTA content={content} contentKey="home" />
    </main>
  );
}
