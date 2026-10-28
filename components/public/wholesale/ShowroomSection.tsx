import Image from "next/image";
import { Reveal } from "@/components/public/Reveal";
import { LocationsButton } from "@/components/public/LocationsButton";
import { getContactInfo } from "@/lib/content/contact";
import type { ContentMap } from "@/types/content";

/**
 * Bloque oscuro con los locales (cargados en Contacto > Locales). Es el ancla
 * del boton "Visitar showroom" del hero y lo que le da a las busquedas tipo
 * "anteojos por mayor once" una pagina que de verdad habla de Once.
 */
export async function ShowroomSection({ content }: { content: ContentMap }) {
  const { addresses } = await getContactInfo();
  const imageUrl = content["wholesale.showroom.image"]?.trim() ?? "";
  const hours = content["wholesale.showroom.hours"]?.trim() ?? "";

  return (
    <section id="showroom" className="flex w-full scroll-mt-20 flex-col bg-ink md:flex-row">
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#1C1B19] md:aspect-auto md:min-h-[620px] md:w-1/2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={content["wholesale.showroom.label"]}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="font-display text-3xl italic text-bg/10 md:text-[40px]">
            {content["wholesale.showroom.label"]}
          </span>
        )}
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-12 md:py-24 lg:px-20">
        <Reveal>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold md:text-[11px]">
            {content["wholesale.showroom.label"]}
          </span>
        </Reveal>
        <Reveal delay={100} className="mt-3.5 md:mt-5">
          <h2 className="max-w-[560px] font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-bg md:text-[48px]">
            {content["wholesale.showroom.title"]}
          </h2>
        </Reveal>
        <Reveal delay={200} className="mt-3.5 md:mt-5">
          <p className="max-w-[480px] text-[15px] font-light leading-6 text-bg/75 md:text-base md:leading-7">
            {content["wholesale.showroom.description"]}
          </p>
        </Reveal>

        {addresses.length > 0 ? (
          <Reveal delay={300} className="mt-7 flex flex-col gap-4 md:mt-10 md:gap-5">
            {addresses.map((office) => (
              <div key={office.address} className="flex flex-col gap-0.5 md:gap-1">
                <span className="text-base font-medium leading-6 text-bg md:text-[17px]">
                  {office.name ? `${office.name} · ${office.address}` : office.address}
                </span>
                {hours || office.phone ? (
                  <span className="text-[13px] leading-5 text-bg/55 md:text-sm">
                    {[hours, office.phone].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
              </div>
            ))}
          </Reveal>
        ) : null}

        {addresses.length > 0 ? (
          <Reveal delay={400} className="mt-7 md:mt-10">
            <LocationsButton
              locations={addresses}
              singleLabel="Cómo llegar"
              multipleLabel="Cómo llegar"
              size="sm"
              className="border-bg text-bg hover:bg-bg hover:text-ink"
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
