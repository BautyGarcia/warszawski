import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ label, title, description, className }: Props) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center px-6 pb-12 pt-16 md:px-12 md:pb-16 md:pt-25 lg:px-20",
        className,
      )}
    >
      <span className="mb-4 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:mb-6 md:text-[11px]">
        {label}
      </span>
      <h2 className="text-center font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-ink md:text-5xl lg:text-[56px] lg:leading-16">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-[520px] text-center text-sm font-light leading-6 text-ink-soft md:mt-5 md:text-base md:leading-7">
          {description}
        </p>
      ) : null}
    </div>
  );
}
