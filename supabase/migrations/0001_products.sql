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

create policy "products read" on products
  for select using (true);
