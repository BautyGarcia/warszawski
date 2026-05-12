import { Reveal } from "@/components/public/Reveal";
import { EditorialCard } from "@/components/public/editorial/EditorialCard";
import { listPublishedPosts } from "@/lib/editorial/queries";
import { SITE_URL } from "@/lib/seo";

export const metadata = {
  title: "Editorial",
  description:
    "Notas sobre diseño, materiales, calce y cultura óptica. Editorial Warszawski.",
  alternates: { canonical: `${SITE_URL}/editorial` },
  openGraph: {
    url: `${SITE_URL}/editorial`,
    title: "Editorial — Warszawski",
    description:
      "Notas sobre diseño, materiales, calce y cultura óptica. Editorial Warszawski.",
    type: "website",
  },
};

export default async function EditorialIndexPage() {
  const posts = await listPublishedPosts();

  return (
    <main className="flex flex-col">
      <section className="flex w-full flex-col items-start bg-bg px-6 pb-12 pt-16 md:px-12 md:pb-16 md:pt-32 lg:px-20">
        <Reveal immediate delay={0}>
          <span className="inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:text-[11px]">
            Editorial
          </span>
        </Reveal>
        <Reveal immediate delay={140} className="mt-6 md:mt-8">
          <h1 className="max-w-[900px] font-display text-[clamp(2.5rem,8vw,5rem)] font-black leading-[1.05] tracking-[-0.02em] text-ink">
            Notas sobre diseño, materiales y mirada
          </h1>
        </Reveal>
        <Reveal immediate delay={280} className="mt-6 md:mt-8">
          <p className="max-w-[640px] text-sm font-light leading-7 text-ink-soft md:text-base md:leading-8">
            Reflexiones y guías que escribimos a medida que vamos diseñando.
            Sin apuro, sin algoritmo. Lectura sostenida.
          </p>
        </Reveal>
      </section>

      {posts.length === 0 ? (
        <section className="flex w-full flex-col items-center px-6 pb-20 text-center md:px-12 md:pb-25 lg:px-20">
          <Reveal>
            <p className="max-w-[480px] text-sm font-light leading-7 text-ink-soft md:text-base">
              Las primeras notas están en preparación. Volvé pronto.
            </p>
          </Reveal>
        </section>
      ) : (
        <section className="flex w-full flex-col pb-20 md:pb-25">
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-14 px-6 md:grid-cols-2 md:gap-y-16 md:px-12 lg:px-20">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 4) * 80}>
                <EditorialCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
