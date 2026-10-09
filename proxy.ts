import { NextRequest, NextResponse } from "next/server";
import { resolveTarget } from "@/lib/routing/resolve-target";

// Host-based rewrites only (admin.<domain> -> /admin/*). Auth lives in better-auth cookies and is
// checked by `requireAdmin()` in the admin layout and actions, so no session refresh happens here.
export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { rewrite } = resolveTarget(host, req.nextUrl.pathname);

  if (!rewrite) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = rewrite;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)).*)",
  ],
};
