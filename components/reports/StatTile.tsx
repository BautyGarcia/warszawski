type Props = {
  label: string;
  value: string;
  sub?: string;
  /** Delta opcional, ej. "+69%". Positivo = dorado, negativo = tenue. */
  delta?: string | null;
  deltaUp?: boolean;
};

/**
 * Tile de métrica: etiqueta en small-caps tracked, número grande en serif
 * editorial. Estética marca Warszawski (lujo/editorial).
 */
export function StatTile({ label, value, sub, delta, deltaUp }: Props) {
  return (
    <div className="flex flex-col gap-2 border-t border-line pt-5">
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold-dark">
        {label}
      </span>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[clamp(2.25rem,7vw,3.5rem)] font-bold leading-none tracking-[-0.02em] text-ink">
          {value}
        </span>
        {delta ? (
          <span
            className={
              "text-sm font-medium " + (deltaUp ? "text-gold-dark" : "text-ink-soft/60")
            }
          >
            {delta}
          </span>
        ) : null}
      </div>
      {sub ? (
        <span className="text-[13px] font-light leading-5 text-ink-soft/70">{sub}</span>
      ) : null}
    </div>
  );
}
