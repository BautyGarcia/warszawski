import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Todos (incluye Googlebot, Bingbot y los bots de AI search:
        // OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, etc.).
        // Los dejamos entrar para ser indexados/citados; solo bloqueamos el
        // panel y la API.
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        // Scraper de ByteDance/TikTok: ignora robots.txt y no aporta visibilidad.
        // (Si hace falta frenarlo de verdad, hay que hacerlo a nivel WAF/Vercel.)
        userAgent: "Bytespider",
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
