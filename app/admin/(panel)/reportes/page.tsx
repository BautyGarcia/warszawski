import { SITE_URL } from "@/lib/seo";
import { getReportData } from "@/lib/reports/queries";
import { ReportDashboard } from "@/components/reports/ReportDashboard";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";

export const dynamic = "force-dynamic";

export default async function AdminReportesPage() {
  const token = process.env.REPORTS_TOKEN;

  if (!token) {
    return (
      <div className="max-w-xl">
        <h1 className="text-lg font-semibold text-ink">Reportes</h1>
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Falta configurar <code className="font-mono">REPORTS_TOKEN</code> en las
          variables de entorno (local y Vercel) para habilitar el link del reporte.
        </p>
      </div>
    );
  }

  const url = `${SITE_URL}/r/${token}`;
  const data = await getReportData();

  return (
    <div className="flex flex-col gap-6">
      {/* Link para compartir */}
      <div className="flex flex-col gap-3 rounded-lg border border-black/8 bg-[#FAFAF9] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A8A8A]">
            Link privado para el cliente
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-mono text-[13px] text-ink underline decoration-black/20 underline-offset-2 hover:decoration-ink"
          >
            {url}
          </a>
        </div>
        <div className="flex shrink-0 gap-2">
          <CopyLinkButton url={url} />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[5px] bg-ink px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-ink/85"
          >
            Abrir reporte ↗
          </a>
        </div>
      </div>

      {/* Vista previa en vivo (lo mismo que ve el cliente) */}
      <div className="overflow-hidden rounded-lg border border-black/8 bg-bg">
        <ReportDashboard data={data} />
      </div>
    </div>
  );
}
