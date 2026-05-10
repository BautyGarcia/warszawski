import { reorderProductAction } from "@/actions/products";

export function ReorderButtons({ id, order }: { id: string; order: number }) {
  return (
    <div className="flex items-center gap-1">
      <ReorderForm id={id} direction="up" />
      <ReorderForm id={id} direction="down" />
      <span className="ml-1 text-xs text-[#999]">{order}</span>
    </div>
  );
}

function ReorderForm({ id, direction }: { id: string; direction: "up" | "down" }) {
  return (
    <form action={reorderProductAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        aria-label={direction === "up" ? "Subir" : "Bajar"}
        className="flex size-6 items-center justify-center rounded-sm border border-black/10 text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {direction === "up" ? (
            <polyline points="18 15 12 9 6 15" />
          ) : (
            <polyline points="6 9 12 15 18 9" />
          )}
        </svg>
      </button>
    </form>
  );
}
