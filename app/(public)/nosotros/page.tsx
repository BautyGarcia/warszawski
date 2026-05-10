import { AboutHero } from "@/components/public/about/AboutHero";
import { OriginStory } from "@/components/public/about/OriginStory";
import { ValuesSection } from "@/components/public/about/ValuesSection";
import { FinalCTA } from "@/components/public/home/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { getContentMap } from "@/lib/content/fetch";
import { buildAboutMetadata, organizationJsonLd } from "@/lib/seo";

export async function generateMetadata() {
  const content = await getContentMap("about");
  return buildAboutMetadata(content);
}

export default async function AboutPage() {
  const content = await getContentMap("about");
  return (
    <main className="flex flex-col">
      <JsonLd data={organizationJsonLd()} />
      <section className="flex min-h-screen w-full flex-col justify-center bg-bg">
        <AboutHero content={content} />
        <OriginStory content={content} />
      </section>
      <ValuesSection content={content} />
      <FinalCTA content={content} contentKey="about" />
    </main>
  );
}
