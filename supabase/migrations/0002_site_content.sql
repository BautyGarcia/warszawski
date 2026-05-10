create table site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  page text not null check (page in ('home','about')),
  section text not null,
  label text not null,
  field_type text not null check (field_type in ('short_text','long_text','url')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index site_content_page_idx on site_content(page, sort_order);

alter table site_content enable row level security;

create policy "site_content read" on site_content
  for select using (true);
