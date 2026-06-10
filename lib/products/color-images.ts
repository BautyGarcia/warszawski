import type { ProductColor, ProductImage } from "@/types/product";

/** True when an image has no color or points to a color that no longer exists. */
export function isGeneralImage(
  image: ProductImage,
  validColorIds: Set<string>,
): boolean {
  return image.colorId == null || !validColorIds.has(image.colorId);
}

/**
 * Images shown for the selected color:
 *  - the color's own images, if any;
 *  - else the "general" set (no color + orphans);
 *  - else everything (never leave the gallery empty).
 */
export function visibleImagesForColor(
  images: ProductImage[],
  colors: ProductColor[],
  selectedColorId: string | null,
): ProductImage[] {
  const validIds = new Set(colors.map((c) => c.id).filter(Boolean));

  if (selectedColorId != null) {
    const forColor = images.filter((img) => img.colorId === selectedColorId);
    if (forColor.length > 0) return forColor;
  }

  const general = images.filter((img) => isGeneralImage(img, validIds));
  if (general.length > 0) return general;

  return images;
}
