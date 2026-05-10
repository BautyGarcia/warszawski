import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { SITE_CONFIG } from "@/lib/site-config";
import type { ContentMap } from "@/types/content";

export function Hero({ content }: { content: ContentMap }) {
  return (
    <section className="flex min-h-screen w-full shrink-0 flex-col items-center justify-center bg-bg px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <span className="mb-6 inline-block max-w-[480px] text-center text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:mb-10 md:text-[11px]">
        {content["home.hero.label"]}
      </span>
      <h1 className="text-center font-display text-[64px] font-black leading-none tracking-[-0.02em] text-ink sm:text-7xl md:text-9xl lg:text-[148px]">
        WARSZAWSKI
      </h1>
      <p className="mt-6 max-w-[480px] text-center text-base font-light leading-7 text-ink-soft md:mt-8 md:text-xl md:leading-8">
        {content["home.hero.subtitle"]}
      </p>
      <WhatsAppButton
        number={SITE_CONFIG.whatsappNumber}
        size="md"
        className="mt-10 md:mt-14"
      >
        {content["home.hero.cta"]}
      </WhatsAppButton>
      <span className="mt-5 inline-block text-center text-xs tracking-[0.05em] text-gold-dark">
        {content["home.hero.subcta"]}
      </span>
    </section>
  );
}
