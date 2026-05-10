import Link from "next/link";
import { WhatsAppButton } from "./WhatsAppButton";
import { SITE_CONFIG } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-bg/95 px-20 py-8 backdrop-blur">
      <Link
        href="/"
        className="inline-block font-display text-xl font-bold tracking-[0.15em] text-ink"
      >
        {SITE_CONFIG.brand.name}
      </Link>
      <nav className="flex items-center gap-10">
        {SITE_CONFIG.nav.public.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[13px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
        <WhatsAppButton number={SITE_CONFIG.whatsappNumber} size="sm">
          WhatsApp
        </WhatsAppButton>
      </nav>
    </header>
  );
}
