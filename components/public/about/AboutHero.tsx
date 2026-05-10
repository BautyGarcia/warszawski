import type { ContentMap } from "@/types/content";

export function AboutHero({ content }: { content: ContentMap }) {
  return (
    <section className="flex w-full flex-col items-start bg-bg px-20 pb-25 pt-30">
      <span className="mb-8 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-gold-dark">
        {content["about.hero.label"]}
      </span>
      <h1 className="max-w-[900px] font-display text-7xl font-black leading-20 tracking-[-0.02em] text-ink">
        {content["about.hero.title"]}
      </h1>
    </section>
  );
}
