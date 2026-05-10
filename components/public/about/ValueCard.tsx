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
        "flex shrink grow basis-0 flex-col gap-5 p-12",
        withBorders && "border-x border-bg/10",
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
        {String(index).padStart(2, "0")}
      </span>
      <h3 className="font-display text-2xl font-semibold leading-8 text-bg">{title}</h3>
      <p className="text-sm font-light leading-6 text-bg/80">{description}</p>
    </div>
  );
}
