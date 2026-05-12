import { z } from "zod";

export const editorialSchema = z.object({
  title: z.string().min(1, "Requerido").max(160),
  slug: z
    .string()
    .min(1, "Requerido")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  excerpt: z.string().max(220).default(""),
  content: z.string().min(1, "El contenido no puede estar vacío"),
  cover_image: z.string().default(""),
  author_name: z.string().default("Warszawski"),
  published: z.boolean().default(false),
  seo_title: z.string().max(70).default(""),
  seo_description: z.string().max(160).default(""),
});

export type EditorialFormValues = z.input<typeof editorialSchema>;
export type EditorialInput = z.output<typeof editorialSchema>;
