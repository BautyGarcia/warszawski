function isSingleDomainHost(hostname: string): boolean {
  return hostname.endsWith(".vercel.app");
}

// Cualquier host que empiece con "admin." es el panel: admin.warszawski.com.ar,
// admin.localhost, etc. Agnostico al dominio/TLD, asi no hay que tocar esto si
// cambia el dominio. (Las previews de Vercel se resuelven antes en modo
// single-domain, asi que un "admin.*.vercel.app" no entra por aca.)
function isAdminHost(hostname: string): boolean {
  return hostname.startsWith("admin.");
}

export type RouteResolution = { rewrite: string | null };

export function resolveTarget(host: string, pathname: string): RouteResolution {
  const hostname = host.split(":")[0];

  // En el deploy provisional de Vercel (warszawski.vercel.app y previews) no
  // hay subdominios separados — admin se accede desde el mismo host vía /admin.
  if (isSingleDomainHost(hostname)) {
    return { rewrite: null };
  }

  if (!isAdminHost(hostname)) {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return { rewrite: "/not-found" };
    }
    return { rewrite: null };
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return { rewrite: null };
  }
  if (pathname === "/") return { rewrite: "/admin" };
  return { rewrite: `/admin${pathname}` };
}
