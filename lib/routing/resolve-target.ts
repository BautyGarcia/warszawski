const ADMIN_HOSTS = new Set(["admin.warszawski.com", "admin.localhost"]);

function isSingleDomainHost(hostname: string): boolean {
  return hostname.endsWith(".vercel.app");
}

export type RouteResolution = { rewrite: string | null };

export function resolveTarget(host: string, pathname: string): RouteResolution {
  const hostname = host.split(":")[0];

  // En el deploy provisional de Vercel (warszawski.vercel.app y previews) no
  // hay subdominios separados — admin se accede desde el mismo host vía /admin.
  if (isSingleDomainHost(hostname)) {
    return { rewrite: null };
  }

  const isAdminHost = ADMIN_HOSTS.has(hostname);

  if (!isAdminHost) {
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
