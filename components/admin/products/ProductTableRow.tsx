import Link from "next/link";
import Image from "next/image";
import { ReorderButtons } from "./ReorderButtons";
import { DeleteButton } from "./DeleteButton";
import type { Product } from "@/types/product";

const CATEGORY_LABELS: Record<NonNullable<Product["category"]>, string> = {
  recetados: "Recetados",
  sol: "Sol",
};
const LENS_LABELS: Record<NonNullable<Product["lens_type"]>, string> = {
  recetado: "Recetado",
  sol: "Sol",
  multifocal: "Multifocal",
};

export function ProductTableRow({ product }: { product: Product }) {
  const thumb = product.images[0]?.url;
  return (
    <div className="flex items-center border-b border-black/5 px-3 py-2 transition-colors hover:bg-black/[0.015]">
      <div className="mr-3 size-10 shrink-0 overflow-hidden rounded-sm bg-[#F0EDE8]">
        {thumb ? (
          <Image
            src={thumb}
            alt={product.images[0]?.alt ?? product.name}
            width={40}
            height={40}
            className="size-full object-cover"
            unoptimized
          />
        ) : null}
      </div>
      <div className="flex w-60 shrink-0 flex-col gap-0.5">
        <Link
          href={`/admin/productos/${product.id}`}
          className="text-sm font-medium text-ink hover:underline"
        >
          {product.name}
        </Link>
        <span className="text-xs text-[#999]">{product.slug}</span>
      </div>
      <div className="w-30 shrink-0 text-[13px] text-[#6B6B6B]">
        {product.category ? CATEGORY_LABELS[product.category] : "—"}
      </div>
      <div className="w-30 shrink-0 text-[13px] text-[#6B6B6B]">
        {product.lens_type ? LENS_LABELS[product.lens_type] : "—"}
      </div>
      <div className="w-25 shrink-0">
        {product.is_exclusive ? (
          <div className="flex size-5 items-center justify-center rounded-sm bg-gold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : (
          <div className="size-5 rounded-sm border border-black/10" />
        )}
      </div>
      <div className="w-20 shrink-0">
        <ReorderButtons id={product.id} order={product.display_order} />
      </div>
      <div className="flex grow shrink basis-0 items-center justify-end gap-1.5">
        <Link
          href={`/admin/productos/${product.id}`}
          aria-label={`Editar ${product.name}`}
          className="flex size-7 items-center justify-center rounded-[5px] border border-black/10 text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </Link>
        <DeleteButton id={product.id} name={product.name} />
      </div>
    </div>
  );
}
