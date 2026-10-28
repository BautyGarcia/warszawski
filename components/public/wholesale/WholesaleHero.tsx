import Link from "next/link";
import { Reveal } from "@/components/public/Reveal";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { getContactInfo } from "@/lib/content/contact";
import type { ContentMap } from "@/types/content";

/**
 * Hero de /mayoristas. A diferencia de la home, el H1 es la frase que busca
 * el visitante ("anteojos por mayor"), no la marca: es lo que Google compara
 * contra el anuncio para puntuar la pagina de destino.
 */
export async function WholesaleHero({ content }: { content: ContentMap }) {
  const { whatsappNumber } = await getContactInfo();

  return (
    <section className="flex w-full flex-col items-center bg-bg px-6 pb-16 pt-20 md:px-12 md:pb-24 md:pt-28 lg:px-20">
      <Reveal immediate delay={0}>
        <span className="block text-center text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:text-[11px]">
          {content["wholesale.hero.label"]}
        </span>
      </Reveal>

      <Reveal immediate delay={120} className="mt-5 md:mt-7">
        <h1 className="max-w-[1040px] text-balance text-center font-display text-[clamp(2.75rem,8.5vw,5.75rem)] font-black leading-[1.02] tracking-[-0.02em] text-ink">
          {content["wholesale.hero.title"]}
        </h1>
      </Reveal>

      <Reveal immediate delay={260} className="mt-5 md:mt-7">
        <p className="max-w-[620px] text-balance text-center text-base font-light leading-7 text-ink-soft md:text-[19px] md:leading-8">
          {content["wholesale.hero.subtitle"]}
        </p>
      </Reveal>

      <Reveal
        immediate
        delay={400}
        className="mt-8 flex w-full max-w-[350px] flex-col gap-3 md:mt-11 md:w-auto md:max-w-none md:flex-row md:gap-4"
      >
        {whatsappNumber ? (
          <WhatsAppButton
            number={whatsappNumber}
            size="md"
            message="Hola, quiero pedir la lista de precios mayorista"
            source="mayoristas_hero"
          >
            {content["wholesale.hero.cta"]}
          </WhatsAppButton>
        ) : null}
        <Link
          href="#showroom"
          className="inline-flex items-center justify-center rounded-xs border border-ink px-8 py-4.5 text-sm/4.5 font-medium tracking-[0.06em] text-ink transition-[background-color,color,transform] duration-300 ease-out hover:-translate-y-px hover:bg-ink hover:text-bg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {content["wholesale.hero.showroomcta"]}
        </Link>
      </Reveal>

      <Reveal immediate delay={520} className="mt-5">
        <span className="block text-center text-xs tracking-[0.05em] text-gold-dark">
          {content["wholesale.hero.subcta"]}
        </span>
      </Reveal>
    </section>
  );
}
