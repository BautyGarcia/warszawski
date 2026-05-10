import type { ContentMap } from "@/types/content";

export function AboutHero({ content }: { content: ContentMap }) {
  return (
    <div className="flex w-full flex-col items-start px-6 pb-12 pt-16 md:px-12 md:pb-16 md:pt-32 lg:px-20">
      <span className="mb-6 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:mb-8 md:text-[11px]">
        {content["about.hero.label"]}
      </span>
      <h1 className="max-w-[900px] font-display text-[clamp(2.5rem,8vw,5rem)] font-black leading-[1.05] tracking-[-0.02em] text-ink">
        {content["about.hero.title"]}
      </h1>
    </div>
  );
}
