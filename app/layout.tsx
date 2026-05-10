import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Warszawski — Anteojos de diseño",
    template: "%s — Warszawski",
  },
  description: "Anteojos de diseño. Mayoristas y distribuidores.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Warszawski",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={cn(playfair.variable, inter.variable, "font-sans")}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
