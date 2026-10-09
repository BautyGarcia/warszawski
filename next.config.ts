import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Servimos las imágenes directo del bucket público (dbm / Garage), sin pasar por el
    // optimizador de Vercel (que se agota por cuota y devuelve 402
    // OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED, rompiendo TODAS las imágenes
    // para visitantes nuevos). Las imágenes ya son de tamaño razonable.
    unoptimized: true,
    remotePatterns: [
      // Bucket público de dbm (S3_PUBLIC_BASE_URL). Las imágenes viven bajo product-images/.
      { protocol: "https", hostname: "*.web.bautygarcia.com" },
      // Legado: filas que todavía apuntan a Supabase hasta correr `pnpm storage:rewrite-urls`.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
