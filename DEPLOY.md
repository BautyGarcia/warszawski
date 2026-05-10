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

## 2. Vercel

### Importar el proyecto

1. https://vercel.com/new → Import Git Repository → seleccionar el repo
2. Framework: Next.js (auto-detectado)
3. **Environment Variables** (paste desde `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_PUBLIC_HOST=warszawski.com
NEXT_PUBLIC_ADMIN_HOST=admin.warszawski.com
NEXT_PUBLIC_SITE_URL=https://warszawski.com
NEXT_PUBLIC_WHATSAPP_NUMBER=549XXXXXXXXX
```

4. Deploy.

### Dominios

En Vercel project → Settings → Domains:

1. Agregar `warszawski.com` (sin www o con redirect 308 según preferencia)
2. Agregar `admin.warszawski.com`

Ambos apuntan al mismo proyecto. El `proxy.ts` se encarga del routing por host:

- `warszawski.com/*` → sitio público
- `admin.warszawski.com/*` → rewrite interno a `/admin/*`

### DNS

En tu DNS provider:

```
warszawski.com           A       76.76.21.21          # Vercel A record
www.warszawski.com       CNAME   cname.vercel-dns.com
admin.warszawski.com     CNAME   cname.vercel-dns.com
```

Vercel maneja SSL automático para ambos dominios vía Let's Encrypt.

## 3. Verificar post-deploy

- [ ] `https://warszawski.com` carga la home con productos reales
- [ ] `https://warszawski.com/nosotros` carga
- [ ] `https://warszawski.com/productos/<slug>` carga un producto
- [ ] `https://warszawski.com/sitemap.xml` lista todas las URLs
- [ ] `https://warszawski.com/robots.txt` allow / + sitemap link
- [ ] `https://warszawski.com/admin` retorna 404 (NO expone el panel)
- [ ] `https://admin.warszawski.com` redirige a `/admin/login`
- [ ] Login con credenciales del admin → `/admin/productos`
- [ ] Crear/editar producto desde admin → cambio aparece inmediatamente en `https://warszawski.com`
- [ ] Editar contenido → cambio aparece en home/nosotros

## 4. Local development con dual-domain

Los navegadores modernos resuelven `*.localhost` automáticamente a `127.0.0.1`. Sin tocar `/etc/hosts`:

- `http://localhost:3000` → frontend público
- `http://admin.localhost:3000` → backoffice

Ambos sirven del mismo `pnpm dev`. El proxy.ts hace el rewrite por host.

Si Safari no resuelve `admin.localhost`, agregar a `/etc/hosts`:

```
127.0.0.1 admin.localhost
```

## 5. Comandos útiles

```bash
pnpm dev                                 # dev server con turbopack
pnpm build                               # build de producción
pnpm start                               # serve build local
pnpm test                                # suite de tests
pnpm create-admin <email> <password>     # crear/actualizar admin
```
