/**
 * Crea o actualiza el usuario admin en Supabase Auth.
 *
 * Uso:
 *   pnpm create-admin <email> <password>
 *
 * Es idempotente: si el usuario ya existe, le actualiza el password.
 * Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local
 */
import { createClient } from "@supabase/supabase-js";

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Uso: pnpm create-admin <email> <password>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Faltan envs. Necesito NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local",
  );
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data: list, error: listErr } = await sb.auth.admin.listUsers();
  if (listErr) throw listErr;

  const existing = list.users.find((u) => u.email === email);

  if (existing) {
    const { data, error } = await sb.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) throw error;
    console.log(`✓ Usuario actualizado: ${data.user.email} (id: ${data.user.id})`);
    return;
  }

  const { data, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`✓ Usuario creado: ${data.user.email} (id: ${data.user.id})`);
}

main().catch((err) => {
  console.error("Error:", err?.message ?? err);
  process.exit(1);
});
