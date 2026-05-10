import Link from "next/link";
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
        "flex shrink grow basis-0 items-center justify-center bg-bg-warm",
        isLeft ? "rounded-l-sm" : "rounded-r-sm",
      )}
    >
      <span className="font-display text-[80px] font-light leading-24 tracking-[-0.02em] text-ink/8">
        {numberLabel}
      </span>
    </div>
  );

  const panel = (
    <div
      className={cn(
        "flex shrink-0 grow-0 basis-[480px] flex-col justify-center bg-ink px-18 py-16",
        isLeft ? "rounded-r-sm" : "rounded-l-sm",
      )}
    >
      <span className="mb-6 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
        Modelo Exclusivo
      </span>
      <h3 className="font-display text-[40px] font-bold leading-12 tracking-[-0.01em] text-bg">
        {product.name}
      </h3>
      <p className="mt-5 text-[15px] font-light leading-[26px] text-bg/70">
        {product.description ?? product.short_description}
      </p>
      <Link
        href={buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, `Hola, quiero consultar por ${product.name}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block w-fit border-b border-gold pb-0.5 text-[13px] font-medium tracking-[0.06em] text-gold transition-opacity hover:opacity-80"
      >
        Consultar por {product.name}
      </Link>
    </div>
  );

  return (
    <article className="flex h-[560px] w-full shrink-0 px-20">
      {isLeft ? (
        <>
          {imageSlot}
          {panel}
        </>
      ) : (
        <>
          {panel}
          {imageSlot}
        </>
      )}
    </article>
  );
}
