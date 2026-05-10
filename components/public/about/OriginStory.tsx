import type { ContentMap } from "@/types/content";

export function OriginStory({ content }: { content: ContentMap }) {
  return (
    <div className="flex w-full flex-col gap-10 px-6 pb-16 md:flex-row md:gap-20 md:px-12 md:pb-25 lg:px-20">
      <div className="flex aspect-[5/6] w-full shrink-0 items-center justify-center rounded-sm bg-bg-warm md:h-120 md:w-auto md:basis-[400px] md:aspect-auto">
        <span className="font-display text-5xl font-light leading-none text-ink/6 md:text-[64px] md:leading-[78px]">
          W
        </span>
      </div>
      <div className="flex shrink grow basis-0 flex-col justify-center gap-6 md:gap-8">
        <h2 className="font-display text-2xl font-semibold leading-tight tracking-[-0.01em] text-ink md:text-[32px] md:leading-10">
          {content["about.origin.title"]}
        </h2>
        <p className="text-sm font-light leading-6 text-ink-soft md:text-base md:leading-7">
          {content["about.origin.p1"]}
        </p>
        <p className="text-sm font-light leading-6 text-ink-soft md:text-base md:leading-7">
          {content["about.origin.p2"]}
        </p>
      </div>
    </div>
  );
}
