/**
 * Reescribe en la base las URLs que todavía apuntan a Supabase Storage para que usen el bucket
 * público de dbm (S3_PUBLIC_BASE_URL). Idempotente. Correrlo de nuevo después del cutover: el
 * cutover vuelve a copiar los datos desde Supabase.
 *
 * Uso: pnpm storage:rewrite-urls
 */
import { eq, like, sql } from "drizzle-orm";
import { client, db } from "../lib/db";
import { editorial_posts, products, site_content } from "../lib/schema";
import { rewriteLegacyStorageUrl } from "../lib/storage/legacy-url";

if (!process.env.S3_PUBLIC_BASE_URL) {
  console.error("S3_PUBLIC_BASE_URL no está seteada (dbm storage public <slug>)");
  process.exit(1);
}

async function main() {
  let changed = 0;

  const prods = await db.select({ id: products.id, images: products.images }).from(products);
  for (const p of prods) {
    const images = p.images.map((img) => ({ ...img, url: rewriteLegacyStorageUrl(img.url) }));
    if (JSON.stringify(images) === JSON.stringify(p.images)) continue;
    await db.update(products).set({ images }).where(eq(products.id, p.id));
    changed++;
  }

  const posts = await db
    .select({ id: editorial_posts.id, cover_image: editorial_posts.cover_image })
    .from(editorial_posts)
    .where(like(editorial_posts.cover_image, "https://%.supabase.co/%"));
  for (const post of posts) {
    await db
      .update(editorial_posts)
      .set({ cover_image: rewriteLegacyStorageUrl(post.cover_image) })
      .where(eq(editorial_posts.id, post.id));
    changed++;
  }

  const content = await db
    .select({ id: site_content.id, value: site_content.value })
    .from(site_content)
    .where(like(site_content.value, "https://%.supabase.co/%"));
  for (const row of content) {
    await db
      .update(site_content)
      .set({ value: rewriteLegacyStorageUrl(row.value), updated_at: sql`now()` })
      .where(eq(site_content.id, row.id));
    changed++;
  }

  console.log(`OK: ${changed} filas actualizadas`);
}

main()
  .catch((err) => {
    console.error("Error:", err?.message ?? err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
