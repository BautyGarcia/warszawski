import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/products/queries";
import { CATEGORIES } from "@/lib/category";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1, changeFrequency: "weekly" },
    {
      url: `${SITE_URL}/nosotros`,
      priority: 0.7,
      changeFrequency: "monthly",
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/coleccion/${c}`,
    priority: 0.9,
    changeFrequency: "weekly",
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/productos/${p.slug}`,
    priority: 0.8,
    changeFrequency: "weekly",
    lastModified: new Date(p.created_at),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
