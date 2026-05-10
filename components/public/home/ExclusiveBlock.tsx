import Link from "next/link";
import { Reveal } from "@/components/public/Reveal";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Product } from "@/types/product";

type Props = {
  index: number;
  product: Product;
  align: "image-left" | "image-right";
};

export function ExclusiveBlock({ index, product, align }: Props) {
  const numberLabel = String(index).padStart(2, "0");
  const isLeft = align === "image-left";

  const imageSlot = (
    <div
      className={cn(
        "flex h-64 shrink-0 items-center justify-center bg-bg-warm md:h-auto md:shrink md:grow md:basis-0",
        "rounded-t-sm md:rounded-t-none",
        isLeft ? "md:rounded-l-sm" : "md:rounded-r-sm",
      )}
    >
      <span className="font-display text-6xl font-light leading-none tracking-[-0.02em] text-ink/8 md:text-[80px]">
        {numberLabel}
      </span>
    </div>
  );

  const panel = (
    <div
      className={cn(
        "flex flex-col justify-center bg-ink px-8 py-12 md:shrink-0 md:grow-0 md:basis-[480px] md:px-18 md:py-16",
        "rounded-b-sm md:rounded-b-none",
        isLeft ? "md:rounded-r-sm" : "md:rounded-l-sm",
      )}
    >
      <span className="mb-4 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold md:mb-6 md:text-[11px]">
        Modelo Exclusivo
      </span>
      <h3 className="font-display text-3xl font-bold leading-tight tracking-[-0.01em] text-bg md:text-[40px] md:leading-12">
        {product.name}
      </h3>
      <p className="mt-4 text-sm font-light leading-6 text-bg/70 md:mt-5 md:text-[15px] md:leading-[26px]">
        {product.description ?? product.short_description}
      </p>
      <Link
        href={buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, `Hola, quiero consultar por ${product.name}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-flex w-fit items-center gap-1 pb-0.5 text-[13px] font-medium tracking-[0.06em] text-gold transition-colors duration-300 hover:text-bg md:mt-10"
      >
        <span className="relative">
          Consultar por {product.name}
          <span className="absolute -bottom-px left-0 h-px w-full bg-gold transition-colors duration-300 group-hover:bg-bg" />
        </span>
      </Link>
    </div>
  );

  return (
    <Reveal>
      <article className="flex w-full flex-col px-6 md:h-[560px] md:flex-row md:px-12 lg:px-20">
        {isLeft ? (
          <>
            {imageSlot}
            {panel}
          </>
        ) : (
          <>
            <div className="contents md:hidden">
              {imageSlot}
              {panel}
            </div>
            <div className="hidden md:contents">
              {panel}
              {imageSlot}
            </div>
          </>
        )}
      </article>
    </Reveal>
  );
}
