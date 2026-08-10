import type { ReportData } from "@/lib/reports/queries";
import { TrendChart } from "./TrendChart";
import { StatTile } from "./StatTile";

const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

function fmtConv(v: number) {
  return Number.isInteger(v) ? num.format(v) : v.toFixed(1);
}

function fmtDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtRange(daily: ReportData["daily"]) {
  if (daily.length === 0) return "";
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const from = new Date(daily[0].date + "T00:00:00").toLocaleDateString("es-AR", opts);
  const to = new Date(daily[daily.length - 1].date + "T00:00:00").toLocaleDateString(
    "es-AR",
    { ...opts, year: "numeric" },
  );
  return `${from} – ${to}`;
}

export function ReportDashboard({ data }: { data: ReportData }) {
  const { summary: s, topSources, daily, updatedAt } = data;
  const deltaUp = (s.weekDeltaPct ?? 0) >= 0;
  const maxSource = Math.max(...topSources.map((t) => t.conversions), 1);

  return (
    <main className="mx-auto flex w-full max-w-[880px] flex-col px-6 py-12 md:px-10 md:py-20">
      {/* Encabezado */}
      <header className="flex flex-col gap-3 border-b border-line pb-8">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark">
          Reporte · Google Ads
        </span>
        <h1 className="font-display text-4xl font-black tracking-[-0.02em] text-ink md:text-5xl">
          WARSZAWSKI
        </h1>
        <p className="text-sm font-light text-ink-soft/70">
          {fmtRange(daily)}
          {updatedAt ? ` · Actualizado ${fmtDate(updatedAt)}` : ""}
        </p>
      </header>

      {/* Métricas principales */}
      <section className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <StatTile
          label="Consultas (30 días)"
          value={fmtConv(s.conversions30d)}
          sub="Compradores mayoristas que escribieron por WhatsApp"
          delta={s.weekDeltaPct != null ? `${deltaUp ? "+" : ""}${s.weekDeltaPct.toFixed(0)}%` : null}
          deltaUp={deltaUp}
        />
        <StatTile
          label="Costo por consulta"
          value={s.costPerConversion != null ? ars.format(s.costPerConversion) : "—"}
          sub="Inversión promedio por cada consulta generada"
        />
        <StatTile
          label="Inversión (30 días)"
          value={ars.format(s.cost30d)}
          sub={`${num.format(s.clicks30d)} visitas al sitio desde los anuncios`}
        />
      </section>

      {/* Tendencia */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-ink">
            Consultas por día
          </h2>
          {s.convPrevWeek > 0 ? (
            <p className="text-[13px] text-ink-soft/70">
              Última semana <span className="font-medium text-gold-dark">{fmtConv(s.convThisWeek)}</span>
              {" "}vs {fmtConv(s.convPrevWeek)} la anterior
            </p>
          ) : null}
        </div>
        <TrendChart data={daily} />
      </section>

      {/* Fuentes de consulta */}
      {topSources.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold tracking-[-0.01em] text-ink">
            De dónde vienen las consultas
          </h2>
          <ul className="flex flex-col gap-4">
            {topSources.slice(0, 6).map((t) => (
              <li key={t.label} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-ink">{t.label}</span>
                  <span className="shrink-0 text-sm font-medium text-gold-dark">
                    {fmtConv(t.conversions)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-warm">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${(t.conversions / maxSource) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Nota de honestidad */}
      <footer className="mt-16 border-t border-line pt-6">
        <p className="text-xs font-light leading-5 text-ink-soft/60">
          "Consultas" son mensajes de WhatsApp de compradores mayoristas (ópticas,
          distribuidores y revendedores) generados por los anuncios. Reflejan interés
          calificado, no ventas cerradas. Los datos se actualizan a diario.
        </p>
      </footer>
    </main>
  );
}
