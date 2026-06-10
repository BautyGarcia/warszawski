"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WhatsAppButton } from "./WhatsAppButton";
import { SITE_CONFIG } from "@/lib/site-config";
import { CATEGORIES, CATEGORY_META } from "@/lib/category";
import { cn } from "@/lib/utils";

const COLLECTION_HREF = "/#coleccion";

export function SiteHeader({ whatsappNumber }: { whatsappNumber: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-bg/95 backdrop-blur transition-[border-color,box-shadow] duration-300 ease-out",
        "border-b border-transparent",
        scrolled && "border-line",
      )}
    >
      <div className="flex items-center justify-between px-6 py-6 md:px-12 md:py-7 lg:px-20 lg:py-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-base font-bold tracking-[0.15em] text-ink md:text-lg lg:text-xl"
        >
          {SITE_CONFIG.brand.name}
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {SITE_CONFIG.nav.public.map((item) =>
            item.href === COLLECTION_HREF ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="text-[13px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-ink group-focus-within:text-ink"
                >
                  {item.label}
                </Link>
                {/* pt-3 bridges the gap to the panel so hover doesn't drop on the way down */}
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="flex min-w-44 flex-col border border-line bg-bg py-2 shadow-[0_12px_40px_-12px_rgba(10,10,10,0.25)]">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category}
                        href={`/coleccion/${category}`}
                        className="px-5 py-2.5 text-[13px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:bg-line/40 hover:text-ink"
                      >
                        {CATEGORY_META[category].label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ),
          )}
          {whatsappNumber ? (
            <WhatsAppButton number={whatsappNumber} size="sm">
              WhatsApp
            </WhatsAppButton>
          ) : null}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
          aria-expanded={open}
          className="flex size-10 items-center justify-center md:hidden"
        >
          <span className="relative block size-5">
            <span
              className={cn(
                "absolute left-0 right-0 h-px bg-ink transition-all",
                open ? "top-1/2 rotate-45" : "top-1",
              )}
            />
            <span
              className={cn(
                "absolute left-0 right-0 top-1/2 h-px bg-ink transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 right-0 h-px bg-ink transition-all",
                open ? "top-1/2 -rotate-45" : "bottom-1",
              )}
            />
          </span>
        </button>
      </div>

      {open ? (
        <nav className="flex flex-col gap-4 border-t border-line bg-bg px-6 py-6 md:hidden">
          {SITE_CONFIG.nav.public.map((item) =>
            item.href === COLLECTION_HREF ? (
              <div key={item.href} className="flex flex-col gap-3">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.08em] text-ink"
                >
                  {item.label}
                </Link>
                <div className="flex flex-col gap-3 border-l border-line pl-4">
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category}
                      href={`/coleccion/${category}`}
                      onClick={() => setOpen(false)}
                      className="text-[13px] uppercase tracking-[0.08em] text-ink-soft"
                    >
                      {CATEGORY_META[category].label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.08em] text-ink"
              >
                {item.label}
              </Link>
            ),
          )}
          {whatsappNumber ? (
            <WhatsAppButton number={whatsappNumber} size="sm" className="mt-2 w-fit">
              WhatsApp
            </WhatsAppButton>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
