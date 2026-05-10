import { cn } from "@/lib/utils";

type Props = {
  index: number;
  title: string;
  description: string;
  withBorders?: boolean;
};

export function ValueCard({ index, title, description, withBorders }: Props) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 py-10 md:gap-5 md:p-12",
        "border-t border-bg/10 first:border-t-0 md:border-t-0",
        withBorders && "md:border-x md:border-bg/10",
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
        {String(index).padStart(2, "0")}
      </span>
      <h3 className="font-display text-xl font-semibold leading-tight text-bg md:text-2xl md:leading-8">
        {title}
      </h3>
      <p className="text-sm font-light leading-6 text-bg/80">{description}</p>
    </div>
  );
}
