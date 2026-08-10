-- Sección de reportes de Google Ads.
-- Los datos los escribe un job externo (tools/gads/push_to_supabase.py) con la
-- service role key. La web los lee SOLO desde Server Components con la service
-- role (que bypassea RLS). RLS queda habilitado SIN políticas de select para
-- anon: nadie puede leer estas tablas con la anon key. Datos privados.

-- Métricas diarias (una fila por día). El job hace upsert por `date`.
create table ads_daily (
  date         date primary key,
  impressions  integer not null default 0,
  clicks       integer not null default 0,
  cost         numeric not null default 0,   -- ARS, ya convertido
  conversions  numeric not null default 0
);

alter table ads_daily enable row level security;
-- Sin policy de select: anon denegado. Service role bypassea RLS.

-- Metadatos del reporte (fila única): top de fuentes de consulta + timestamp.
create table ads_meta (
  id           integer primary key default 1,
  top_sources  jsonb not null default '[]'::jsonb,  -- [{label, conversions}]
  updated_at   timestamptz not null default now(),
  constraint ads_meta_singleton check (id = 1)
);

alter table ads_meta enable row level security;

insert into ads_meta (id) values (1) on conflict (id) do nothing;
