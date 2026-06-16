import { Reveal } from "@/components/public/Reveal";
import type { ContentMap } from "@/types/content";

export function BrandStatement({ content }: { content: ContentMap }) {
  const highlight = content["home.brand.highlight"]?.trim();

  return (
    <section className="flex w-full flex-col items-center bg-ink px-6 py-20 md:px-12 md:py-30 lg:px-20">
      <Reveal>
        <div className="flex flex-col items-center">
          <span className="mb-8 inline-block text-[13px] font-medium uppercase tracking-[0.28em] text-gold md:mb-12 md:text-sm">
            {content["home.brand.label"]}
          </span>
          <p className="max-w-[800px] text-balance text-center font-display text-2xl leading-9 tracking-[-0.01em] text-bg md:text-3xl md:leading-[44px] lg:text-4xl lg:leading-[52px]">
            {content["home.brand.primary"]}
          </p>
          {highlight ? (
            <p className="mt-6 max-w-[800px] text-balance text-center font-display text-[1.75rem] leading-[1.3] tracking-[-0.01em] text-bg md:mt-8 md:text-[2.125rem] lg:text-[2.625rem] lg:leading-[1.25]">
              {highlight}
            </p>
          ) : null}
          <p className="mt-6 max-w-[560px] text-balance text-center text-sm font-light leading-6 text-bg/80 md:mt-8 md:text-[15px] md:leading-[26px]">
            {content["home.brand.secondary"]}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
