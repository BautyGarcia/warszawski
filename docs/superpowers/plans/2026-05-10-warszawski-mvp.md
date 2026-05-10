# Warszawski — Plan de Implementación (MVP)

> **For agentic workers:** Use superpowers:subagent-driven-development o superpowers:executing-plans para implementar tarea por tarea.

**Goal:** Construir el sitio público + backoffice de Warszawski en un único proyecto Next.js, con routing dual-domain por middleware, integrado a Supabase, replicando 1:1 los diseños de Paper.

**Arquitectura:** App Router de Next.js, un solo deploy en Vercel. `middleware.ts` lee el `host` y reescribe `admin.warszawski.com` → `/admin/*` internamente; resto del tráfico va a las rutas públicas. Supabase aporta DB (productos + contenido del sitio) + Storage (imágenes) + auth admin por password única en cookie HTTP-only firmada. shadcn/ui se usa como primitiva accesible y se re-estiliza con tokens de la marca (negro tinta, warm white, dorado mutado, Playfair + Inter) hasta que coincida pixel a pixel con Paper.

**Stack:** Next.js 15 (App Router, RSC), TypeScript estricto, pnpm, Tailwind v4, shadcn/ui, Supabase (postgres + storage), Zod, react-hook-form, jose (JWT), next/font (Playfair Display + Inter).

**Filosofía de archivos:** Un componente por archivo. Componentes de página se ensamblan desde piezas pequeñas (`Hero.tsx`, `ExclusiveBlock.tsx`, `CollectionGrid.tsx`, `BrandStatement.tsx`, `FinalCTA.tsx`, `Footer.tsx`, etc). Lógica compartida en `lib/`. Server Actions agrupadas por dominio en `actions/`. Schemas en `schemas/`. Tipos en `types/`.

**Verificación visual:** Cada bloque de UI se compara con su screenshot de Paper antes de cerrar la tarea. TDD se aplica a lo no-visual (middleware, auth, queries, content fetch, server actions).

---

## Estructura de archivos

```
warszawski/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx               # Header + Footer + fonts
│   │   ├── page.tsx                 # Home (/)
│   │   ├── nosotros/page.tsx        # About
│   │   └── productos/[slug]/page.tsx # Product detail
│   ├── admin/
│   │   ├── layout.tsx               # AdminTopBar + auth gate
│   │   ├── login/page.tsx
│   │   ├── page.tsx                 # redirect to /admin/productos
│   │   ├── productos/
│   │   │   ├── page.tsx             # List
│   │   │   ├── nuevo/page.tsx       # Create form
│   │   │   └── [id]/page.tsx        # Edit form
│   │   └── contenido/page.tsx       # Content editor (tabs)
│   ├── api/
│   │   └── admin/upload/route.ts    # Storage signed upload
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── ui/                          # shadcn primitives (re-estilizadas)
│   ├── public/
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   ├── WhatsAppButton.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── ExclusiveSection.tsx
│   │   │   ├── ExclusiveBlock.tsx
│   │   │   ├── CollectionSection.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── BrandStatement.tsx
│   │   │   └── FinalCTA.tsx
│   │   ├── about/
│   │   │   ├── AboutHero.tsx
│   │   │   ├── OriginStory.tsx
│   │   │   ├── ValuesSection.tsx
│   │   │   └── ValueCard.tsx
│   │   └── product/
│   │       ├── ProductGallery.tsx
│   │       ├── ProductInfo.tsx
│   │       ├── ColorPicker.tsx
│   │       ├── Breadcrumbs.tsx
│   │       └── RelatedProducts.tsx
│   └── admin/
│       ├── AdminTopBar.tsx
│       ├── LoginForm.tsx
│       ├── products/
│       │   ├── ProductTable.tsx
│       │   ├── ProductTableRow.tsx
│       │   ├── ReorderButtons.tsx
│       │   ├── ProductForm.tsx
│       │   ├── ProductFormBasic.tsx
│       │   ├── ProductFormDetails.tsx
│       │   ├── ProductFormImages.tsx
│       │   ├── ProductFormVisibility.tsx
│       │   ├── ProductFormSeo.tsx
│       │   ├── ColorTagInput.tsx
│       │   └── ImageUploader.tsx
│       └── content/
│           ├── ContentTabs.tsx
│           ├── ContentSection.tsx
│           └── ContentField.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts                # createServerClient
│   │   ├── admin.ts                 # service-role client
│   │   └── browser.ts               # createBrowserClient
│   ├── auth/
│   │   ├── session.ts               # sign/verify JWT cookie
│   │   └── guard.ts                 # requireAdmin() helper
│   ├── content/
│   │   ├── keys.ts                  # const SITE_CONTENT_KEYS
│   │   └── fetch.ts                 # getContent(page) helper
│   ├── products/
│   │   ├── queries.ts               # listProducts, getBySlug, listExclusive
│   │   └── slug.ts                  # slugify helper
│   ├── whatsapp.ts                  # buildWhatsAppUrl
│   ├── seo.ts                       # buildMetadata + JSON-LD
│   └── utils.ts                     # cn()
├── actions/
│   ├── auth.ts                      # loginAction, logoutAction
│   ├── products.ts                  # create/update/delete/reorder
│   └── content.ts                   # updateContent
├── schemas/
│   ├── product.ts                   # Zod schemas
│   ├── content.ts
│   └── auth.ts
├── types/
│   ├── product.ts
│   └── content.ts
├── supabase/
│   └── migrations/
│       ├── 0001_products.sql
│       ├── 0002_site_content.sql
│       ├── 0003_storage.sql
│       └── 0004_seed_content_keys.sql
├── middleware.ts
├── tests/                           # Vitest (lógica no-UI)
│   ├── middleware.test.ts
│   ├── auth-session.test.ts
│   ├── content-fetch.test.ts
│   └── slug.test.ts
├── docs/
│   └── superpowers/plans/...
├── .env.local.example
├── components.json                  # shadcn config
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── MANIFEST.md
└── .gitignore
```

---

## Fases

1. **Bootstrap** — Repo, Next.js, Tailwind, shadcn, fonts, tokens, Supabase clients.
2. **Middleware dual-domain** — Routing por host con tests.
3. **Schema + seed** — Migrations Supabase, keys de contenido completas, datos seed.
4. **Public site** — Home, Nosotros, Producto. Verificación visual contra Paper.
5. **Admin auth** — Login, sesión por cookie, guard.
6. **Admin productos** — Lista, form (crear/editar), reorder, delete, upload imágenes.
7. **Admin contenido** — Editor con tabs por página.
8. **SEO** — Metadata, sitemap, robots, JSON-LD.
9. **Polish** — Responsive, accesibilidad, error boundaries.

Cada fase = uno o más Tasks. Cada Task termina en commit.

---

# Fase 1 — Bootstrap

### Task 1: Inicializar proyecto Next.js con pnpm

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, `.env.local.example`

- [ ] **Step 1: Inicializar Next.js 15 con TypeScript, Tailwind, App Router, sin src/, sin alias custom (usa `@/*`)**

```bash
cd /Users/bautygarcia/projects/warszawski
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-pnpm --no-eslint --turbopack
```

Cuando pregunte por overwrite del MANIFEST.md decir NO. El generador puede pedir confirmación porque el dir no está vacío — confirmar.

- [ ] **Step 2: Verificar dev server arranca**

```bash
pnpm dev
```
Esperado: server en http://localhost:3000 sirviendo página default.

- [ ] **Step 3: Eliminar boilerplate y dejar layout/page mínimos**

Reemplazar `app/page.tsx`:
```tsx
export default function Home() {
  return <main>Warszawski</main>;
}
```

Reemplazar `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Warszawski",
  description: "Anteojos de diseno. Hechos para vos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
```

Limpiar `app/globals.css` dejando solo `@import "tailwindcss";`.

- [ ] **Step 4: Crear `.env.local.example`**

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin auth
ADMIN_PASSWORD=
SESSION_SECRET=                # 32+ random bytes (openssl rand -hex 32)

# Hosts
NEXT_PUBLIC_PUBLIC_HOST=localhost:3000
NEXT_PUBLIC_ADMIN_HOST=admin.localhost:3000

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_INSTAGRAM_URL=
```

- [ ] **Step 5: Commit**

```bash
git init && git add . && git commit -m "chore: bootstrap next.js project"
```

---

### Task 2: Tokens de marca + fonts

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts` (crear si no existe)

- [ ] **Step 1: Cargar fonts via `next/font/google`**

En `app/layout.tsx`:
```tsx
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

// en <html>:
<html lang="es-AR" className={`${playfair.variable} ${inter.variable}`}>
```

- [ ] **Step 2: Tokens en `app/globals.css` (Tailwind v4 inline theme)**

```css
@import "tailwindcss";

@theme {
  --color-ink: #0A0A0A;
  --color-ink-soft: #2C2C2C;
  --color-bg: #FAFAF8;
  --color-bg-warm: #E8E4DC;
  --color-gold: #C4A265;
  --color-gold-dark: #8C7A5A;
  --color-line: #E5E1D8;

  --font-display: var(--font-display), "Playfair Display", serif;
  --font-sans: var(--font-sans), "Inter", system-ui, sans-serif;

  --tracking-label: 0.18em;
}

html, body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-feature-settings: "ss01", "cv11";
}

.label-caps {
  font-size: 12px;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  font-weight: 500;
  color: var(--color-gold-dark);
}
```

- [ ] **Step 3: Verificar visualmente que `font-display` y `font-sans` aplican**

Modificar temporalmente `app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="p-12">
      <h1 className="font-[family-name:var(--font-display)] text-7xl">Warszawski</h1>
      <p className="font-[family-name:var(--font-sans)]">Anteojos de diseno.</p>
    </main>
  );
}
```
Run `pnpm dev`, verificar en navegador. Después revertir a versión mínima.

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat: add brand tokens and fonts"
```

---

### Task 3: Instalar shadcn/ui

**Files:**
- Create: `components.json`, `lib/utils.ts`, `components/ui/*`

- [ ] **Step 1: Inicializar shadcn**

```bash
pnpm dlx shadcn@latest init
```
Responder: TypeScript yes, default style → New York, base color → Neutral, css variables → yes.

- [ ] **Step 2: Instalar primitives que vamos a usar**

```bash
pnpm dlx shadcn@latest add button input textarea label switch select dropdown-menu dialog tabs badge table separator
```

- [ ] **Step 3: Override de tokens shadcn para usar los de marca**

En `app/globals.css`, dentro del `@layer base` que generó shadcn, mapear los CSS vars de shadcn (`--background`, `--foreground`, `--primary`, `--border`, `--ring`) a nuestros tokens (`--color-bg`, `--color-ink`, etc). Mantener variantes oscuras también.

Revisar generated CSS y actualizar mappings — ejemplo:
```css
:root {
  --background: 60 17% 98%;     /* warm white */
  --foreground: 0 0% 4%;        /* ink */
  --primary: 0 0% 4%;
  --primary-foreground: 60 17% 98%;
  --border: 39 24% 88%;
  --ring: 36 39% 58%;           /* gold */
  /* ...resto */
}
```

- [ ] **Step 4: Verificar Button renderiza con estilo de marca**

Temporalmente en `app/page.tsx`:
```tsx
import { Button } from "@/components/ui/button";
export default function Home() {
  return <Button>Escribinos por WhatsApp</Button>;
}
```
Visual check: botón debe verse negro con texto blanco, similar al de Paper.

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat: install shadcn/ui with brand tokens"
```

---

### Task 4: Supabase clients + envs

**Files:**
- Create: `lib/supabase/server.ts`, `lib/supabase/browser.ts`, `lib/supabase/admin.ts`

- [ ] **Step 1: Instalar paquetes**

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: `lib/supabase/server.ts` — para RSC y server actions (cookies)**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)),
      },
    },
  );
}
```

- [ ] **Step 3: `lib/supabase/admin.ts` — service role para mutaciones admin (sin RLS)**

```ts
import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
```

- [ ] **Step 4: `lib/supabase/browser.ts` — solo si lo necesitamos en client components**

```ts
import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat: add supabase clients"
```

---

# Fase 2 — Middleware dual-domain

### Task 5: Tests de routing por host (TDD)

**Files:**
- Create: `tests/middleware.test.ts`

- [ ] **Step 1: Setup Vitest**

```bash
pnpm add -D vitest @vitest/ui
```

Agregar a `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

Crear `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./") } },
  test: { environment: "node" },
});
```

- [ ] **Step 2: Test (failing)**

`tests/middleware.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { resolveTarget } from "@/lib/routing/resolve-target";

describe("resolveTarget", () => {
  it("public host serving / stays at /", () => {
    expect(resolveTarget("warszawski.com", "/")).toEqual({ rewrite: null });
  });
  it("admin host serving / rewrites to /admin", () => {
    expect(resolveTarget("admin.warszawski.com", "/")).toEqual({ rewrite: "/admin" });
  });
  it("admin host with subpath rewrites under /admin", () => {
    expect(resolveTarget("admin.warszawski.com", "/productos")).toEqual({ rewrite: "/admin/productos" });
  });
  it("admin host already on /admin path passes through", () => {
    expect(resolveTarget("admin.warszawski.com", "/admin/productos")).toEqual({ rewrite: null });
  });
  it("public host accessing /admin returns 404 redirect", () => {
    expect(resolveTarget("warszawski.com", "/admin")).toEqual({ rewrite: "/not-found" });
  });
  it("strips port from host", () => {
    expect(resolveTarget("admin.localhost:3000", "/")).toEqual({ rewrite: "/admin" });
  });
});
```

- [ ] **Step 3: Correr test, verificar que falla**

```bash
pnpm test
```
Esperado: módulo no encontrado.

- [ ] **Step 4: Implementar `lib/routing/resolve-target.ts`**

```ts
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
```

- [ ] **Step 5: Test pasa**

```bash
pnpm test
```
Esperado: 6 passed.

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat: route resolver for dual-domain"
```

---

### Task 6: Wire middleware.ts

**Files:**
- Create: `middleware.ts`, `app/not-found.tsx`

- [ ] **Step 1: `middleware.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { resolveTarget } from "@/lib/routing/resolve-target";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { rewrite } = resolveTarget(host, req.nextUrl.pathname);
  if (!rewrite) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = rewrite;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon|.*\\..*).*)"],
};
```

- [ ] **Step 2: `app/not-found.tsx` minimal**

```tsx
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center">
      <p className="font-[family-name:var(--font-display)] text-6xl">404</p>
    </main>
  );
}
```

- [ ] **Step 3: Verificar manualmente**

```bash
pnpm dev
```
- `http://localhost:3000` → home pública
- `http://admin.localhost:3000` → debería pegar al `/admin` (que no existe aún → 404 esperado por ahora)

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat: dual-domain middleware"
```

---

# Fase 3 — Schema Supabase

### Task 7: Migration `products`

**Files:**
- Create: `supabase/migrations/0001_products.sql`

- [ ] **Step 1: SQL migration**

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  is_exclusive boolean not null default false,
  materials text,
  lens_type text check (lens_type in ('recetado','sol','multifocal')),
  available_colors jsonb not null default '[]'::jsonb,
  category text check (category in ('recetados','sol')),
  images jsonb not null default '[]'::jsonb,
  display_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create index products_display_order_idx on products(display_order);
create index products_is_exclusive_idx on products(is_exclusive) where is_exclusive;

alter table products enable row level security;

-- public read
create policy "products read" on products for select using (true);

-- writes only via service role (bypass RLS automatically); no policy needed for that path
```

- [ ] **Step 2: Aplicar via Supabase CLI o dashboard**

Documentar en README cómo correr:
```bash
# si usan CLI:
supabase db push
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat: products migration"
```

---

### Task 8: Migration `site_content` con keys expandidas

**Files:**
- Create: `supabase/migrations/0002_site_content.sql`, `supabase/migrations/0004_seed_content_keys.sql`, `lib/content/keys.ts`

- [ ] **Step 1: SQL `site_content`**

```sql
create table site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  page text not null,            -- 'home' | 'about' | 'global'
  section text not null,         -- 'hero' | 'exclusive' | 'collection' | 'brand' | 'cta' | 'origin' | 'values' | 'meta'
  label text not null,
  field_type text not null check (field_type in ('short_text','long_text','url')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index site_content_page_idx on site_content(page, sort_order);

alter table site_content enable row level security;
create policy "site_content read" on site_content for select using (true);
```

- [ ] **Step 2: `lib/content/keys.ts` — fuente de verdad de keys**

```ts
export type ContentField = {
  key: string;
  page: "home" | "about" | "global";
  section: string;
  label: string;
  fieldType: "short_text" | "long_text" | "url";
  defaultValue: string;
};

export const SITE_CONTENT_FIELDS: ContentField[] = [
  // ── HOME ─────────────────────────────────────────────
  { key: "home.hero.label", page: "home", section: "hero", label: "Etiqueta del hero",
    fieldType: "short_text", defaultValue: "Modelaje exclusivo en armazones y anteojos de sol" },
  { key: "home.hero.subtitle", page: "home", section: "hero", label: "Subtitulo del hero",
    fieldType: "short_text", defaultValue: "Con enorme variedad de colores en todas sus lineas." },
  { key: "home.hero.cta", page: "home", section: "hero", label: "Texto boton CTA",
    fieldType: "short_text", defaultValue: "Escribinos por WhatsApp" },
  { key: "home.hero.subcta", page: "home", section: "hero", label: "Texto sub-CTA",
    fieldType: "short_text", defaultValue: "Venta solo a mayoristas y distribuidores" },

  { key: "home.exclusive.label", page: "home", section: "exclusive", label: "Etiqueta seccion exclusiva",
    fieldType: "short_text", defaultValue: "Oportunidades" },
  { key: "home.exclusive.title", page: "home", section: "exclusive", label: "Titulo seccion exclusiva",
    fieldType: "short_text", defaultValue: "Modelaje Exclusivo" },
  { key: "home.exclusive.description", page: "home", section: "exclusive", label: "Descripcion seccion exclusiva",
    fieldType: "long_text", defaultValue: "Calce y diseno de autor. Armazones pensadas para perdurar." },

  { key: "home.collection.label", page: "home", section: "collection", label: "Etiqueta coleccion",
    fieldType: "short_text", defaultValue: "Todos los modelos" },
  { key: "home.collection.title", page: "home", section: "collection", label: "Titulo coleccion",
    fieldType: "short_text", defaultValue: "Nuestra Coleccion" },

  { key: "home.brand.label", page: "home", section: "brand", label: "Etiqueta brand statement",
    fieldType: "short_text", defaultValue: "Solo Mayoristas" },
  { key: "home.brand.primary", page: "home", section: "brand", label: "Texto principal",
    fieldType: "long_text", defaultValue: "Interesantes ofertas en modelos de temporadas pasadas. Colores variados y amplisimo stock disponible para grandes compradores." },
  { key: "home.brand.secondary", page: "home", section: "brand", label: "Texto secundario",
    fieldType: "long_text", defaultValue: "Mayoristas y distribuidores con muchos clientes y a la vanguardia de las nuevas tendencias. Consultanos por las opciones." },

  { key: "home.cta.title", page: "home", section: "cta", label: "Titulo CTA final",
    fieldType: "short_text", defaultValue: "Escribinos por WhatsApp" },
  { key: "home.cta.description", page: "home", section: "cta", label: "Descripcion CTA final",
    fieldType: "long_text", defaultValue: "Somos mayoristas. Oportunidades para grandes compradores con amplisimos stocks y colores variados en todas nuestras lineas." },

  // ── ABOUT ────────────────────────────────────────────
  { key: "about.hero.label", page: "about", section: "hero", label: "Etiqueta hero",
    fieldType: "short_text", defaultValue: "Sobre Warszawski" },
  { key: "about.hero.title", page: "about", section: "hero", label: "Titulo hero",
    fieldType: "short_text", defaultValue: "Diseno que habla por si mismo" },

  { key: "about.origin.title", page: "about", section: "origin", label: "Titulo historia",
    fieldType: "short_text", defaultValue: "Vision clara, estilo propio" },
  { key: "about.origin.p1", page: "about", section: "origin", label: "Parrafo 1",
    fieldType: "long_text", defaultValue: "Warszawski nace de una pasion por el diseno optico de autor..." },
  { key: "about.origin.p2", page: "about", section: "origin", label: "Parrafo 2",
    fieldType: "long_text", defaultValue: "Esa vision se traduce hoy en anteojos que combinan la rigurosidad del diseno..." },

  { key: "about.value1.title", page: "about", section: "values", label: "Valor 01 - Titulo",
    fieldType: "short_text", defaultValue: "Diseno con intencion" },
  { key: "about.value1.description", page: "about", section: "values", label: "Valor 01 - Descripcion",
    fieldType: "long_text", defaultValue: "Cada modelo responde a una idea clara. Nada es arbitrario." },
  { key: "about.value2.title", page: "about", section: "values", label: "Valor 02 - Titulo",
    fieldType: "short_text", defaultValue: "Materiales nobles" },
  { key: "about.value2.description", page: "about", section: "values", label: "Valor 02 - Descripcion",
    fieldType: "long_text", defaultValue: "Acetato italiano, titanio japones, lentes de primera calidad." },
  { key: "about.value3.title", page: "about", section: "values", label: "Valor 03 - Titulo",
    fieldType: "short_text", defaultValue: "Atencion personal" },
  { key: "about.value3.description", page: "about", section: "values", label: "Valor 03 - Descripcion",
    fieldType: "long_text", defaultValue: "No somos un carrito de compras. Te acompanamos en la eleccion." },

  { key: "about.cta.title", page: "about", section: "cta", label: "Titulo CTA",
    fieldType: "short_text", defaultValue: "Queremos conocerte" },
  { key: "about.cta.description", page: "about", section: "cta", label: "Descripcion CTA",
    fieldType: "long_text", defaultValue: "Escribinos por WhatsApp y charlemos sobre lo que estas buscando." },

  // ── GLOBAL ───────────────────────────────────────────
  { key: "global.whatsapp_number", page: "global", section: "meta", label: "Numero WhatsApp",
    fieldType: "short_text", defaultValue: "" },
  { key: "global.instagram_url", page: "global", section: "meta", label: "URL Instagram",
    fieldType: "url", defaultValue: "" },
  { key: "global.footer_legal", page: "global", section: "meta", label: "Texto legal del footer",
    fieldType: "short_text", defaultValue: "© Warszawski. Todos los derechos reservados." },
  { key: "global.footer_tagline", page: "global", section: "meta", label: "Tagline del footer",
    fieldType: "short_text", defaultValue: "Anteojos de diseno. Mayoristas y distribuidores." },
];
```

- [ ] **Step 3: Migration de seed**

`supabase/migrations/0004_seed_content_keys.sql`: generar INSERTs idempotentes (`on conflict (key) do nothing`) a partir de la lista de arriba. Como es repetitivo, escribir un mini script Node temporal o copiar manualmente todos los INSERTs.

```sql
insert into site_content (key, value, page, section, label, field_type, sort_order) values
  ('home.hero.label', 'Modelaje exclusivo en armazones y anteojos de sol', 'home', 'hero', 'Etiqueta del hero', 'short_text', 1),
  -- ... una linea por cada field, sort_order incremental por page
on conflict (key) do nothing;
```

- [ ] **Step 4: Test que `SITE_CONTENT_FIELDS` cubre todos los textos visibles en Paper**

`tests/content-keys.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { SITE_CONTENT_FIELDS } from "@/lib/content/keys";

describe("SITE_CONTENT_FIELDS", () => {
  it("has unique keys", () => {
    const keys = SITE_CONTENT_FIELDS.map(f => f.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
  it("covers home, about, global", () => {
    const pages = new Set(SITE_CONTENT_FIELDS.map(f => f.page));
    expect(pages).toEqual(new Set(["home", "about", "global"]));
  });
  it("every field has a non-empty label", () => {
    SITE_CONTENT_FIELDS.forEach(f => expect(f.label.length).toBeGreaterThan(0));
  });
});
```

Run `pnpm test`, esperado pasa.

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat: site_content schema and seed keys"
```

---

### Task 9: Migration storage para imágenes de productos

**Files:**
- Create: `supabase/migrations/0003_storage.sql`

- [ ] **Step 1: SQL**

```sql
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product-images public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- writes only via service role
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat: storage bucket for product images"
```

---

### Task 10: Helpers de fetch de contenido y productos

**Files:**
- Create: `types/content.ts`, `types/product.ts`, `lib/content/fetch.ts`, `lib/products/queries.ts`, `tests/content-fetch.test.ts`

- [ ] **Step 1: Tipos**

`types/content.ts`:
```ts
export type ContentMap = Record<string, string>;
export type ContentRow = {
  id: string; key: string; value: string; page: string;
  section: string; label: string; field_type: "short_text"|"long_text"|"url";
  sort_order: number;
};
```

`types/product.ts`:
```ts
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  is_exclusive: boolean;
  materials: string | null;
  lens_type: "recetado" | "sol" | "multifocal" | null;
  available_colors: { name: string; hex: string }[];
  category: "recetados" | "sol" | null;
  images: { url: string; alt: string }[];
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
};
```

- [ ] **Step 2: `lib/content/fetch.ts`**

```ts
import { unstable_cache } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { ContentMap, ContentRow } from "@/types/content";

export const getContentMap = unstable_cache(
  async (page?: "home"|"about"|"global"): Promise<ContentMap> => {
    const sb = await getSupabaseServer();
    const q = sb.from("site_content").select("key,value");
    const { data } = page ? await q.eq("page", page) : await q;
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  },
  ["content-map"],
  { tags: ["content"], revalidate: 60 },
);

export async function getAllContentRows(): Promise<ContentRow[]> {
  const sb = await getSupabaseServer();
  const { data } = await sb.from("site_content").select("*").order("sort_order");
  return data ?? [];
}
```

- [ ] **Step 3: `lib/products/queries.ts`**

```ts
import { unstable_cache } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export const listProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const sb = await getSupabaseServer();
    const { data } = await sb.from("products").select("*").order("display_order");
    return (data ?? []) as Product[];
  },
  ["products-list"],
  { tags: ["products"], revalidate: 60 },
);

export const listExclusiveProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const sb = await getSupabaseServer();
    const { data } = await sb.from("products").select("*")
      .eq("is_exclusive", true).order("display_order").limit(4);
    return (data ?? []) as Product[];
  },
  ["products-exclusive"],
  { tags: ["products"], revalidate: 60 },
);

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = await getSupabaseServer();
  const { data } = await sb.from("products").select("*").eq("slug", slug).maybeSingle();
  return (data as Product | null) ?? null;
}
```

- [ ] **Step 4: Test (con mock de supabase)**

`tests/content-fetch.test.ts`: mockear `@/lib/supabase/server` con `vi.mock`, asegurar que `getContentMap` devuelve `Record<key,value>` para input array.

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat: content/products fetch helpers"
```

---

# Fase 4 — Public site

### Task 11: SiteHeader

**Files:**
- Create: `components/public/SiteHeader.tsx`, `components/public/WhatsAppButton.tsx`, `lib/whatsapp.ts`

- [ ] **Step 1: `lib/whatsapp.ts`**

```ts
export function buildWhatsAppUrl(number: string, message?: string): string {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
```

- [ ] **Step 2: `components/public/WhatsAppButton.tsx`**

```tsx
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = { number: string; message?: string; children: React.ReactNode; variant?: "solid" | "ghost" };

export function WhatsAppButton({ number, message, children, variant = "solid" }: Props) {
  const cls = variant === "solid"
    ? "bg-ink text-bg px-6 py-3 text-sm hover:bg-ink-soft transition"
    : "border border-ink text-ink px-6 py-3 text-sm hover:bg-ink hover:text-bg transition";
  return (
    <Link href={buildWhatsAppUrl(number, message)} className={cls} target="_blank" rel="noopener">
      {children}
    </Link>
  );
}
```

- [ ] **Step 3: `components/public/SiteHeader.tsx`** — leer JSX exacto desde Paper

```bash
# obtener estilos exactos via MCP
# get_jsx para nodo header del Home (mismo diseño en About y Product)
```

Construir sticky/transparent header con: logo "WARSZAWSKI" izquierda, nav (COLECCION, NOSOTROS) centro-derecha, WhatsApp button derecha. Tracking de letras según Paper. Mobile: hamburger.

- [ ] **Step 4: Verificación visual**

Comparar con screenshot artboard `87-0` (Home top) y `3W-1` (About top). Iterar hasta match.

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat: site header"
```

---

### Task 12: SiteFooter

**Files:**
- Create: `components/public/SiteFooter.tsx`

- [ ] **Step 1: Implementación basada en JSX de Paper**

Leer footer del Home via `get_jsx`. Estructura: fondo negro, columnas (brand+tagline | navegacion | contacto), legal abajo.

- [ ] **Step 2: Visual check vs Paper**

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat: site footer"
```

---

### Task 13: Public layout

**Files:**
- Create: `app/(public)/layout.tsx`

- [ ] **Step 1: Layout que envuelve Header + children + Footer, lee `getContentMap("global")` para number/insta**

```tsx
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { getContentMap } from "@/lib/content/fetch";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const global = await getContentMap("global");
  return (
    <>
      <SiteHeader whatsappNumber={global["global.whatsapp_number"] ?? ""} />
      {children}
      <SiteFooter
        whatsappNumber={global["global.whatsapp_number"] ?? ""}
        instagramUrl={global["global.instagram_url"] ?? ""}
        legal={global["global.footer_legal"] ?? ""}
        tagline={global["global.footer_tagline"] ?? ""}
      />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat: public layout"
```

---

### Task 14: Home — Hero

**Files:**
- Create: `components/public/home/Hero.tsx`

- [ ] **Step 1: Implementación desde JSX de Paper (`get_jsx` del nodo hero del artboard `87-0`)**

Wordmark "WARSZAWSKI" massive en Playfair, label arriba en small caps dorado, subtítulo, CTA, sub-CTA.

- [ ] **Step 2: Visual diff vs Paper hero**

- [ ] **Step 3: Commit**

---

### Task 15: Home — ExclusiveSection (4 bloques alternados)

**Files:**
- Create: `components/public/home/ExclusiveSection.tsx`, `components/public/home/ExclusiveBlock.tsx`

- [ ] **Step 1: `ExclusiveBlock`** — props: `index` (01..), `product`, `align: "left"|"right"` (image left vs right)

Bloque 50/50 con imagen y panel de texto sobre fondo negro alternando lados. Cada bloque tiene un CTA "Consultar por {nombre}" que abre WhatsApp.

- [ ] **Step 2: `ExclusiveSection`** — encabezado de sección + map sobre los 4 productos exclusive con alternancia.

- [ ] **Step 3: Visual diff**

- [ ] **Step 4: Commit**

---

### Task 16: Home — CollectionSection + ProductCard

**Files:**
- Create: `components/public/home/CollectionSection.tsx`, `components/public/home/ProductCard.tsx`

- [ ] **Step 1: `ProductCard`** — imagen cuadrada, debajo nombre + descripción corta, "VER MAS" alineado a la derecha. Link a `/productos/[slug]`.

- [ ] **Step 2: `CollectionSection`** — header con label + título + grid responsive (3 cols desktop, 2 tablet, 1 mobile).

- [ ] **Step 3: Visual diff**

- [ ] **Step 4: Commit**

---

### Task 17: Home — BrandStatement + FinalCTA

**Files:**
- Create: `components/public/home/BrandStatement.tsx`, `components/public/home/FinalCTA.tsx`

- [ ] **Step 1: `BrandStatement`** sobre fondo negro, texto centrado.

- [ ] **Step 2: `FinalCTA`** sección clara con título display + descripción + botón WhatsApp.

- [ ] **Step 3: Visual diff**

- [ ] **Step 4: Commit**

---

### Task 18: Home page assembly

**Files:**
- Create: `app/(public)/page.tsx`

- [ ] **Step 1:**

```tsx
import { Hero } from "@/components/public/home/Hero";
import { ExclusiveSection } from "@/components/public/home/ExclusiveSection";
import { CollectionSection } from "@/components/public/home/CollectionSection";
import { BrandStatement } from "@/components/public/home/BrandStatement";
import { FinalCTA } from "@/components/public/home/FinalCTA";
import { getContentMap } from "@/lib/content/fetch";
import { listProducts, listExclusiveProducts } from "@/lib/products/queries";

export default async function HomePage() {
  const [content, all, exclusive] = await Promise.all([
    getContentMap("home"),
    listProducts(),
    listExclusiveProducts(),
  ]);
  return (
    <main>
      <Hero content={content} />
      <ExclusiveSection content={content} products={exclusive} />
      <CollectionSection content={content} products={all} />
      <BrandStatement content={content} />
      <FinalCTA content={content} />
    </main>
  );
}
```

- [ ] **Step 2: Visual full-page diff vs artboard `87-0`**

- [ ] **Step 3: Commit**

---

### Task 19: About page

**Files:**
- Create: `app/(public)/nosotros/page.tsx`, `components/public/about/AboutHero.tsx`, `OriginStory.tsx`, `ValuesSection.tsx`, `ValueCard.tsx`

- [ ] **Step 1-4:** un componente por archivo, mismo flujo que Home: leer JSX de Paper → implementar → diff visual → commit.

Mapeo de bloques (artboard `3W-1`):
- `AboutHero` → label + display title masivo
- `OriginStory` → bloque imagen + 2 párrafos
- `ValuesSection` → fondo negro, 3 columnas con `ValueCard` (label `01/02/03` dorado + título + descripción)
- Reusar `FinalCTA` con copy de about.

- [ ] **Step 5: Commit por componente**

---

### Task 20: Product page

**Files:**
- Create: `app/(public)/productos/[slug]/page.tsx`, `components/public/product/{ProductGallery,ProductInfo,ColorPicker,Breadcrumbs,RelatedProducts}.tsx`

- [ ] **Step 1: Breadcrumbs**

```tsx
type Props = { items: { label: string; href?: string }[] };
```
Inicio / Coleccion / {nombre}, separador `/`.

- [ ] **Step 2: ProductGallery** — imagen grande arriba, thumbnails fijas debajo (FRENTE / PERFIL / DETALLE / PUESTO). Selección con borde dorado en activa. Client component con useState para activeIndex.

- [ ] **Step 3: ProductInfo** — label "MODELAJE EXCLUSIVO" si is_exclusive, nombre display, descripción, separador, key/value (Material, Tipo), separador, ColorPicker, CTA WhatsApp.

- [ ] **Step 4: ColorPicker** — círculos de color, debajo nombre del seleccionado. Client component.

- [ ] **Step 5: RelatedProducts** — header centrado + grid 3 cols con cards estilo home.

- [ ] **Step 6: Page**

```tsx
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const all = await listProducts();
  const related = all.filter(p => p.id !== product.id).slice(0, 3);
  return ( <main> ...assembly... </main> );
}

export async function generateStaticParams() {
  const all = await listProducts();
  return all.map(p => ({ slug: p.slug }));
}
```

- [ ] **Step 7: Visual diff vs artboard `5B-0`**

- [ ] **Step 8: Commit**

---

# Fase 5 — Admin auth

### Task 21: Session helpers (TDD)

**Files:**
- Create: `lib/auth/session.ts`, `tests/auth-session.test.ts`

- [ ] **Step 1:**
```bash
pnpm add jose
```

- [ ] **Step 2: Test**

```ts
import { describe, it, expect } from "vitest";
import { signSession, verifySession } from "@/lib/auth/session";

describe("session", () => {
  const secret = "x".repeat(32);
  it("round trips a session", async () => {
    const token = await signSession({ admin: true }, secret);
    const payload = await verifySession(token, secret);
    expect(payload?.admin).toBe(true);
  });
  it("rejects bad secret", async () => {
    const token = await signSession({ admin: true }, secret);
    expect(await verifySession(token, "y".repeat(32))).toBeNull();
  });
  it("rejects garbage", async () => {
    expect(await verifySession("not-a-jwt", secret)).toBeNull();
  });
});
```

- [ ] **Step 3: Implementar**

```ts
import { SignJWT, jwtVerify } from "jose";

export async function signSession(payload: { admin: true }, secret: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));
}

export async function verifySession(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as { admin: true };
  } catch { return null; }
}
```

- [ ] **Step 4: Test pasa, commit**

---

### Task 22: Login form + action

**Files:**
- Create: `app/admin/login/page.tsx`, `components/admin/LoginForm.tsx`, `actions/auth.ts`, `lib/auth/guard.ts`

- [ ] **Step 1: `actions/auth.ts`**

```ts
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession } from "@/lib/auth/session";

const COOKIE = "wsz_admin";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Contrasena incorrecta" };
  }
  const token = await signSession({ admin: true }, process.env.SESSION_SECRET!);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin/productos");
}

export async function logoutAction() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}
```

- [ ] **Step 2: `lib/auth/guard.ts`**

```ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "./session";

export async function requireAdmin() {
  const token = (await cookies()).get("wsz_admin")?.value;
  if (!token) redirect("/admin/login");
  const payload = await verifySession(token, process.env.SESSION_SECRET!);
  if (!payload?.admin) redirect("/admin/login");
}
```

- [ ] **Step 3: `LoginForm.tsx`** — client component con label "ADMIN" (gold), wordmark "WARSZAWSKI", campo password, botón "Ingresar". Usa `useFormState` para errores.

- [ ] **Step 4: Page** — centra el form vertical+horizontal, fondo warm white, sin header/footer (login no usa AdminTopBar).

- [ ] **Step 5: Visual diff vs artboard `GT-0`**

- [ ] **Step 6: Commit**

---

### Task 23: Admin layout + AdminTopBar

**Files:**
- Create: `app/admin/layout.tsx`, `components/admin/AdminTopBar.tsx`

- [ ] **Step 1: AdminTopBar** — wordmark izq, separador, nav "Productos" / "Contenido" (subrayado en activa), botón "Cerrar sesion" derecha (form que invoca `logoutAction`).

Usa `usePathname` para marcar activa.

- [ ] **Step 2: Layout**

```tsx
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { requireAdmin } from "@/lib/auth/guard";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = (await headers()).get("x-pathname") ?? "";  // or pull from middleware
  if (!path.endsWith("/admin/login")) await requireAdmin();
  return (
    <div className="min-h-screen bg-bg">
      {!path.endsWith("/admin/login") && <AdminTopBar />}
      <main className="max-w-[1440px] mx-auto px-10 py-8">{children}</main>
    </div>
  );
}
```

Nota: para evitar el chequeo de path, alternativa es group `app/admin/(auth)/login/page.tsx` con su propio layout sin guard. Hacerlo así (más limpio):

Reorganizar:
- `app/admin/(auth)/layout.tsx` — sin guard, sin topbar
- `app/admin/(auth)/login/page.tsx`
- `app/admin/(panel)/layout.tsx` — con guard + AdminTopBar
- `app/admin/(panel)/productos/...`
- `app/admin/(panel)/contenido/...`

- [ ] **Step 3: `app/admin/page.tsx` redirige a `/admin/productos`**

- [ ] **Step 4: Visual diff vs artboards admin**

- [ ] **Step 5: Commit**

---

# Fase 6 — Admin productos

### Task 24: Lista de productos

**Files:**
- Create: `app/admin/(panel)/productos/page.tsx`, `components/admin/products/ProductTable.tsx`, `ProductTableRow.tsx`, `ReorderButtons.tsx`

- [ ] **Step 1: ProductTable** — header con título "Productos", subtítulo "{n} productos en total", search input (right) + select "Categoría" + botón "+ Agregar producto" (gold/black). Tabla con columnas: NOMBRE (thumbnail + nombre + slug muted), CATEGORIA, TIPO LENTE, EXCLUSIVO (checkbox), ORDEN (arrow up/down + número), ACCIONES (edit/delete).

- [ ] **Step 2: ReorderButtons** — formulario con `formAction` que invoca `reorderProductAction(id, "up"|"down")`.

- [ ] **Step 3: Search/filter** — client component que filtra rows en memoria por nombre y categoría.

- [ ] **Step 4: Page**

```tsx
export default async function ProductsPage() {
  const products = await listProducts();
  return <ProductTable products={products} />;
}
```

- [ ] **Step 5: Visual diff vs artboard `H5-0`**

- [ ] **Step 6: Commit**

---

### Task 25: Server actions de producto

**Files:**
- Create: `actions/products.ts`, `schemas/product.ts`, `lib/products/slug.ts`, `tests/slug.test.ts`

- [ ] **Step 1: `lib/products/slug.ts` con tests**

```ts
export function slugify(input: string): string {
  return input.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
```

Tests para casos: "Aurora" → "aurora", "Eclipse Sol" → "eclipse-sol", "Niña ñ" → "nina-n", "  Hola--Mundo  " → "hola-mundo".

- [ ] **Step 2: `schemas/product.ts`**

```ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  short_description: z.string().max(200).nullable(),
  description: z.string().nullable(),
  materials: z.string().nullable(),
  lens_type: z.enum(["recetado","sol","multifocal"]).nullable(),
  category: z.enum(["recetados","sol"]).nullable(),
  available_colors: z.array(z.object({ name: z.string(), hex: z.string() })).default([]),
  images: z.array(z.object({ url: z.string().url(), alt: z.string() })).default([]),
  is_exclusive: z.boolean().default(false),
  seo_title: z.string().max(70).nullable(),
  seo_description: z.string().max(160).nullable(),
});
export type ProductInput = z.infer<typeof productSchema>;
```

- [ ] **Step 3: `actions/products.ts`**

```ts
"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { productSchema } from "@/schemas/product";
import { requireAdmin } from "@/lib/auth/guard";

export async function createProductAction(input: unknown) {
  await requireAdmin();
  const data = productSchema.parse(input);
  const sb = getSupabaseAdmin();
  const { data: max } = await sb.from("products").select("display_order")
    .order("display_order", { ascending: false }).limit(1).maybeSingle();
  const display_order = (max?.display_order ?? 0) + 1;
  const { error } = await sb.from("products").insert({ ...data, display_order });
  if (error) throw new Error(error.message);
  revalidateTag("products");
  redirect("/admin/productos");
}

export async function updateProductAction(id: string, input: unknown) {
  await requireAdmin();
  const data = productSchema.parse(input);
  const { error } = await getSupabaseAdmin().from("products").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag("products");
  redirect("/admin/productos");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const { error } = await getSupabaseAdmin().from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag("products");
}

export async function reorderProductAction(id: string, direction: "up" | "down") {
  await requireAdmin();
  const sb = getSupabaseAdmin();
  const { data: rows } = await sb.from("products").select("id,display_order")
    .order("display_order");
  if (!rows) return;
  const idx = rows.findIndex(r => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= rows.length) return;
  const a = rows[idx], b = rows[swap];
  await sb.from("products").update({ display_order: b.display_order }).eq("id", a.id);
  await sb.from("products").update({ display_order: a.display_order }).eq("id", b.id);
  revalidateTag("products");
}
```

- [ ] **Step 4: Commit**

---

### Task 26: Product form (crear/editar)

**Files:**
- Create: `app/admin/(panel)/productos/nuevo/page.tsx`, `app/admin/(panel)/productos/[id]/page.tsx`, `components/admin/products/{ProductForm,ProductFormBasic,ProductFormDetails,ProductFormImages,ProductFormVisibility,ProductFormSeo,ColorTagInput}.tsx`

- [ ] **Step 1: `ProductForm`** — client component con `react-hook-form` + zodResolver. Wrapper con sub-secciones:

```tsx
"use client";
export function ProductForm({ initial, mode }: { initial?: Product; mode: "create"|"edit" }) {
  const form = useForm<ProductInput>({ resolver: zodResolver(productSchema), defaultValues: ... });
  const onSubmit = form.handleSubmit(async (values) => {
    if (mode === "create") await createProductAction(values);
    else await updateProductAction(initial!.id, values);
  });
  return (
    <form onSubmit={onSubmit} className="space-y-12">
      <ProductFormBasic form={form} />
      <ProductFormDetails form={form} />
      <ProductFormImages form={form} />
      <ProductFormVisibility form={form} />
      <ProductFormSeo form={form} />
      <div className="flex gap-4">
        <Button type="submit">Guardar cambios</Button>
        <Link href="/admin/productos"><Button variant="outline">Cancelar</Button></Link>
      </div>
    </form>
  );
}
```

```bash
pnpm add react-hook-form @hookform/resolvers zod
```

- [ ] **Step 2: `ProductFormBasic`** — fields: name, slug (auto desde name si vacío), short_description, description (textarea). Trigger slug update onBlur de name si slug está vacío.

- [ ] **Step 3: `ProductFormDetails`** — materials (input), lens_type (Select recetado/sol/multifocal), category (Select recetados/sol), available_colors (`ColorTagInput`).

- [ ] **Step 4: `ColorTagInput`** — chip list editable. Estado local de `{name,hex}[]`, input para agregar (con popover de color picker), X en cada chip.

- [ ] **Step 5: `ProductFormImages`** — grid de slots, drag-and-drop o click "+". Subida invoca `/api/admin/upload`. Botón "Principal" para marcar primer índice. Reorder por drag.

- [ ] **Step 6: `ProductFormVisibility`** — switch is_exclusive con descripción.

- [ ] **Step 7: `ProductFormSeo`** — seo_title y seo_description con character counter.

- [ ] **Step 8: Pages**

```tsx
// nuevo/page.tsx
export default function NewProductPage() {
  return <ProductForm mode="create" />;
}

// [id]/page.tsx
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = getSupabaseAdmin();
  const { data } = await sb.from("products").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <ProductForm mode="edit" initial={data as Product} />;
}
```

- [ ] **Step 9: Visual diff vs artboard `OH-0`**

- [ ] **Step 10: Commit**

---

### Task 27: Image upload endpoint

**Files:**
- Create: `app/api/admin/upload/route.ts`

- [ ] **Step 1:**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/guard";

export async function POST(req: NextRequest) {
  await requireAdmin();
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });
  const ext = file.name.split(".").pop() ?? "jpg";
  const key = `${crypto.randomUUID()}.${ext}`;
  const sb = getSupabaseAdmin();
  const { error } = await sb.storage.from("product-images").upload(key, file, {
    contentType: file.type, upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data } = sb.storage.from("product-images").getPublicUrl(key);
  return NextResponse.json({ url: data.publicUrl });
}
```

Validar tipo (image/*) y tamaño (<5MB).

- [ ] **Step 2: Commit**

---

# Fase 7 — Admin contenido

### Task 28: Content editor

**Files:**
- Create: `app/admin/(panel)/contenido/page.tsx`, `components/admin/content/{ContentTabs,ContentSection,ContentField}.tsx`, `actions/content.ts`, `schemas/content.ts`

- [ ] **Step 1: `actions/content.ts`**

```ts
"use server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/guard";

const updateSchema = z.array(z.object({ key: z.string(), value: z.string() }));

export async function updateContentAction(input: unknown) {
  await requireAdmin();
  const updates = updateSchema.parse(input);
  const sb = getSupabaseAdmin();
  for (const u of updates) {
    await sb.from("site_content").update({ value: u.value, updated_at: new Date().toISOString() })
      .eq("key", u.key);
  }
  revalidateTag("content");
  return { ok: true };
}
```

- [ ] **Step 2: `ContentField`** — renderiza por `field_type`: short_text → Input, long_text → Textarea, url → Input type=url. Label arriba.

- [ ] **Step 3: `ContentSection`** — agrupa campos con header (label uppercase + separador). Toma `section` y filtra los rows.

- [ ] **Step 4: `ContentTabs`** — client component con shadcn Tabs (Home / Nosotros). Cada tab renderiza secciones agrupadas. Estado dirty global → habilita "Guardar cambios" (sticky top-right).

```tsx
"use client";
export function ContentTabs({ rows }: { rows: ContentRow[] }) {
  const [values, setValues] = useState(() => Object.fromEntries(rows.map(r => [r.key, r.value])));
  const dirty = ...;
  const save = async () => {
    const updates = rows.filter(r => values[r.key] !== r.value)
      .map(r => ({ key: r.key, value: values[r.key] }));
    await updateContentAction(updates);
  };
  return <Tabs>...</Tabs>;
}
```

- [ ] **Step 5: Page**

```tsx
export default async function ContentPage() {
  const rows = await getAllContentRows();
  return <ContentTabs rows={rows.filter(r => r.page !== "global")} />;
}
```

(Globals quedan en otra subpage o se manejan aparte si querés — dejarlos en una sección "Global" dentro de Home tab si la Paper screen no los cubre. **Decisión**: agregar tab "Global" como tercer tab para cubrir whatsapp/insta/footer.)

- [ ] **Step 6: Visual diff vs artboards `YK-0` y `119-0`**

- [ ] **Step 7: Commit**

---

# Fase 8 — SEO

### Task 29: Metadata por página + JSON-LD

**Files:**
- Create: `lib/seo.ts`
- Modify: `app/(public)/page.tsx`, `app/(public)/nosotros/page.tsx`, `app/(public)/productos/[slug]/page.tsx`, `app/layout.tsx`

- [ ] **Step 1: `lib/seo.ts`**

```ts
import type { Metadata } from "next";
import type { Product } from "@/types/product";

const SITE = "https://warszawski.com";

export function buildHomeMetadata(content: Record<string,string>): Metadata {
  return {
    title: "Warszawski — Anteojos de diseno",
    description: content["home.brand.primary"] ?? "",
    alternates: { canonical: SITE },
    openGraph: { title: "Warszawski", url: SITE, locale: "es-AR", type: "website" },
  };
}

export function buildAboutMetadata(content: Record<string,string>): Metadata { /* similar */ }

export function buildProductMetadata(p: Product): Metadata {
  return {
    title: p.seo_title ?? `${p.name} — Warszawski`,
    description: p.seo_description ?? p.short_description ?? "",
    alternates: { canonical: `${SITE}/productos/${p.slug}` },
    openGraph: {
      title: p.name,
      images: p.images[0]?.url ? [{ url: p.images[0].url }] : undefined,
      type: "website",
    },
  };
}

export function organizationJsonLd() { /* ...Organization schema */ }
export function productJsonLd(p: Product) { /* ...Product schema */ }
export function breadcrumbJsonLd(items: { name: string; url: string }[]) { /* ... */ }
```

- [ ] **Step 2: Aplicar `generateMetadata` en cada página y inyectar JSON-LD via `<script type="application/ld+json">`**

- [ ] **Step 3: Commit**

---

### Task 30: Sitemap + robots

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`

- [ ] **Step 1: `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/products/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://warszawski.com";
  const products = await listProducts();
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/nosotros`, priority: 0.7 },
    ...products.map(p => ({ url: `${base}/productos/${p.slug}`, priority: 0.8 })),
  ];
}
```

- [ ] **Step 2: `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: "https://warszawski.com/sitemap.xml",
  };
}
```

- [ ] **Step 3: Commit**

---

# Fase 9 — Polish

### Task 31: Responsive review (mobile pass)

- [ ] Recorrer Home, Nosotros, Producto, Admin login, Admin lista, Admin form, Admin contenido en breakpoints 375 / 768 / 1280.
- [ ] Listar fixes específicos antes de aplicarlos.
- [ ] Aplicar fixes.
- [ ] Commit.

### Task 32: Accesibilidad

- [ ] Revisar contraste (texto sobre warm white, dorado sobre negro), focus visible en todos los interactivos, aria-labels en botones-icono (reorder up/down, edit, delete).
- [ ] Lighthouse a11y > 95.
- [ ] Commit.

### Task 33: Error boundaries y estados vacíos

- [ ] `app/(public)/error.tsx`, `app/admin/error.tsx`, `loading.tsx` donde aplique.
- [ ] Empty state en lista de productos cuando 0 productos.
- [ ] Estado de "guardando..." en forms.
- [ ] Commit.

### Task 34: Configurar Vercel + DNS

- [ ] En Vercel proyecto → Domains: agregar `warszawski.com` y `admin.warszawski.com`.
- [ ] DNS: A/ALIAS `warszawski.com` y CNAME `admin` apuntando a Vercel.
- [ ] Test post-deploy: ambos hosts sirven el contenido correcto.

---

## Self-review

**Spec coverage check** (contra MANIFEST):
- ✅ 3 páginas frontend (Home, Nosotros, Producto)
- ✅ Color palette y typography vía tokens en `globals.css` (Task 2)
- ✅ Voice editorial — copy en seed (Task 8)
- ✅ WhatsApp como único CTA (`WhatsAppButton`, sin formularios de compra)
- ✅ JSON-LD Organization, Product, BreadcrumbList (Task 29)
- ✅ Sitemap, robots, hreflang via `lang="es-AR"` (Task 30 + Task 1)
- ✅ Schema `products` (Task 7) y `site_content` (Task 8) — con keys expandidas porque MANIFEST estaba sub-especificado vs Paper
- ✅ Admin: login, lista, form, content editor (Tasks 22-28)
- ✅ Admin auth password única + cookie + env var (Tasks 21-22)
- ⚠️ MANIFEST listaba menos keys de contenido que Paper — documenté la expansión y la cubrí en `SITE_CONTENT_FIELDS` (Task 8). Confirmar con usuario antes de seedear si está bien expandirlo.

**Placeholders:** ninguno crítico. Las tareas 11–20 se apoyan en `get_jsx` de Paper en runtime — eso es por diseño (replicar pixel-perfect requiere leer el JSX exacto de cada nodo, no escribir tu mejor aproximación en el plan). Marcado claramente.

**Type consistency:** `Product`, `ContentRow`, `ContentMap`, `ProductInput` definidos una vez y referenciados con el mismo nombre en todos lados.

---

**Plan listo.**
