import Link from "next/link";
import { Reveal } from "@/components/public/Reveal";
import { ProductCard } from "@/components/public/home/ProductCard";
import type { Product } from "@/types/product";

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section className="flex w-full flex-col">
      <Reveal>
        <div className="flex w-full flex-col items-center bg-bg px-6 pb-10 pt-16 md:px-12 md:pb-12 md:pt-25 lg:px-20">
          <div className="mb-16 h-px w-full bg-bg-warm md:mb-25" />
          <span className="mb-4 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:mb-6 md:text-[11px]">
            Tambien te puede gustar
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-ink md:text-[40px] md:leading-12">
            Modelos relacionados
          </h2>
        </div>
      </Reveal>

      {products.length === 0 ? (
        <Reveal className="flex flex-col items-center px-6 pb-20 text-center md:px-12 md:pb-25 lg:px-20">
          <p className="max-w-[440px] text-sm font-light leading-7 text-ink-soft md:text-base md:leading-8">
            Por ahora este es el unico modelo en la coleccion. Estamos sumando mas pronto.
          </p>
          <Link
            href="/#coleccion"
            className="group mt-6 inline-flex items-center gap-1 border-b border-gold pb-0.5 text-[13px] font-medium tracking-[0.06em] text-gold-dark transition-colors hover:text-ink"
          >
            Ver toda la coleccion
          </Link>
        </Reveal>
      ) : (
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 px-6 pb-20 md:grid-cols-3 md:gap-y-12 md:px-12 md:pb-25 lg:px-20">
          {products.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
