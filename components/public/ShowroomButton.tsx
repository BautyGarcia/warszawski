import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "py-3 px-7 text-[13px]/4",
  md: "py-4.5 px-12 text-sm/4.5",
  lg: "py-5 px-14 text-[15px]/4.5",
} as const;

/**
 * Outline counterpart to WhatsAppButton — used for the secondary "Visite
 * nuestro showroom" CTA so it reads as secondary next to the solid one.
 */
export function ShowroomButton({ href, children, size = "md", className }: Props) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-xs border border-ink font-medium text-ink tracking-[0.06em]",
        "transition-[background-color,color,transform] duration-300 ease-out",
        "hover:-translate-y-px hover:bg-ink hover:text-bg",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        SIZES[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
