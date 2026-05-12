import Link from "next/link";
import Image from "next/image";
import type { EditorialPost } from "@/types/editorial";

const DATE_FMT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
  year: "numeric",
};

export function EditorialCard({ post }: { post: EditorialPost }) {
  const date = post.published_at ?? post.created_at;
  return (
    <Link href={`/editorial/${post.slug}`} className="group flex flex-col">
      <div className="relative flex aspect-[4/3] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-bg-warm transition-colors duration-500 ease-out group-hover:bg-[#DDD8CD]">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <span className="font-display text-3xl font-light leading-none text-ink/10 md:text-4xl">
            Editorial
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3 pt-5">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:text-[11px]">
          {new Date(date).toLocaleDateString("es-AR", DATE_FMT)}
        </span>
        <h3 className="font-display text-xl font-semibold leading-tight text-ink transition-colors duration-300 group-hover:text-ink-soft md:text-2xl md:leading-8">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="text-sm font-light leading-6 text-ink-soft md:text-[15px] md:leading-[26px]">
            {post.excerpt}
          </p>
        ) : null}
        <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-gold-dark transition-colors duration-300 group-hover:text-gold">
          Leer nota
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
