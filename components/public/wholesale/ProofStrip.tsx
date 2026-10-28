import { Reveal } from "@/components/public/Reveal";
import { cn } from "@/lib/utils";
import type { ContentMap } from "@/types/content";

/** Franja con las cuatro promesas que tambien aparecen en los anuncios. */
export function ProofStrip({ content }: { content: ContentMap }) {
  const items = [1, 2, 3, 4].map((i) => ({
    title: content[`wholesale.proof${i}.title`],
    description: content[`wholesale.proof${i}.description`],
  }));

  return (
    <section className="w-full border-y border-line bg-bg px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {items.map((item, i) => (
          <Reveal
            key={i}
            delay={i * 80}
            className={cn(
              "flex flex-col gap-1.5 py-6 md:gap-2.5 md:py-10",
              // Columnas separadas por lineas, sin caja: el borde derecho se
              // omite en la ultima de cada fila (2 por fila en mobile, 4 en md+).
              "border-line pr-4 md:pr-8",
              i % 2 === 0 && "border-r",
              i % 2 === 1 && "pl-4 md:border-r md:pl-8",
              i === 3 && "md:border-r-0",
              i === 2 && "md:pl-8",
              i < 2 && "border-b md:border-b-0",
            )}
          >
            <span className="font-display text-[22px] font-bold leading-7 tracking-[-0.01em] text-ink md:text-[34px] md:leading-10">
              {item.title}
            </span>
            <span className="text-[13px] leading-5 text-ink-soft md:text-sm">
              {item.description}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
