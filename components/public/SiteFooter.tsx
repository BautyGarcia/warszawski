import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { ContactInfo } from "@/lib/content/contact";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Coleccion", href: "/#coleccion" },
  { label: "Nosotros", href: "/nosotros" },
];

/** "5491143215678" → "+54 9 11 4321-5678" */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8) return raw;
  // Heuristica simple para AR: code pais + 9 + area + numero
  if (digits.startsWith("549") && digits.length === 13) {
    const area = digits.slice(3, 5);
    const rest = digits.slice(5);
    return `+54 9 ${area} ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  if (digits.startsWith("54") && digits.length === 12) {
    const area = digits.slice(2, 4);
    const rest = digits.slice(4);
    return `+54 ${area} ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  return `+${digits}`;
}

export function SiteFooter({ contact }: { contact: ContactInfo }) {
  const phones = contact.whatsappNumbers;
  const addresses = contact.addresses;
  const hasSocial =
    contact.instagramUrl || contact.facebookUrl || contact.tiktokUrl;
  const showContactCol = phones.length > 0 || hasSocial;

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

        {showContactCol ? (
          <FooterColumn title="Contacto">
            {phones.map((n, i) => (
              <FooterLink key={`phone-${i}`} href={buildWhatsAppUrl(n)} external>
                {phones.length > 1 ? formatPhone(n) : "WhatsApp"}
              </FooterLink>
            ))}
            {contact.instagramUrl ? (
              <FooterLink href={contact.instagramUrl} external>
                Instagram
              </FooterLink>
            ) : null}
            {contact.facebookUrl ? (
              <FooterLink href={contact.facebookUrl} external>
                Facebook
              </FooterLink>
            ) : null}
            {contact.tiktokUrl ? (
              <FooterLink href={contact.tiktokUrl} external>
                TikTok
              </FooterLink>
            ) : null}
          </FooterColumn>
        ) : null}

        {addresses.length > 0 ? (
          <FooterColumn title={addresses.length > 1 ? "Oficinas" : "Oficina"}>
            {addresses.map((a, i) => (
              <span
                key={`addr-${i}`}
                className="max-w-[220px] whitespace-pre-line text-sm text-bg/60"
              >
                {a}
              </span>
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
