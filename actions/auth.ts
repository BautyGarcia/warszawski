"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";

export type LoginState = { error: string | null };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá email y contraseña" };
  }

  const sb = await getSupabaseServer();
  const { error } = await sb.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Credenciales inválidas" };
  }

  redirect("/admin/productos");
}

export async function logoutAction() {
  const sb = await getSupabaseServer();
  await sb.auth.signOut();
  redirect("/admin/login");
}
