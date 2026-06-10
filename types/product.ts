export type ProductColor = { id: string; name: string; hex: string };
export type ProductImage = { url: string; alt: string; colorId?: string | null };

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  is_exclusive: boolean;
  materials: string | null;
  lens_type: "recetado" | "sol" | "multifocal" | null;
  available_colors: ProductColor[];
  category: "recetados" | "sol" | null;
  images: ProductImage[];
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
};
