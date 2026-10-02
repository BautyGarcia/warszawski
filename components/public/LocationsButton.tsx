"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trackShowroomClick } from "@/lib/analytics";
import { getMapsHref, type OfficeAddress } from "@/lib/content/contact";
import { cn } from "@/lib/utils";

type Props = {
  locations: OfficeAddress[];
  /** Texto del boton cuando hay un solo local (link directo a Maps). */
  singleLabel: string;
  /** Texto del boton cuando hay varios locales (despliega la lista). */
  multipleLabel: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "py-3 px-7 text-[13px]/4",
  md: "py-4.5 px-12 text-sm/4.5",
  lg: "py-5 px-14 text-[15px]/4.5",
} as const;

/**
 * Outline counterpart to WhatsAppButton — secondary CTA that takes the
 * visitor to the physical stores. One location: direct Google Maps link.
 * Several: a popover to pick which one, so the hero keeps a single
 * secondary button no matter how many stores there are.
 */
export function LocationsButton({
  locations,
  singleLabel,
  multipleLabel,
  size = "md",
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const buttonClass = cn(
    "inline-flex items-center justify-center rounded-xs border border-ink font-medium text-ink tracking-[0.06em]",
    "transition-[background-color,color,transform] duration-300 ease-out",
    "hover:-translate-y-px hover:bg-ink hover:text-bg",
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    SIZES[size],
    className,
  );

  if (locations.length === 0) return null;

  if (locations.length === 1) {
    const [only] = locations;
    return (
      <Link
        href={getMapsHref(only)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShowroomClick(only.name || only.address)}
        className={buttonClass}
      >
        {singleLabel}
      </Link>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(buttonClass, "gap-2.5", open && "bg-ink text-bg")}
      >
        {multipleLabel}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          aria-hidden
          className={cn(
            "transition-transform duration-300 ease-out motion-reduce:transition-none",
            open && "rotate-180",
          )}
        >
          <path d="M1.5 3.5 5 7l3.5-3.5" />
        </svg>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        className="w-[min(20rem,calc(100vw-3rem))] gap-0 rounded-xs bg-bg p-0 text-ink shadow-[0_12px_40px_-12px_rgba(10,10,10,0.25)] ring-ink/10"
      >
        <ul className="flex flex-col divide-y divide-line">
          {locations.map((loc, i) => (
            <li key={i}>
              <Link
                href={getMapsHref(loc)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackShowroomClick(loc.name || loc.address);
                  setOpen(false);
                }}
                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-bg-warm/50"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  {loc.name ? (
                    <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
                      {loc.name}
                    </span>
                  ) : null}
                  <span className="text-sm text-ink">{loc.address}</span>
                </span>
                <span className="shrink-0 text-xs tracking-[0.05em] text-ink-soft transition-transform duration-200 group-hover:translate-x-0.5">
                  Cómo llegar →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
