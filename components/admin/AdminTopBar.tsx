"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Productos", href: "/admin/productos" },
  { label: "Contenido", href: "/admin/contenido" },
];

export function AdminTopBar() {
  const pathname = usePathname() ?? "";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/8 bg-white px-6 md:px-8">
      <div className="flex items-center gap-4 md:gap-6">
        <Link
          href="/admin/productos"
          className="text-[15px] font-semibold tracking-[-0.01em] text-ink"
        >
          WARSZAWSKI
        </Link>
        <div className="hidden h-5 w-px bg-black/10 md:block" />
        <nav className="flex gap-1">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "rounded-[5px] px-3 py-1.5 text-[13px] transition-colors",
                  active
                    ? "bg-[#F7F7F5] font-medium text-ink"
                    : "text-[#6B6B6B] hover:bg-[#F7F7F5] hover:text-ink",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-[5px] border border-black/10 px-3 py-1.5 text-[13px] text-[#6B6B6B] transition-colors hover:border-ink/30 hover:text-ink"
        >
          Cerrar sesión
        </button>
      </form>
    </header>
  );
}
