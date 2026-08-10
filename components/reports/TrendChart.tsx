import type { AdsDaily } from "@/lib/reports/queries";

/**
 * Gráfico de barras de consultas por día (serie única).
 * Guía dataviz: una sola serie → un solo tono; barras en carbón, con la barra
 * más reciente y la pico en dorado (color = significado, no decoración);
 * ejes/grid recesivos; etiquetas directas selectivas (no un número por barra).
 * SVG puro, sin librerías (el sitio no tiene chart lib). Server component.
 */
export function TrendChart({ data }: { data: AdsDaily[] }) {
  const days = data.slice(-14);
  if (days.length === 0) {
    return (
      <p className="text-sm text-ink-soft/60">Sin datos todavía.</p>
    );
  }

  // Geometría (viewBox; el SVG escala al ancho del contenedor).
  const W = 720;
  const H = 240;
  const padX = 8;
  const padTop = 28;
  const padBottom = 34;
  const plotH = H - padTop - padBottom;
  const n = days.length;
  const slot = (W - padX * 2) / n;
  const barW = Math.min(slot * 0.56, 34);

  const maxConv = Math.max(...days.map((d) => d.conversions), 1);
  const peakIdx = days.reduce(
    (best, d, i) => (d.conversions > days[best].conversions ? i : best),
    0,
  );
  const lastIdx = n - 1;

  const y = (v: number) => padTop + plotH - (v / maxConv) * plotH;
  const baseY = padTop + plotH;

  const shortDate = (iso: string) => {
    const [, m, d] = iso.split("-");
    return `${Number(d)}/${Number(m)}`;
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label="Consultas por día en los últimos 14 días"
      className="block"
    >
      {/* Baseline recesiva */}
      <line
        x1={padX}
        x2={W - padX}
        y1={baseY}
        y2={baseY}
        stroke="var(--color-line)"
        strokeWidth={1}
      />
      {days.map((d, i) => {
        const cx = padX + slot * i + slot / 2;
        const h = Math.max((d.conversions / maxConv) * plotH, d.conversions > 0 ? 3 : 0);
        const highlight = i === lastIdx || i === peakIdx;
        const showValue = (i === peakIdx || i === lastIdx) && d.conversions > 0;
        const showTick = i % 2 === 0 || i === lastIdx;
        return (
          <g key={d.date}>
            {d.conversions > 0 ? (
              <rect
                x={cx - barW / 2}
                y={baseY - h}
                width={barW}
                height={h}
                rx={3}
                fill={highlight ? "var(--color-gold)" : "var(--color-ink-soft)"}
              />
            ) : (
              // Día sin consultas: marca mínima tenue sobre la baseline.
              <circle cx={cx} cy={baseY} r={1.6} fill="var(--color-line)" />
            )}
            {showValue ? (
              <text
                x={cx}
                y={baseY - h - 8}
                textAnchor="middle"
                className="font-sans"
                fontSize={13}
                fontWeight={600}
                fill="var(--color-gold-dark)"
              >
                {Number.isInteger(d.conversions)
                  ? d.conversions
                  : d.conversions.toFixed(1)}
              </text>
            ) : null}
            {showTick ? (
              <text
                x={cx}
                y={H - 12}
                textAnchor="middle"
                className="font-sans"
                fontSize={11}
                fill="var(--color-ink-soft)"
                opacity={0.55}
              >
                {shortDate(d.date)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
