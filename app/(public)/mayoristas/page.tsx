import { WholesaleHero } from "@/components/public/wholesale/WholesaleHero";
import { ProofStrip } from "@/components/public/wholesale/ProofStrip";
import { WholesaleCategories } from "@/components/public/wholesale/WholesaleCategories";
import { HowToBuy } from "@/components/public/wholesale/HowToBuy";
import { ShowroomSection } from "@/components/public/wholesale/ShowroomSection";
import { FinalCTA } from "@/components/public/home/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { getContentMap } from "@/lib/content/fetch";
import { getContactInfo } from "@/lib/content/contact";
import {
  buildWholesaleMetadata,
  localBusinessJsonLd,
  organizationJsonLd,
} from "@/lib/seo";

export async function generateMetadata() {
  const content = await getContentMap("wholesale");
  return buildWholesaleMetadata(content);
}

/**
 * Landing de venta mayorista: destino de los anuncios de Google Ads.
 * Cada seccion repite una promesa del anuncio (por mayor, desde 1959,
 * envios, descuentos por volumen, showroom en Once).
 */
export default async function WholesalePage() {
  const [content, contact] = await Promise.all([
    getContentMap("wholesale"),
    getContactInfo(),
  ]);

  return (
    <main className="flex flex-col">
      <JsonLd
        data={[organizationJsonLd(contact), localBusinessJsonLd(contact)].filter(
          (d): d is NonNullable<typeof d> => d !== null,
        )}
      />
      <WholesaleHero content={content} />
      <ProofStrip content={content} />
      <WholesaleCategories content={content} />
      <HowToBuy content={content} />
      <ShowroomSection content={content} />
      <FinalCTA
        content={content}
        contentKey="wholesale"
        ctaLabel={content["wholesale.hero.cta"]}
        source="mayoristas_cta_final"
        message="Hola, quiero pedir la lista de precios mayorista"
      />
    </main>
  );
}
