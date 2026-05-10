import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  number: string;
  message?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "py-3 px-7 text-[13px]/4",
  md: "py-4.5 px-12 text-sm/4.5",
  lg: "py-5 px-14 text-[15px]/4.5",
} as const;

export function WhatsAppButton({ number, message, children, size = "md", className }: Props) {
  return (
    <Link
      href={buildWhatsAppUrl(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-xs bg-ink font-medium text-bg tracking-[0.06em]",
        "transition-[background-color,transform] duration-300 ease-out",
        "hover:-translate-y-px hover:bg-ink-soft",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        SIZES[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
