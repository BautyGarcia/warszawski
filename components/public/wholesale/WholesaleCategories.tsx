import Image from "next/image";
import { Reveal } from "@/components/public/Reveal";
import { cn } from "@/lib/utils";
import type { ContentMap } from "@/types/content";

/** "Que vendemos por mayor": tres lineas con imagen editable (o bloque de color). */
export function WholesaleCategories({ content }: { content: ContentMap }) {
  const items = [1, 2, 3].map((i) => ({
    image: content[`wholesale.cat${i}.image`]?.trim() ?? "",
    title: content[`wholesale.cat${i}.title`],
    description: content[`wholesale.cat${i}.description`],
  }));

  return (
    <section className="flex w-full flex-col bg-bg px-6 pt-16 md:px-12 md:pt-28 lg:px-20">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
        <Reveal className="flex flex-col gap-3.5 md:gap-5">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:text-[11px]">
            {content["wholesale.categories.label"]}
          </span>
          <h2 className="max-w-[640px] font-display text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[52px]">
            {content["wholesale.categories.title"]}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="max-w-[400px] text-sm font-light leading-6 text-ink-soft md:text-right md:text-base md:leading-7">
            {content["wholesale.categories.description"]}
          </p>
        </Reveal>
      </div>

      <div className="mt-8 flex flex-col gap-5 md:mt-12 md:flex-row md:gap-6">
        {items.map((item, i) => (
          <Reveal
            key={i}
            delay={i * 120}
            className="flex flex-row items-center gap-4 md:w-0 md:shrink md:grow md:basis-0 md:flex-col md:items-stretch md:gap-5"
          >
            <div
              className={cn(
                "relative flex size-[120px] shrink-0 items-center justify-center overflow-hidden md:aspect-[410/360] md:size-auto md:w-full",
                // Las fotos de producto vienen en 3:2 sobre fondo blanco: se muestran
                // enteras (contain) sobre blanco para que no se recorten las patillas.
                item.image ? "bg-white" : i === 1 ? "bg-ink" : "bg-bg-warm",
              )}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 120px"
                  className="object-contain p-2 md:p-6"
                />
              ) : (
                <span
                  className={cn(
                    "font-display text-lg italic md:text-[40px]",
                    i === 1 ? "text-bg/15" : "text-ink/10",
                  )}
                >
                  {item.title}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 md:gap-1.5">
              <h3 className="font-display text-xl font-bold leading-6 text-ink md:text-[26px] md:leading-8">
                {item.title}
              </h3>
              <p className="text-sm leading-5 text-ink-soft md:text-[15px] md:leading-6">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
