"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
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

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-bg/95 backdrop-blur transition-[border-color,box-shadow] duration-300 ease-out",
        "border-b border-transparent",
        scrolled && "border-line",
        open &&
          "max-md:fixed max-md:inset-0 max-md:z-50 max-md:flex max-md:flex-col max-md:border-b-0 max-md:bg-bg max-md:backdrop-blur-none",
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
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
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
        <div className="flex flex-1 flex-col overflow-y-auto border-t border-line bg-bg md:hidden">
          <nav className="flex flex-1 flex-col items-center justify-center gap-1 px-6 py-12">
            {SITE_CONFIG.nav.public.map((item, index) =>
              item.href === COLLECTION_HREF ? (
                <div
                  key={item.href}
                  style={{ animationDelay: `${100 + index * 90}ms` }}
                  className="flex flex-col items-center gap-5 py-5 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:ease-out"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-[2.125rem] leading-none tracking-[-0.01em] text-ink transition-colors duration-200 active:text-gold-dark"
                  >
                    {item.label}
                  </Link>
                  <div className="flex items-center gap-4">
                    {CATEGORIES.map((category, categoryIndex) => (
                      <Fragment key={category}>
                        {categoryIndex > 0 ? (
                          <span aria-hidden className="h-3.5 w-px bg-line" />
                        ) : null}
                        <Link
                          href={`/coleccion/${category}`}
                          onClick={() => setOpen(false)}
                          className="px-1 py-1 text-xs uppercase tracking-[0.18em] text-gold-dark transition-colors duration-200 active:text-ink"
                        >
                          {CATEGORY_META[category].label}
                        </Link>
                      </Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: `${100 + index * 90}ms` }}
                  className="py-5 font-display text-[2.125rem] leading-none tracking-[-0.01em] text-ink transition-colors duration-200 active:text-gold-dark motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:ease-out"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {whatsappNumber ? (
            <div className="border-t border-line px-6 pb-10 pt-7 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:fill-mode-both motion-safe:duration-700 motion-safe:[animation-delay:300ms]">
              <WhatsAppButton number={whatsappNumber} size="lg" className="w-full">
                WhatsApp
              </WhatsAppButton>
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
