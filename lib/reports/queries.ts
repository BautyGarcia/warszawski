import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ads_daily, ads_meta } from "@/lib/schema";

export type AdsDaily = {
  date: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  cost: number; // ARS
  conversions: number;
};

export type TopSource = { label: string; conversions: number };

export type ReportSummary = {
  conversions30d: number;
  cost30d: number;
  clicks30d: number;
  costPerConversion: number | null;
  convThisWeek: number;
  convPrevWeek: number;
  weekDeltaPct: number | null; // +69 → subió 69%
};

export type ReportData = {
  daily: AdsDaily[];
  topSources: TopSource[];
  updatedAt: string | null;
  summary: ReportSummary;
};

function sum(rows: AdsDaily[], key: keyof AdsDaily) {
  return rows.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);
}

/** Últimos `days` días de filas (asumiendo `daily` ordenado asc por fecha). */
function lastN(daily: AdsDaily[], days: number) {
  return daily.slice(-days);
}

export function computeSummary(daily: AdsDaily[]): ReportSummary {
  const last30 = lastN(daily, 30);
  const conversions30d = sum(last30, "conversions");
  const cost30d = sum(last30, "cost");
  const clicks30d = sum(last30, "clicks");

  const last7 = lastN(daily, 7);
  const prev7 = daily.slice(-14, -7);
  const convThisWeek = sum(last7, "conversions");
  const convPrevWeek = sum(prev7, "conversions");

  const weekDeltaPct =
    convPrevWeek > 0
      ? ((convThisWeek - convPrevWeek) / convPrevWeek) * 100
      : null;

  return {
    conversions30d,
    cost30d,
    clicks30d,
    costPerConversion: conversions30d > 0 ? cost30d / conversions30d : null,
    convThisWeek,
    convPrevWeek,
    weekDeltaPct,
  };
}

/**
 * Lee las métricas del reporte desde la base de datos (dbm Postgres).
 * SOLO usable desde el servidor (Server Components / route handlers).
 */
export async function getReportData(): Promise<ReportData> {
  const [dailyRows, [meta]] = await Promise.all([
    db
      .select({
        date: ads_daily.date,
        impressions: ads_daily.impressions,
        clicks: ads_daily.clicks,
        cost: ads_daily.cost,
        conversions: ads_daily.conversions,
      })
      .from(ads_daily)
      .orderBy(asc(ads_daily.date)),
    db
      .select({ top_sources: ads_meta.top_sources, updated_at: ads_meta.updated_at })
      .from(ads_meta)
      .where(eq(ads_meta.id, 1))
      .limit(1),
  ]);

  const daily: AdsDaily[] = dailyRows.map((r) => ({
    date: r.date,
    impressions: Number(r.impressions) || 0,
    clicks: Number(r.clicks) || 0,
    cost: Number(r.cost) || 0,
    conversions: Number(r.conversions) || 0,
  }));

  const topSources: TopSource[] = Array.isArray(meta?.top_sources) ? meta.top_sources : [];

  return {
    daily,
    topSources,
    updatedAt: meta?.updated_at ?? null,
    summary: computeSummary(daily),
  };
}
