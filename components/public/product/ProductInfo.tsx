import { ColorPicker } from "./ColorPicker";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Product } from "@/types/product";

const LENS_LABELS: Record<NonNullable<Product["lens_type"]>, string> = {
  recetado: "Recetado",
  sol: "Sol",
  multifocal: "Multifocal",
};

export function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="flex flex-col justify-center py-8 md:h-160 md:py-12 md:pl-18">
      {product.is_exclusive ? (
        <span className="mb-4 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:mb-5 md:text-[11px]">
          Modelaje Exclusivo
        </span>
      ) : null}

      <h1 className="font-display text-4xl font-black leading-tight tracking-[-0.02em] text-ink md:text-[56px] md:leading-[60px]">
        {product.name}
      </h1>

      {product.description ? (
        <p className="mt-5 max-w-[380px] text-sm font-light leading-6 text-ink-soft md:mt-6 md:text-base md:leading-7">
          {product.description}
        </p>
      ) : null}

      <dl className="mt-8 flex flex-col gap-4 border-t border-bg-warm pt-8 md:mt-10 md:pt-10">
        {product.materials ? <Row label="Material" value={product.materials} /> : null}
        {product.lens_type ? (
          <Row label="Tipo" value={LENS_LABELS[product.lens_type]} />
        ) : null}
      </dl>

      <div className="mt-8 flex flex-col gap-6 md:mt-10">
        <ColorPicker colors={product.available_colors} />
        <WhatsAppButton
          number={SITE_CONFIG.whatsappNumber}
          message={`Hola, quiero consultar por ${product.name}`}
          size="md"
          className="w-full"
        >
          Consultar por {product.name}
        </WhatsAppButton>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs font-medium uppercase tracking-[0.15em] text-gold-dark">
        {label}
      </dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}
