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
    <section className="flex w-full flex-col items-center bg-bg px-20 py-30">
      <h2 className="text-center font-display text-5xl font-bold leading-14 tracking-[-0.02em] text-ink">
        {content[titleKey]}
      </h2>
      <p className="mt-5 max-w-[440px] text-center text-base font-light leading-7 text-ink-soft">
        {content[descKey]}
      </p>
      <WhatsAppButton
        number={SITE_CONFIG.whatsappNumber}
        size="lg"
        className="mt-12"
      >
        Escribinos por WhatsApp
      </WhatsAppButton>
    </section>
  );
}
