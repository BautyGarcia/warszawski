import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/products/slug";

describe("slugify", () => {
  it("lowercases simple input", () => {
    expect(slugify("Aurora")).toBe("aurora");
  });
  it("replaces spaces with dashes", () => {
    expect(slugify("Eclipse Sol")).toBe("eclipse-sol");
  });
  it("strips diacritics including ñ", () => {
    expect(slugify("Niña ñ")).toBe("nina-n");
  });
  it("collapses repeated separators and trims", () => {
    expect(slugify("  Hola--Mundo  ")).toBe("hola-mundo");
  });
  it("returns empty for empty input", () => {
    expect(slugify("")).toBe("");
  });
  it("strips punctuation", () => {
    expect(slugify("Modelo #42!")).toBe("modelo-42");
  });
});
