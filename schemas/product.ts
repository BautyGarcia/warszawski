import { z } from "zod";

export const productColorSchema = z.object({
  name: z.string().min(1).max(40),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color inválido"),
});

export const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(""),
});

export const productSchema = z.object({
  name: z.string().min(1, "Requerido").max(120),
  slug: z
    .string()
    .min(1, "Requerido")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  short_description: z.string().max(200).default(""),
  description: z.string().default(""),
  materials: z.string().default(""),
  lens_type: z.enum(["recetado", "sol", "multifocal"]).nullable(),
  category: z.enum(["recetados", "sol"]).nullable(),
  available_colors: z.array(productColorSchema).default([]),
  images: z.array(productImageSchema).default([]),
  is_exclusive: z.boolean().default(false),
  seo_title: z.string().max(70).default(""),
  seo_description: z.string().max(160).default(""),
});

export type ProductFormValues = z.input<typeof productSchema>;
export type ProductInput = z.output<typeof productSchema>;
