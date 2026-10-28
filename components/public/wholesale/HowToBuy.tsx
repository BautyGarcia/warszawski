import { Reveal } from "@/components/public/Reveal";
import { cn } from "@/lib/utils";
import type { ContentMap } from "@/types/content";

/** "Como comprar": tres pasos numerados. */
export function HowToBuy({ content }: { content: ContentMap }) {
  const steps = [1, 2, 3].map((i) => ({
    title: content[`wholesale.step${i}.title`],
    description: content[`wholesale.step${i}.description`],
  }));

  return (
    <section className="flex w-full flex-col gap-8 bg-bg px-6 py-16 md:flex-row md:gap-20 md:px-12 md:py-32 lg:px-20">
      <Reveal className="flex flex-col gap-3.5 md:w-[440px] md:shrink-0 md:gap-5">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:text-[11px]">
          {content["wholesale.steps.label"]}
        </span>
        <h2 className="font-display text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[52px]">
          {content["wholesale.steps.title"]}
        </h2>
        <p className="hidden text-base font-light leading-7 text-ink-soft md:block md:pt-1">
          {content["wholesale.steps.description"]}
        </p>
      </Reveal>

      <div className="flex flex-col md:grow">
        {steps.map((step, i) => (
          <Reveal
            key={i}
            delay={i * 120}
            className={cn(
              "flex flex-row gap-5 md:gap-10",
              "border-line py-6 first:pt-0 last:pb-0 md:py-9",
              i < steps.length - 1 && "border-b",
            )}
          >
            <span className="w-11 shrink-0 font-display text-4xl italic leading-9 text-gold md:w-[72px] md:text-[56px] md:leading-[56px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1.5 pt-1 md:gap-2 md:pt-2">
              <h3 className="font-display text-[19px] font-bold leading-6 text-ink md:text-2xl md:leading-[30px]">
                {step.title}
              </h3>
              <p className="max-w-[560px] text-sm leading-5 text-ink-soft md:text-[15px] md:leading-6">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
