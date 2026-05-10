import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { SITE_CONFIG } from "@/lib/site-config";
import type { ContentMap } from "@/types/content";

export function Hero({ content }: { content: ContentMap }) {
  return (
    <section className="flex h-[800px] w-full shrink-0 flex-col items-center justify-center bg-bg px-20 pb-30 pt-40">
      <span className="mb-10 inline-block whitespace-pre-line text-[11px] font-medium uppercase tracking-[0.3em] text-gold-dark">
        {content["home.hero.label"]}
      </span>
      <h1 className="text-center font-display text-[148px] font-black leading-[148px] tracking-[-0.02em] text-ink">
        WARSZAWSKI
      </h1>
      <p className="mt-8 max-w-[480px] text-center text-xl font-light leading-8 text-ink-soft">
        {content["home.hero.subtitle"]}
      </p>
      <WhatsAppButton
        number={SITE_CONFIG.whatsappNumber}
        size="md"
        className="mt-14"
      >
        {content["home.hero.cta"]}
      </WhatsAppButton>
      <span className="mt-5 inline-block text-xs tracking-[0.05em] text-gold-dark">
        {content["home.hero.subcta"]}
      </span>
    </section>
  );
}
