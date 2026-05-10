import { Reveal } from "@/components/public/Reveal";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { SITE_CONFIG } from "@/lib/site-config";
import type { ContentMap } from "@/types/content";

export function FinalCTA({
  content,
  contentKey = "home",
}: {
  content: ContentMap;
  contentKey?: "home" | "about";
}) {
  const titleKey = `${contentKey}.cta.title` as const;
  const descKey = `${contentKey}.cta.description` as const;
  return (
    <section className="flex w-full flex-col items-center bg-bg px-6 py-20 md:px-12 md:py-30 lg:px-20">
      <Reveal>
        <div className="flex flex-col items-center">
          <h2 className="text-center font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-ink md:text-4xl lg:text-5xl lg:leading-14">
            {content[titleKey]}
          </h2>
          <p className="mt-4 max-w-[440px] text-center text-sm font-light leading-6 text-ink-soft md:mt-5 md:text-base md:leading-7">
            {content[descKey]}
          </p>
          <WhatsAppButton
            number={SITE_CONFIG.whatsappNumber}
            size="lg"
            className="mt-8 md:mt-12"
          >
            Escribinos por WhatsApp
          </WhatsAppButton>
        </div>
      </Reveal>
    </section>
  );
}
