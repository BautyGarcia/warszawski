-- Permitir 'image' como field_type en site_content.
alter table site_content drop constraint if exists site_content_field_type_check;
alter table site_content add constraint site_content_field_type_check
  check (field_type in ('short_text', 'long_text', 'url', 'image'));

-- Hacemos lugar al inicio de la seccion origin de about (sort_order 3)
-- shifteando los fields posteriores del about. Idempotente: solo corre la
-- primera vez (cuando todavia no existe la key).
do $$
begin
  if not exists (select 1 from site_content where key = 'about.origin.image') then
    update site_content
      set sort_order = sort_order + 1
      where page = 'about' and sort_order >= 3;
  end if;
end $$;

insert into site_content (key, value, page, section, label, field_type, sort_order) values
  ('about.origin.image', '', 'about', 'origin', 'Imagen de la historia', 'image', 3)
on conflict (key) do nothing;
