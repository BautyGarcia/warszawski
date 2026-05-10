import { NextRequest, NextResponse } from "next/server";
import { resolveTarget } from "@/lib/routing/resolve-target";
import { updateSession } from "@/lib/supabase/middleware";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(req: NextRequest) {
  const sessionRes = supabaseConfigured
    ? await updateSession(req)
    : NextResponse.next({ request: req });

  const host = req.headers.get("host") ?? "";
  const { rewrite } = resolveTarget(host, req.nextUrl.pathname);

  if (!rewrite) return sessionRes;

  const url = req.nextUrl.clone();
  url.pathname = rewrite;
  const rewritten = NextResponse.rewrite(url, { request: req });
  sessionRes.cookies.getAll().forEach((c) => rewritten.cookies.set(c.name, c.value));
  return rewritten;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)).*)",
  ],
};
