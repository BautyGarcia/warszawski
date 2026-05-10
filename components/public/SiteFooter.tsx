import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { ContactInfo } from "@/lib/content/contact";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Coleccion", href: "/#coleccion" },
  { label: "Nosotros", href: "/nosotros" },
];

export function SiteFooter({ contact }: { contact: ContactInfo }) {
  const socials = [
    contact.whatsappNumber
      ? {
          label: "WhatsApp",
          href: buildWhatsAppUrl(contact.whatsappNumber),
        }
      : null,
    contact.instagramUrl ? { label: "Instagram", href: contact.instagramUrl } : null,
    contact.facebookUrl ? { label: "Facebook", href: contact.facebookUrl } : null,
    contact.tiktokUrl ? { label: "TikTok", href: contact.tiktokUrl } : null,
  ].filter((x): x is { label: string; href: string } => x !== null);

  return (
    <footer className="flex w-full flex-col gap-12 border-t border-bg/10 bg-ink px-6 py-12 md:flex-row md:items-start md:justify-between md:px-12 md:py-16 lg:px-20">
      <div className="flex flex-col gap-4">
        <span className="font-display text-lg font-bold tracking-[0.12em] text-bg">
          {SITE_CONFIG.brand.name}
        </span>
        <p className="whitespace-pre-line text-[13px] font-light leading-[22px] text-bg/70">
          {SITE_CONFIG.brand.tagline}
        </p>
      </div>

      <div className="flex flex-wrap gap-10 md:gap-16">
        <FooterColumn title="Navegacion">
          {NAV_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        {socials.length > 0 ? (
          <FooterColumn title="Contacto">
            {socials.map((s) => (
              <FooterLink key={s.label} href={s.href} external>
                {s.label}
              </FooterLink>
            ))}
          </FooterColumn>
        ) : null}
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
