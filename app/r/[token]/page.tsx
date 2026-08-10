import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReportData } from "@/lib/reports/queries";
import { ReportDashboard } from "@/components/reports/ReportDashboard";

// Lee de Supabase con service role en cada request: nunca estático/cacheado.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Reporte — Warszawski" },
  // Link privado: nunca indexar.
  robots: { index: false, follow: false },
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const expected = process.env.REPORTS_TOKEN;

  // Sin token configurado, o token incorrecto → 404 (no revela que existe).
  if (!expected || token !== expected) notFound();

  const data = await getReportData();
  return <ReportDashboard data={data} />;
}
