import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function requireAdmin() {
  const sb = await getSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}
