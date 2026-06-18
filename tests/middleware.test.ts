import { describe, it, expect } from "vitest";
import { resolveTarget } from "@/lib/routing/resolve-target";

describe("resolveTarget", () => {
  it("public host serving / stays at /", () => {
    expect(resolveTarget("warszawski.com", "/")).toEqual({ rewrite: null });
  });

  it("admin host serving / rewrites to /admin", () => {
    expect(resolveTarget("admin.warszawski.com", "/")).toEqual({ rewrite: "/admin" });
  });

  it("admin host with subpath rewrites under /admin", () => {
    expect(resolveTarget("admin.warszawski.com", "/productos")).toEqual({
      rewrite: "/admin/productos",
    });
  });

  it("admin host already on /admin path passes through", () => {
    expect(resolveTarget("admin.warszawski.com", "/admin/productos")).toEqual({
      rewrite: null,
    });
  });

  it("admin host on bare /admin passes through", () => {
    expect(resolveTarget("admin.warszawski.com", "/admin")).toEqual({ rewrite: null });
  });

  it("public host accessing /admin returns 404 redirect", () => {
    expect(resolveTarget("warszawski.com", "/admin")).toEqual({ rewrite: "/not-found" });
  });

  it("public host accessing /admin/productos returns 404 redirect", () => {
    expect(resolveTarget("warszawski.com", "/admin/productos")).toEqual({
      rewrite: "/not-found",
    });
  });

  it("strips port from host (admin)", () => {
    expect(resolveTarget("admin.localhost:3000", "/")).toEqual({ rewrite: "/admin" });
  });

  it("strips port from host (public)", () => {
    expect(resolveTarget("localhost:3000", "/nosotros")).toEqual({ rewrite: null });
  });

  it("admin nested path", () => {
    expect(resolveTarget("admin.localhost:3000", "/productos/abc-123")).toEqual({
      rewrite: "/admin/productos/abc-123",
    });
  });

  it("vercel.app host serves both public and admin from same domain", () => {
    expect(resolveTarget("warszawski.vercel.app", "/")).toEqual({ rewrite: null });
    expect(resolveTarget("warszawski.vercel.app", "/admin")).toEqual({ rewrite: null });
    expect(resolveTarget("warszawski.vercel.app", "/admin/productos")).toEqual({
      rewrite: null,
    });
  });

  it("vercel preview deployments also serve in single-domain mode", () => {
    expect(
      resolveTarget("warszawski-git-feature-bauty.vercel.app", "/admin"),
    ).toEqual({ rewrite: null });
  });

  // Agnostico al dominio: el dominio real es warszawski.com.ar
  it("new .com.ar admin host serving / rewrites to /admin", () => {
    expect(resolveTarget("admin.warszawski.com.ar", "/")).toEqual({
      rewrite: "/admin",
    });
  });

  it("new .com.ar admin host with subpath rewrites under /admin", () => {
    expect(resolveTarget("admin.warszawski.com.ar", "/productos")).toEqual({
      rewrite: "/admin/productos",
    });
  });

  it("new .com.ar public host serving / stays at /", () => {
    expect(resolveTarget("warszawski.com.ar", "/")).toEqual({ rewrite: null });
  });

  it("new .com.ar public host accessing /admin returns 404 redirect", () => {
    expect(resolveTarget("warszawski.com.ar", "/admin")).toEqual({
      rewrite: "/not-found",
    });
  });
});
