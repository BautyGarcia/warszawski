import { describe, it, expect } from "vitest";
import { SITE_CONTENT_FIELDS } from "@/lib/content/keys";

describe("SITE_CONTENT_FIELDS", () => {
  it("has unique keys", () => {
    const keys = SITE_CONTENT_FIELDS.map((f) => f.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("covers home, about and contact", () => {
    const pages = new Set(SITE_CONTENT_FIELDS.map((f) => f.page));
    expect(pages).toEqual(new Set(["home", "about", "contact"]));
  });

  it("every field has a non-empty label", () => {
    SITE_CONTENT_FIELDS.forEach((f) =>
      expect(f.label.length, `key ${f.key}`).toBeGreaterThan(0),
    );
  });

  it("editorial copy fields (home/about) have non-empty defaults", () => {
    // Contact tiene defaults vacios (empty handlers). Image tampoco
    // requiere default (placeholder visual cuando no hay imagen).
    SITE_CONTENT_FIELDS.filter(
      (f) =>
        f.page !== "contact" &&
        (f.fieldType === "short_text" || f.fieldType === "long_text"),
    ).forEach((f) =>
      expect(f.defaultValue.length, `key ${f.key}`).toBeGreaterThan(0),
    );
  });

  it("keys follow page.section.field pattern", () => {
    SITE_CONTENT_FIELDS.forEach((f) => {
      expect(f.key, `key ${f.key}`).toMatch(/^[a-z]+\.[a-z]+[0-9]?\.[a-z0-9_]+$/);
    });
  });
});
