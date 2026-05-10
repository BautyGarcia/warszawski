# Deploy — Warszawski

Guía paso a paso para llevar el proyecto a producción.

## 1. Supabase

Setup del proyecto + schema + storage + admin user.

### Crear el proyecto

1. Ir a https://supabase.com/dashboard, crear un nuevo proyecto.
2. Anotar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (mantenerla secreta — bypasea RLS)

### Aplicar las migrations

En el SQL Editor del dashboard de Supabase, ejecutar **en orden**:

```
supabase/migrations/0001_products.sql
supabase/migrations/0002_site_content.sql
supabase/migrations/0003_storage.sql
supabase/migrations/0004_seed_content.sql
```

O usando Supabase CLI:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

### Crear el usuario admin

Con `.env.local` completo, correr local:

```bash
pnpm create-admin admin@warszawski.com <password-fuerte>
```

El script es idempotente: si el usuario existe, le actualiza el password.

## 2. Vercel — deploy provisional (`warszawski.vercel.app`)

Para el primer deploy sin dominio propio.

### Importar el proyecto

1. https://vercel.com/new → Import Git Repository → seleccionar el repo
2. Framework: Next.js (auto-detectado)
3. **Project Name**: `warszawski` (define la URL `warszawski.vercel.app`)
4. **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://warszawski.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=549XXXXXXXXX
```

5. Deploy.

### Cómo funciona

Vercel solo te da una URL pública por proyecto (`warszawski.vercel.app`) — no podés tener `admin.warszawski.vercel.app` apuntando al mismo proyecto. Por eso el `proxy.ts` detecta `*.vercel.app` y entra en **modo single-domain**:

- `https://warszawski.vercel.app/` → sitio público
- `https://warszawski.vercel.app/admin` → backoffice (login)
- `https://warszawski.vercel.app/admin/productos` → CRUD productos

El admin sigue protegido por Supabase Auth — sin sesión válida no se puede entrar aunque la URL sea accesible.

## 3. Migrar al dominio propio (`warszawski.com`)

Cuando tengas el dominio comprado.

### Settings → Domains en Vercel

1. Agregar `warszawski.com` (sin www o con redirect 308)
2. Agregar `admin.warszawski.com`

Ambos apuntan al mismo proyecto. El `proxy.ts` empieza a usar **modo dual-domain** para esos hosts:

- `warszawski.com/*` → sitio público (`/admin` retorna 404)
- `admin.warszawski.com/*` → rewrite interno a `/admin/*`

El `warszawski.vercel.app` sigue funcionando como fallback con el modo single-domain.

### DNS

En tu DNS provider:

```
warszawski.com           A       76.76.21.21          # Vercel A record
www.warszawski.com       CNAME   cname.vercel-dns.com
admin.warszawski.com     CNAME   cname.vercel-dns.com
```

Vercel maneja SSL automático vía Let's Encrypt.

### Update env var

Cambiar `NEXT_PUBLIC_SITE_URL` a `https://warszawski.com` en Vercel Settings → Environment Variables, redeploy. Esto actualiza canonical URLs, sitemap y JSON-LD.

## 4. Verificar post-deploy

### Provisional (warszawski.vercel.app)

- [ ] `https://warszawski.vercel.app` carga la home
- [ ] `/nosotros`, `/productos/<slug>` cargan
- [ ] `/sitemap.xml` y `/robots.txt` accesibles
- [ ] `/admin` redirige a `/admin/login`
- [ ] Login con admin → `/admin/productos`
- [ ] Crear producto → aparece en home pública

### Dominio propio (warszawski.com)

- [ ] `https://warszawski.com` carga la home con productos reales
- [ ] `https://warszawski.com/admin` retorna 404 (NO expone el panel)
- [ ] `https://admin.warszawski.com` redirige a `/admin/login`
- [ ] Crear/editar producto desde admin → cambio aparece inmediatamente en `https://warszawski.com`

## 5. Local development con dual-domain

Los navegadores modernos resuelven `*.localhost` automáticamente a `127.0.0.1`. Sin tocar `/etc/hosts`:

- `http://localhost:3000` → frontend público
- `http://admin.localhost:3000` → backoffice

Ambos sirven del mismo `pnpm dev`. El proxy.ts hace el rewrite por host.

Si Safari no resuelve `admin.localhost`, agregar a `/etc/hosts`:

```
127.0.0.1 admin.localhost
```

## 6. Comandos útiles

```bash
pnpm dev                                 # dev server con turbopack
pnpm build                               # build de producción
pnpm start                               # serve build local
pnpm test                                # suite de tests
pnpm create-admin <email> <password>     # crear/actualizar admin
```
