export type Category = "recetados" | "sol";

export const CATEGORIES: ReadonlyArray<Category> = ["recetados", "sol"];

export const CATEGORY_META: Record<
  Category,
  { label: string; title: string; description: string; metaTitle: string }
> = {
  recetados: {
    label: "Recetados",
    title: "Anteojos recetados",
    description:
      "Modelos de armazones recetados con diseño de autor. Acetato italiano, titanio japonés y materiales de primera línea para una visión clara con carácter propio.",
    metaTitle: "Anteojos recetados",
  },
  sol: {
    label: "Sol",
    title: "Anteojos de sol",
    description:
      "Anteojos de sol con personalidad. Geometría limpia, materiales nobles y protección total. Modelos de edición selecta para mayoristas y distribuidores.",
    metaTitle: "Anteojos de sol",
  },
};

export function isCategory(value: string): value is Category {
  return (CATEGORIES as ReadonlyArray<string>).includes(value);
}

/**
 * Resolve a category's display meta, preferring values edited from the
 * backoffice (site_content, keys `categories.<cat>.title|description`) and
 * falling back to the hardcoded CATEGORY_META defaults. `label` stays static
 * (used by nav/breadcrumbs); `metaTitle` follows the edited title for SEO.
 * Takes a ContentMap so it stays free of data-layer imports (no import cycle).
 */
export function getCategoryMeta(
  category: Category,
  content: Record<string, string>,
) {
  const base = CATEGORY_META[category];
  const title = content[`categories.${category}.title`]?.trim() || base.title;
  const description =
    content[`categories.${category}.description`]?.trim() || base.description;
  return { label: base.label, title, description, metaTitle: title };
}
