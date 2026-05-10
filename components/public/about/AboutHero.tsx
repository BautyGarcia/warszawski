import type { ContentMap } from "@/types/content";

export function AboutHero({ content }: { content: ContentMap }) {
  return (
    <section className="flex min-h-screen w-full flex-col items-start justify-center bg-bg px-6 py-20 md:px-12 md:py-32 lg:px-20">
      <span className="mb-6 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:mb-8 md:text-[11px]">
        {content["about.hero.label"]}
      </span>
      <h1 className="max-w-[900px] font-display text-5xl font-black leading-tight tracking-[-0.02em] text-ink sm:text-6xl md:text-7xl md:leading-20">
        {content["about.hero.title"]}
      </h1>
    </section>
  );
}
