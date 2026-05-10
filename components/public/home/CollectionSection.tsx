import { Reveal } from "@/components/public/Reveal";
import { ProductCard } from "./ProductCard";
import { SectionHeader } from "./SectionHeader";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Product } from "@/types/product";
import type { ContentMap } from "@/types/content";

export function CollectionSection({
  content,
  products,
}: {
  content: ContentMap;
  products: Product[];
}) {
  return (
    <section id="coleccion" className="flex w-full flex-col pb-20 md:pb-25">
      <SectionHeader
        label={content["home.collection.label"]}
        title={content["home.collection.title"]}
      />

      {products.length === 0 ? (
        <Reveal className="flex flex-col items-center px-6 pb-8 text-center md:px-12 lg:px-20">
          <p className="max-w-[480px] text-sm font-light leading-7 text-ink-soft md:text-base md:leading-8">
            La coleccion esta llegando. Escribinos por WhatsApp y te contamos qué modelos tenemos disponibles.
          </p>
          <WhatsAppButton
            number={SITE_CONFIG.whatsappNumber}
            size="md"
            className="mt-8"
          >
            Consultar disponibilidad
          </WhatsAppButton>
        </Reveal>
      ) : (
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-12 px-6 md:grid-cols-2 md:gap-y-16 md:px-12 lg:px-20">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
