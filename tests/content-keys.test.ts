import { describe, it, expect } from "vitest";
import { SITE_CONTENT_FIELDS } from "@/lib/content/keys";

describe("SITE_CONTENT_FIELDS", () => {
  it("has unique keys", () => {
    const keys = SITE_CONTENT_FIELDS.map((f) => f.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("covers home, about, wholesale and contact", () => {
    const pages = new Set(SITE_CONTENT_FIELDS.map((f) => f.page));
    expect(pages).toEqual(new Set(["home", "about", "wholesale", "contact"]));
  });

  it("wholesale page has hero, proof, categories, steps, showroom and cta", () => {
    const sections = new Set(
      SITE_CONTENT_FIELDS.filter((f) => f.page === "wholesale").map((f) => f.section),
    );
    expect(sections).toEqual(
      new Set(["hero", "proof", "categories", "steps", "showroom", "cta"]),
    );
  });

  it("every field has a non-empty label", () => {
    SITE_CONTENT_FIELDS.forEach((f) =>
      expect(f.label.length, `key ${f.key}`).toBeGreaterThan(0),
    );
  });

  it("editorial copy fields (home/about/wholesale) have non-empty defaults", () => {
    // Contact tiene defaults vacios (empty handlers). Image tampoco
    // requiere default (placeholder visual cuando no hay imagen).
    // Campos marcados `optional` pueden quedar vacios (se ocultan en la web).
    SITE_CONTENT_FIELDS.filter(
      (f) =>
        f.page !== "contact" &&
        !f.optional &&
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
