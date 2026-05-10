import { ValueCard } from "./ValueCard";
import type { ContentMap } from "@/types/content";

export function ValuesSection({ content }: { content: ContentMap }) {
  const values = [
    { title: content["about.value1.title"], description: content["about.value1.description"] },
    { title: content["about.value2.title"], description: content["about.value2.description"] },
    { title: content["about.value3.title"], description: content["about.value3.description"] },
  ];

  return (
    <section className="flex w-full flex-col gap-0 bg-ink px-6 py-16 md:flex-row md:gap-12 md:px-12 md:py-25 lg:px-20">
      {values.map((v, i) => (
        <ValueCard
          key={i}
          index={i + 1}
          title={v.title}
          description={v.description}
          withBorders={i === 1}
        />
      ))}
    </section>
  );
}
