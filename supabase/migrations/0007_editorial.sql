create table editorial_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_image text,
  author_name text not null default 'Warszawski',
  published boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index editorial_posts_published_at_idx on editorial_posts(published_at desc) where published;
create index editorial_posts_slug_idx on editorial_posts(slug);

alter table editorial_posts enable row level security;

create policy "editorial public read" on editorial_posts
  for select using (published = true);
