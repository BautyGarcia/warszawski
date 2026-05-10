import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ label, title, description, className }: Props) {
  return (
    <div className={cn("flex w-full flex-col items-center px-20 pb-16 pt-25", className)}>
      <span className="mb-6 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-gold-dark">
        {label}
      </span>
      <h2 className="text-center font-display text-[56px] font-bold leading-16 tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-[520px] text-center text-base font-light leading-7 text-ink-soft">
          {description}
        </p>
      ) : null}
    </div>
  );
}
