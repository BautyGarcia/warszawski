-- Permitir 'list' como field_type (JSON array de strings).
alter table site_content drop constraint if exists site_content_field_type_check;
alter table site_content add constraint site_content_field_type_check
  check (field_type in ('short_text', 'long_text', 'url', 'image', 'list'));

-- Insertar las nuevas keys de lista con default vacio.
insert into site_content (key, value, page, section, label, field_type, sort_order) values
  ('contact.whatsapp.numbers', '[]', 'contact', 'whatsapp', 'Numeros de WhatsApp', 'list', 1),
  ('contact.address.list', '[]', 'contact', 'address', 'Direcciones de oficinas', 'list', 5)
on conflict (key) do nothing;

-- Backfill desde las keys singulares anteriores (preserva la data existente).
do $$
declare
  old_phone text;
  old_address text;
begin
  select value into old_phone from site_content where key = 'contact.whatsapp.number';
  select value into old_address from site_content where key = 'contact.address.full';

  if old_phone is not null and old_phone != '' then
    update site_content
    set value = jsonb_build_array(old_phone)::text
    where key = 'contact.whatsapp.numbers' and value = '[]';
  end if;

  if old_address is not null and old_address != '' then
    update site_content
    set value = jsonb_build_array(old_address)::text
    where key = 'contact.address.list' and value = '[]';
  end if;
end $$;

-- Eliminar las keys viejas singulares (ya migradas a la lista).
delete from site_content where key in ('contact.whatsapp.number', 'contact.address.full');
