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
    <div className="flex h-160 flex-col justify-center py-12 pl-18">
      {product.is_exclusive ? (
        <span className="mb-5 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-gold-dark">
          Modelaje Exclusivo
        </span>
      ) : null}

      <h1 className="font-display text-[56px] font-black leading-[60px] tracking-[-0.02em] text-ink">
        {product.name}
      </h1>

      {product.description ? (
        <p className="mt-6 max-w-[380px] text-base font-light leading-7 text-ink-soft">
          {product.description}
        </p>
      ) : null}

      <dl className="mt-10 flex flex-col gap-4 border-t border-bg-warm pt-10">
        {product.materials ? (
          <Row label="Material" value={product.materials} />
        ) : null}
        {product.lens_type ? (
          <Row label="Tipo" value={LENS_LABELS[product.lens_type]} />
        ) : null}
      </dl>

      <div className="mt-10 flex flex-col gap-6">
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
