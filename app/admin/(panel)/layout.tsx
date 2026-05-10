import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { requireAdmin } from "@/lib/auth/guard";

export const metadata = {
  title: "Admin — Warszawski",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AdminTopBar />
      <main className="mx-auto w-full max-w-[1440px] px-6 py-8 md:px-8">
        {children}
      </main>
    </div>
  );
}
