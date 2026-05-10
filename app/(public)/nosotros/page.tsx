import { AboutHero } from "@/components/public/about/AboutHero";
import { OriginStory } from "@/components/public/about/OriginStory";
import { ValuesSection } from "@/components/public/about/ValuesSection";
import { FinalCTA } from "@/components/public/home/FinalCTA";
import { getContentMap } from "@/lib/content/fetch";

export const metadata = {
  title: "Nosotros — Warszawski",
  description: "Diseno que habla por si mismo. Conoce Warszawski.",
};

export default async function AboutPage() {
  const content = await getContentMap("about");
  return (
    <main className="flex flex-col">
      <AboutHero content={content} />
      <OriginStory content={content} />
      <ValuesSection content={content} />
      <FinalCTA content={content} contentKey="about" />
    </main>
  );
}
