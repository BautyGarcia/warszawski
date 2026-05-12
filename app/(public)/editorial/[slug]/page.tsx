import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/public/Reveal";
import { Breadcrumbs } from "@/components/public/product/Breadcrumbs";
import { EditorialContent } from "@/components/public/editorial/EditorialContent";
import { EditorialCard } from "@/components/public/editorial/EditorialCard";
import { JsonLd } from "@/components/JsonLd";
import {
  getPublishedPostBySlug,
  listPublishedPosts,
} from "@/lib/editorial/queries";
import {
  SITE_URL,
  articleJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

const DATE_FMT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
  year: "numeric",
};

export async function generateStaticParams() {
  const posts = await listPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "No encontrado" };

  const url = `${SITE_URL}/editorial/${post.slug}`;
  const description = post.seo_description || post.excerpt || post.title;
  return {
    title: post.seo_title || post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${post.title} — Editorial Warszawski`,
      description,
      type: "article",
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function EditorialPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await listPublishedPosts();
  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  const url = `${SITE_URL}/editorial/${post.slug}`;
  const date = post.published_at ?? post.created_at;

  return (
    <main className="flex flex-col">
      <JsonLd
        data={[
          articleJsonLd({
            url,
            title: post.title,
            description: post.seo_description || post.excerpt || post.title,
            image: post.cover_image ?? undefined,
            authorName: post.author_name,
            datePublished: post.published_at ?? post.created_at,
            dateModified: post.updated_at,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", url: SITE_URL },
            { name: "Editorial", url: `${SITE_URL}/editorial` },
            { name: post.title },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Editorial", href: "/editorial" },
          { label: post.title },
        ]}
      />

      <article className="flex w-full flex-col">
        <header className="flex w-full flex-col items-start bg-bg px-6 pb-12 pt-10 md:px-12 md:pb-16 md:pt-16 lg:px-20">
          <Reveal immediate delay={0}>
            <span className="inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:text-[11px]">
              {new Date(date).toLocaleDateString("es-AR", DATE_FMT)}
              <span className="mx-2 text-bg-warm">·</span>
              {post.author_name}
            </span>
          </Reveal>
          <Reveal immediate delay={140} className="mt-6 md:mt-8">
            <h1 className="max-w-[860px] font-display text-[clamp(2rem,6vw,3.75rem)] font-black leading-[1.1] tracking-[-0.02em] text-ink">
              {post.title}
            </h1>
          </Reveal>
          {post.excerpt ? (
            <Reveal immediate delay={280} className="mt-5 md:mt-6">
              <p className="max-w-[640px] text-base font-light leading-7 text-ink-soft md:text-lg md:leading-8">
                {post.excerpt}
              </p>
            </Reveal>
          ) : null}
        </header>

        {post.cover_image ? (
          <Reveal immediate delay={400}>
            <div className="relative mx-auto aspect-[16/9] w-full max-w-[1024px] overflow-hidden rounded-sm bg-bg-warm md:aspect-[2/1]">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        ) : null}

        <div className="mx-auto w-full max-w-[720px] px-6 py-16 md:py-20 lg:px-0">
          <EditorialContent content={post.content} />
        </div>
      </article>

      {related.length > 0 ? (
        <section className="flex w-full flex-col">
          <div className="flex w-full flex-col items-center bg-bg px-6 pb-10 pt-16 md:px-12 md:pb-12 md:pt-25 lg:px-20">
            <div className="mb-16 h-px w-full bg-bg-warm md:mb-25" />
            <span className="mb-4 inline-block text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dark md:mb-6 md:text-[11px]">
              Seguí leyendo
            </span>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-ink md:text-[40px] md:leading-12">
              Más notas
            </h2>
          </div>

          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 px-6 pb-20 md:grid-cols-2 md:gap-y-12 md:px-12 md:pb-25 lg:px-20">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <EditorialCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
