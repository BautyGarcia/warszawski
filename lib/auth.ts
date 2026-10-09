import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { compare as bcryptCompare } from "bcryptjs";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as authSchema from "./auth-schema"; // generated: npx auth generate --config lib/auth.ts --output lib/auth-schema.ts -y
import { db } from "./db";

const vercelHosts = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL].filter((h): h is string => Boolean(h));

// The admin panel is served from admin.<domain> (lib/routing/resolve-target.ts) while BETTER_AUTH_URL is the
// public site, so the admin origin must be trusted for /api/auth/* requests. Server actions (actions/auth.ts)
// call auth.api directly and skip the origin check anyway.
const adminOrigins = [
  process.env.BETTER_AUTH_URL ? process.env.BETTER_AUTH_URL.replace(/^(https?:\/\/)/, "$1admin.") : null,
  "http://admin.localhost:3000",
].filter((o): o is string => Boolean(o));

// Migrated Supabase accounts keep their bcrypt hash until the first successful login, then rehash to scrypt.
// Remove this once `select count(*) from account where password like '$2%'` returns 0 (docs/migration-from-supabase.md).
const isBcrypt = (h: string) => /^\$2[aby]\$/.test(h);

export const auth = betterAuth({
  // Explicit baseURL prevents request-derived baseURL poisoning. Production: BETTER_AUTH_URL=https://app.example.com.
  // Previews: exact Vercel hosts only; never "*.vercel.app".
  baseURL: process.env.BETTER_AUTH_URL
    ? process.env.BETTER_AUTH_URL
    : vercelHosts.length
      ? { allowedHosts: vercelHosts, protocol: "https" }
      : "http://localhost:3000", // local development; dbm env leaves BETTER_AUTH_URL empty
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: adminOrigins,
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    requireEmailVerification: false, // enable once sendVerificationEmail is wired
    revokeSessionsOnPasswordReset: true,
    password: {
      hash: hashPassword, // new passwords stay on scrypt
      verify: async ({ hash, password }) =>
        isBcrypt(hash) ? bcryptCompare(password, hash) : verifyPassword({ hash, password }),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  rateLimit: {
    enabled: true,
    storage: "database", // memory storage is per-instance on Vercel
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 10, max: 3 },
      "/sign-up/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 60, max: 3 },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production", // local dev runs on http://localhost (Safari drops Secure cookies there)
    database: { generateId: "uuid" }, // matches Supabase uuid ids for migrated users
    ipAddress: { ipAddressHeaders: ["x-forwarded-for"] },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/email") return;
      const session = ctx.context.newSession;
      const password = (ctx.body as { password?: string } | undefined)?.password;
      if (!session || !password) return;
      const accounts = await ctx.context.internalAdapter.findAccounts(session.user.id);
      const cred = accounts.find((a) => a.providerId === "credential");
      if (cred?.password && isBcrypt(cred.password)) {
        await ctx.context.internalAdapter.updatePassword(session.user.id, await ctx.context.password.hash(password));
      }
    }),
  },
  plugins: [nextCookies()], // must be last
});
