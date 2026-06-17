import { Reveal } from "@/components/public/Reveal";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { ShowroomButton } from "@/components/public/ShowroomButton";
import { getContactInfo } from "@/lib/content/contact";
import type { ContentMap } from "@/types/content";

export async function Hero({ content }: { content: ContentMap }) {
  const { whatsappNumber, mapsUrl } = await getContactInfo();

  return (
    <section className="flex min-h-screen w-full shrink-0 flex-col items-center justify-center bg-bg px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <Reveal immediate delay={0}>
        <span className="block max-w-[480px] text-balance text-center text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:text-[11px]">
          {content["home.hero.label"]}
        </span>
      </Reveal>

      <Reveal immediate delay={120} className="mt-6 md:mt-10">
        <h1 className="w-full text-center font-display text-[clamp(2.75rem,13vw,9.25rem)] font-black leading-none tracking-[-0.02em] text-ink">
          WARSZAWSKI
        </h1>
      </Reveal>

      <Reveal immediate delay={260} className="mt-6 md:mt-8">
        <p className="max-w-[480px] text-balance text-center text-base font-light leading-7 text-ink-soft md:text-xl md:leading-8">
          {content["home.hero.subtitle"]}
        </p>
      </Reveal>

      {whatsappNumber ? (
        <Reveal immediate delay={400} className="mt-10 md:mt-14">
          <WhatsAppButton number={whatsappNumber} size="md">
            {content["home.hero.cta"]}
          </WhatsAppButton>
        </Reveal>
      ) : null}

      {mapsUrl ? (
        <Reveal
          immediate
          delay={480}
          className={whatsappNumber ? "mt-4" : "mt-10 md:mt-14"}
        >
          <ShowroomButton href={mapsUrl} size="md">
            Visite nuestro showroom
          </ShowroomButton>
        </Reveal>
      ) : null}

      <Reveal immediate delay={560} className="mt-5">
        <span className="block text-center text-xs tracking-[0.05em] text-gold-dark">
          {content["home.hero.subcta"]}
        </span>
      </Reveal>
    </section>
  );
}
