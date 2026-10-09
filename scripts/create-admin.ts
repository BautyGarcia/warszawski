/**
 * Crea o actualiza el usuario admin (better-auth, tabla "user" + "account").
 *
 * Uso:
 *   pnpm create-admin <email> <password>
 *
 * Es idempotente: si el usuario ya existe, le actualiza el password.
 * Requiere DATABASE_URL y BETTER_AUTH_SECRET en .env.local (el script de package.json los carga).
 */
import { auth } from "../lib/auth";
import { client } from "../lib/db";

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Uso: pnpm create-admin <email> <password>");
  process.exit(1);
}

if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) {
  console.error("Faltan envs. Necesito DATABASE_URL y BETTER_AUTH_SECRET en .env.local");
  process.exit(1);
}

async function main() {
  const ctx = await auth.$context;
  const existing = await ctx.internalAdapter.findUserByEmail(email.toLowerCase());

  if (existing) {
    await ctx.internalAdapter.updatePassword(existing.user.id, await ctx.password.hash(password));
    console.log(`✓ Usuario actualizado: ${existing.user.email} (id: ${existing.user.id})`);
    return;
  }

  const { user } = await auth.api.signUpEmail({
    body: { email, password, name: email.split("@")[0] },
  });
  console.log(`✓ Usuario creado: ${user.email} (id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error("Error:", err?.message ?? err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
