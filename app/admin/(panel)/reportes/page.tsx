import { getReportData } from "@/lib/reports/queries";
import { ReportDashboard } from "@/components/reports/ReportDashboard";

export const dynamic = "force-dynamic";

export default async function AdminReportesPage() {
  const data = await getReportData();

  return (
    <div className="overflow-hidden rounded-lg border border-black/8 bg-bg">
      <ReportDashboard data={data} />
    </div>
  );
}
