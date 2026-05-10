import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Coleccion", href: "/#coleccion" },
  { label: "Nosotros", href: "/nosotros" },
];

export function SiteFooter() {
  return (
    <footer className="flex w-full items-start justify-between border-t border-bg/10 bg-ink px-20 py-16">
      <div className="flex flex-col gap-4">
        <span className="font-display text-lg font-bold tracking-[0.12em] text-bg">
          {SITE_CONFIG.brand.name}
        </span>
        <p className="whitespace-pre-line text-[13px] font-light leading-[22px] text-bg/70">
          {SITE_CONFIG.brand.tagline}
        </p>
      </div>

      <div className="flex gap-16">
        <FooterColumn title="Navegacion">
          {NAV_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>
        <FooterColumn title="Contacto">
          <FooterLink
            href={buildWhatsAppUrl(SITE_CONFIG.whatsappNumber)}
            external
          >
            WhatsApp
          </FooterLink>
          <FooterLink href={SITE_CONFIG.instagramUrl} external>
            Instagram
          </FooterLink>
        </FooterColumn>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
        {title}
      </span>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-sm text-bg/60 transition-colors hover:text-bg"
    >
      {children}
    </Link>
  );
}
