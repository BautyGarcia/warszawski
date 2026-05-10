import type { ContentMap } from "@/types/content";

export function OriginStory({ content }: { content: ContentMap }) {
  return (
    <section className="flex w-full gap-20 bg-bg px-20 pb-25">
      <div className="flex h-120 shrink-0 grow-0 basis-[400px] items-center justify-center rounded-sm bg-bg-warm">
        <span className="font-display text-[64px] font-light leading-[78px] text-ink/6">W</span>
      </div>
      <div className="flex shrink grow basis-0 flex-col justify-center gap-8">
        <h2 className="font-display text-[32px] font-semibold leading-10 tracking-[-0.01em] text-ink">
          {content["about.origin.title"]}
        </h2>
        <p className="text-base font-light leading-7 text-ink-soft">
          {content["about.origin.p1"]}
        </p>
        <p className="text-base font-light leading-7 text-ink-soft">
          {content["about.origin.p2"]}
        </p>
      </div>
    </section>
  );
}
