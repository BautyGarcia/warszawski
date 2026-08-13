import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Servimos las imágenes directo del CDN de Supabase, sin pasar por el
    // optimizador de Vercel (que se agota por cuota y devuelve 402
    // OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED, rompiendo TODAS las imágenes
    // para visitantes nuevos). Las imágenes ya son de tamaño razonable.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
