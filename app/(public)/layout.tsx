import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { getContactInfo } from "@/lib/content/contact";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await getContactInfo();
  return (
    <>
      <SiteHeader whatsappNumber={contact.whatsappNumber} />
      {children}
      <SiteFooter contact={contact} />
    </>
  );
}
