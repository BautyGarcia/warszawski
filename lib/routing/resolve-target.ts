const ADMIN_HOSTS = new Set(["admin.warszawski.com", "admin.localhost"]);

export type RouteResolution = { rewrite: string | null };

export function resolveTarget(host: string, pathname: string): RouteResolution {
  const hostname = host.split(":")[0];
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
