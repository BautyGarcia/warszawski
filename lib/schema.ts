// App tables (imported from Supabase; column keys keep the snake_case names the app types use).
// better-auth's tables live in ./auth-schema.ts (regenerate with `npm run auth:schema`).
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  customType,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import type { ProductColor, ProductImage } from "@/types/product";

/** timestamptz read back as an ISO 8601 string (what the app types and JSON-LD expect). */
const timestamptz = customType<{ data: string; driverData: string }>({
  dataType() {
    return "timestamp with time zone";
  },
  fromDriver(value) {
    return new Date(value).toISOString();
  },
});

export const products = pgTable(
  "products",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    slug: text().notNull(),
    description: text(),
    short_description: text(),
    is_exclusive: boolean().default(false).notNull(),
    materials: text(),
    lens_type: text().$type<"recetado" | "sol" | "multifocal">(),
    available_colors: jsonb().$type<ProductColor[]>().default([]).notNull(),
    category: text().$type<"recetados" | "sol">(),
    images: jsonb().$type<ProductImage[]>().default([]).notNull(),
    display_order: integer().default(0).notNull(),
    seo_title: text(),
    seo_description: text(),
    created_at: timestamptz().default(sql`now()`).notNull(),
  },
  (t) => [
    unique("products_slug_key").on(t.slug),
    index("products_display_order_idx").on(t.display_order),
    index("products_is_exclusive_idx").on(t.is_exclusive).where(sql`is_exclusive`),
    check("products_category_check", sql`${t.category} = ANY (ARRAY['recetados'::text, 'sol'::text])`),
    check(
      "products_lens_type_check",
      sql`${t.lens_type} = ANY (ARRAY['recetado'::text, 'sol'::text, 'multifocal'::text])`,
    ),
  ],
);

export const editorial_posts = pgTable(
  "editorial_posts",
  {
    id: uuid().defaultRandom().primaryKey(),
    slug: text().notNull(),
    title: text().notNull(),
    excerpt: text(),
    content: text().default("").notNull(),
    cover_image: text(),
    author_name: text().default("Warszawski").notNull(),
    published: boolean().default(false).notNull(),
    published_at: timestamptz(),
    seo_title: text(),
    seo_description: text(),
    created_at: timestamptz().default(sql`now()`).notNull(),
    updated_at: timestamptz().default(sql`now()`).notNull(),
  },
  (t) => [
    unique("editorial_posts_slug_key").on(t.slug),
    index("editorial_posts_slug_idx").on(t.slug),
    index("editorial_posts_published_at_idx").on(t.published_at.desc()).where(sql`published`),
  ],
);

export const site_content = pgTable(
  "site_content",
  {
    id: uuid().defaultRandom().primaryKey(),
    key: text().notNull(),
    value: text().default("").notNull(),
    page: text().$type<"home" | "about" | "contact">().notNull(),
    section: text().notNull(),
    label: text().notNull(),
    field_type: text()
      .$type<"short_text" | "long_text" | "url" | "image" | "list" | "address_list">()
      .notNull(),
    sort_order: integer().default(0).notNull(),
    updated_at: timestamptz().default(sql`now()`).notNull(),
  },
  (t) => [
    unique("site_content_key_key").on(t.key),
    index("site_content_page_idx").on(t.page, t.sort_order),
    check(
      "site_content_field_type_check",
      sql`${t.field_type} = ANY (ARRAY['short_text'::text, 'long_text'::text, 'url'::text, 'image'::text, 'list'::text, 'address_list'::text])`,
    ),
    check("site_content_page_check", sql`${t.page} = ANY (ARRAY['home'::text, 'about'::text, 'contact'::text])`),
  ],
);

// Written by tools/gads/push_to_supabase.py (Google Ads ingest); read by /admin/reportes and /r/[token].
export const ads_daily = pgTable("ads_daily", {
  date: date().primaryKey(),
  impressions: integer().default(0).notNull(),
  clicks: integer().default(0).notNull(),
  cost: numeric().default("0").notNull(),
  conversions: numeric().default("0").notNull(),
});

export const ads_meta = pgTable(
  "ads_meta",
  {
    id: integer().default(1).primaryKey(),
    top_sources: jsonb().$type<{ label: string; conversions: number }[]>().default([]).notNull(),
    updated_at: timestamptz().default(sql`now()`).notNull(),
  },
  (t) => [check("ads_meta_singleton", sql`${t.id} = 1`)],
);
