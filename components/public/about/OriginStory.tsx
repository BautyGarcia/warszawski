import Image from "next/image";
import { Reveal } from "@/components/public/Reveal";
import type { ContentMap } from "@/types/content";

export function OriginStory({ content }: { content: ContentMap }) {
  const imageUrl = content["about.origin.image"]?.trim() ?? "";

  return (
    <div className="flex w-full flex-col gap-10 px-6 pb-16 md:flex-row md:gap-20 md:px-12 md:pb-25 lg:px-20">
      <Reveal immediate delay={280}>
        <div className="relative flex aspect-[5/6] w-full shrink-0 items-center justify-center overflow-hidden rounded-sm bg-bg-warm md:h-120 md:w-[400px] md:aspect-auto">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Warszawski"
              fill
              sizes="(min-width: 768px) 400px, 100vw"
              className="object-cover"
            />
          ) : (
            <span className="font-display text-5xl font-light leading-none text-ink/6 md:text-[64px] md:leading-[78px]">
              W
            </span>
          )}
        </div>
      </Reveal>
      <Reveal immediate delay={400} className="flex shrink grow basis-0 flex-col justify-center">
        <div className="flex flex-col gap-6 md:gap-8">
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
      </Reveal>
    </div>
  );
}
