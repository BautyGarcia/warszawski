# WARSZAWSKI — Project Manifest

## 1. Brand Identity

- **Direction**: Luxury/exclusive, Polish heritage undertones, editorial minimalism
- **Tagline**: "See Beyond."
- **Voice**: Confident, minimal, elevated. No exclamation marks. Every word earns its place.

### Color Palette

| Role          | Name        | Hex       |
|---------------|-------------|-----------|
| Primary       | Black       | `#0A0A0A` |
| Background    | Warm White  | `#FAFAF8` |
| Accent        | Muted Gold  | `#C4A265` |
| Secondary     | Charcoal    | `#2C2C2C` |
| Accent Dark   | Dark Gold   | `#8C7A5A` |
| Neutral       | Warm Gray   | `#E8E4DC` |

### Typography

- **Headings**: Editorial serif — Playfair Display or Cormorant Garamond. Large, confident, high contrast weight.
- **Body**: Clean sans-serif — Inter or DM Sans. Regular weight, generous line-height.
- **Labels**: Small-caps treatment on sans-serif. Tracked out, muted color.

---

## 2. Website Structure

Three pages. No e-commerce. WhatsApp is the sole conversion channel.

### Home `/`

1. **Hero** — Brand name displayed massive. Subtitle underneath. WhatsApp CTA button.
2. **Exclusive Products** — 4 flagship products, each in a full-width editorial section. One product at a time. Large imagery, minimal text, individual WhatsApp CTA.
3. **Full Collection Grid** — All products in a responsive grid. Cards link to individual product pages.
4. **Brand Statement** — Short paragraph reinforcing brand positioning and values.
5. **Final CTA** — WhatsApp contact block with closing message.
6. **Footer** — Navigation, social links, legal.

### About `/nosotros`

- Brand origin story (Polish heritage, Argentine identity)
- Values and craftsmanship philosophy
- WhatsApp CTA

### Product `/productos/[slug]`

- Large product imagery (multiple angles)
- Product name, description, details (materials, lens type, colors)
- WhatsApp CTA: "Consultar por [product name]"
- Related products section

---

## 3. Copy Direction

All copy in Spanish (Argentine). Tone: confident, editorial, never salesy.

### Home

- **Hero heading**: `WARSZAWSKI`
- **Hero subtitle**: `Anteojos de diseno. Hechos para vos.`
- **Exclusive section heading**: `Coleccion Exclusiva` or `Edicion Selecta`
- **Grid section heading**: `Nuestra Coleccion` or `Explora todos los modelos`
- **Brand statement**: Brief paragraph — design, heritage, identity.

### CTAs

- Primary: `Escribinos por WhatsApp`
- Product-specific: `Consultar por [product name]`

### About Page

- Origin story connecting Polish heritage with Argentine identity
- Craftsmanship and design philosophy
- Why the name "Warszawski"

---

## 4. SEO & GEO Strategy

### Technical SEO

- Semantic HTML with proper heading hierarchy (single H1 per page)
- Unique meta tags per page: title, description, OG image, Twitter card
- JSON-LD structured data:
  - `Organization` (homepage)
  - `Product` (each product page)
  - `BreadcrumbList` (all pages)
- Canonical URLs on every page
- `sitemap.xml` and `robots.txt`
- `hreflang="es-AR"` declaration
- Next.js SSG for full crawlability and Core Web Vitals performance

### Target Keywords

- `anteojos recetados argentina`
- `anteojos de sol`
- `optica online argentina`
- `lentes de diseno`
- `anteojos de diseno argentinos`
- `marcos de anteojos`

### GEO (Generative Engine Optimization)

- Structured, crawlable content that AI systems can parse
- Clear entity relationships via schema markup
- Descriptive alt text on all product images
- FAQ-style content where appropriate

---

## 5. Technical Stack

| Layer        | Technology       |
|--------------|-----------------|
| Framework    | Next.js (App Router) |
| Database     | Supabase (PostgreSQL) |
| Styling      | Tailwind CSS     |
| Hosting      | Vercel           |
| CTA          | WhatsApp (number in env vars) |

### Environment Variables

```
NEXT_PUBLIC_WHATSAPP_NUMBER=<phone_number>
NEXT_PUBLIC_SUPABASE_URL=<supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>
```

---

## 6. Supabase Schema

### `products` table

| Column             | Type        | Notes                                      |
|--------------------|-------------|---------------------------------------------|
| `id`               | `uuid`      | Primary key, default `gen_random_uuid()`    |
| `name`             | `text`      | Product display name                        |
| `slug`             | `text`      | URL-safe identifier, unique                 |
| `description`      | `text`      | Full product description                    |
| `short_description`| `text`      | One-liner for cards and grids               |
| `is_exclusive`     | `boolean`   | `true` for featured editorial products      |
| `materials`        | `text`      | Frame materials                             |
| `lens_type`        | `text`      | e.g. "recetado", "sol", "multifocal"        |
| `available_colors` | `jsonb`     | Array of color options                      |
| `category`         | `text`      | e.g. "recetados", "sol"                     |
| `images`           | `jsonb`     | Array of image URLs                         |
| `display_order`    | `integer`   | Sort order for collection grid              |
| `seo_title`        | `text`      | Custom meta title                           |
| `seo_description`  | `text`      | Custom meta description                     |
| `created_at`       | `timestamptz` | Default `now()`                           |

### `site_content` table

| Column       | Type          | Notes                                          |
|--------------|---------------|-------------------------------------------------|
| `id`         | `uuid`        | Primary key, default `gen_random_uuid()`        |
| `key`        | `text`        | Unique identifier (e.g. `home.hero_subtitle`)   |
| `value`      | `text`        | The content value                               |
| `page`       | `text`        | Page group: `home`, `about`, `global`           |
| `label`      | `text`        | Human-readable field label for the admin UI     |
| `field_type` | `text`        | `short_text`, `long_text`, or `url`             |
| `sort_order` | `integer`     | Display order within each page group            |
| `updated_at` | `timestamptz` | Default `now()`, updated on every change        |

#### Default content keys

| Key                          | Page     | Label                    | Field Type   |
|------------------------------|----------|--------------------------|--------------|
| `home.hero_subtitle`         | `home`   | Hero Subtitle            | `short_text` |
| `home.exclusive_heading`     | `home`   | Exclusive Section Heading| `short_text` |
| `home.grid_heading`          | `home`   | Collection Grid Heading  | `short_text` |
| `home.brand_statement`       | `home`   | Brand Statement          | `long_text`  |
| `home.final_cta_message`     | `home`   | Final CTA Message        | `short_text` |
| `about.page_heading`         | `about`  | Page Heading             | `short_text` |
| `about.origin_story`         | `about`  | Origin Story             | `long_text`  |
| `about.values`               | `about`  | Values & Craftsmanship   | `long_text`  |
| `about.why_name`             | `about`  | Why "Warszawski"         | `long_text`  |
| `global.whatsapp_number`     | `global` | WhatsApp Number          | `short_text` |
| `global.instagram_url`       | `global` | Instagram URL            | `url`        |
| `global.footer_legal`        | `global` | Footer Legal Text        | `short_text` |

---

## 7. Admin Panel

### Overview

Single-page admin at `/admin`. Two views: **Products** and **Content**. Password-protected with a single admin password stored in an environment variable.

### Authentication

- Simple password gate — no user accounts
- Password stored in `ADMIN_PASSWORD` env var
- Session maintained via HTTP-only cookie or JWT

### Environment Variables (additions)

```
ADMIN_PASSWORD=<admin_password>
```

### Views

#### Product List (default view)

- Table displaying all products with columns: image thumbnail, name, category, lens type, exclusive badge, display order
- **Actions per row**: Edit (opens product form), Delete (with confirmation)
- **Reordering**: Up/down arrow buttons to change `display_order`
- **Top bar**: "Add Product" button, search/filter by category
- Sorted by `display_order` ascending

#### Product Form (create/edit)

Fields grouped into sections:

1. **Basic Info**: name, slug (auto-generated from name, editable), short description, description (textarea)
2. **Details**: materials, lens type (dropdown: recetado / sol / multifocal), category (dropdown: recetados / sol), available colors (tag input)
3. **Images**: Drag-and-drop upload area, uploads to Supabase Storage. Reorder images, set primary image, delete images.
4. **Display**: is_exclusive toggle, display_order (read-only, managed from list)
5. **SEO**: seo_title, seo_description (with character counters)

#### Content Editor

- Fields grouped by page: **Home**, **About**, **Global**
- Each field rendered based on `field_type`:
  - `short_text` → single-line input
  - `long_text` → textarea
  - `url` → URL input with validation
- "Save Changes" button per page group
- Visual indicator for unsaved changes
