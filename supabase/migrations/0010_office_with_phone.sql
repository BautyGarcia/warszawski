-- Permitir 'address_list' como field_type (JSON array de objetos {address, phone}).
alter table site_content drop constraint if exists site_content_field_type_check;
alter table site_content add constraint site_content_field_type_check
  check (field_type in ('short_text', 'long_text', 'url', 'image', 'list', 'address_list'));

-- Restaurar el campo singular de WhatsApp (uno fijo).
insert into site_content (key, value, page, section, label, field_type, sort_order) values
  ('contact.whatsapp.number', '', 'contact', 'whatsapp', 'Numero de WhatsApp', 'short_text', 1)
on conflict (key) do nothing;

-- Backfill: tomar el primer numero del array `contact.whatsapp.numbers` si existe.
do $$
declare
  numbers_value jsonb;
  first_number text;
begin
  select value::jsonb into numbers_value
    from site_content where key = 'contact.whatsapp.numbers';
  if numbers_value is not null
     and jsonb_typeof(numbers_value) = 'array'
     and jsonb_array_length(numbers_value) > 0 then
    first_number := numbers_value->>0;
    if first_number is not null and first_number != '' then
      update site_content
      set value = first_number
      where key = 'contact.whatsapp.number'
        and (value is null or value = '');
    end if;
  end if;
end $$;

-- Borrar la key plural (ya migrada).
delete from site_content where key = 'contact.whatsapp.numbers';

-- Convertir contact.address.list de string[] a {address, phone}[].
-- Cambia tambien el field_type a 'address_list'.
do $$
declare
  current_value jsonb;
  new_value jsonb := '[]'::jsonb;
  item jsonb;
begin
  select value::jsonb into current_value
    from site_content where key = 'contact.address.list';
  if current_value is null or jsonb_typeof(current_value) != 'array' then
    return;
  end if;

  for item in select * from jsonb_array_elements(current_value) loop
    if jsonb_typeof(item) = 'string' then
      -- Wrap el string en un objeto {address, phone=""}
      new_value := new_value || jsonb_build_array(
        jsonb_build_object('address', item #>> '{}', 'phone', '')
      );
    elsif jsonb_typeof(item) = 'object' then
      -- Ya es objeto: lo dejamos como esta (idempotente).
      new_value := new_value || jsonb_build_array(item);
    end if;
  end loop;

  update site_content
  set value = new_value::text,
      field_type = 'address_list',
      label = 'Oficinas'
  where key = 'contact.address.list';
end $$;
