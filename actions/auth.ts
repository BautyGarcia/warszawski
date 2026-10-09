"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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

  try {
    // nextCookies() in lib/auth.ts sets the session cookie from inside this server action.
    await auth.api.signInEmail({ body: { email, password }, headers: await headers() });
  } catch (err) {
    if (err instanceof APIError) {
      return { error: "Credenciales inválidas" };
    }
    throw err;
  }

  redirect("/admin/productos");
}

export async function logoutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}
