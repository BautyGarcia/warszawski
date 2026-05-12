import Link from "next/link";

type Props = { title: string; subtitle?: string; backHref?: string };

export function FormHeader({ title, subtitle, backHref = "/admin/productos" }: Props) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <Link
        href={backHref}
        aria-label="Volver"
        className="flex size-8 items-center justify-center rounded-md border border-black/10 text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-[-0.02em] text-ink">{title}</h1>
        {subtitle ? (
          <p className="text-[13px] text-[#6B6B6B]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
