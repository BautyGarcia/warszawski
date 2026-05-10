import type { ContentMap } from "@/types/content";

export function BrandStatement({ content }: { content: ContentMap }) {
  return (
    <section className="flex w-full flex-col items-center bg-ink px-20 py-30">
      <span className="mb-12 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
        {content["home.brand.label"]}
      </span>
      <p className="max-w-[800px] text-center font-display text-4xl leading-[52px] tracking-[-0.01em] text-bg">
        {content["home.brand.primary"]}
      </p>
      <p className="mt-8 max-w-[560px] text-center text-[15px] font-light leading-[26px] text-bg/80">
        {content["home.brand.secondary"]}
      </p>
    </section>
  );
}
