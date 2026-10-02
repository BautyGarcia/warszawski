-- Locales con nombre + link de Google Maps propio.
-- Cada entrada de contact.address.list pasa de {address, phone} a
-- {name, address, phone, mapsUrl}. No cambia el schema: value es JSON en texto.
--
-- Backfill: el primer local (el showroom) toma el link que antes vivia en la
-- key suelta contact.whatsapp.maps (o, si nunca se guardo, el default que
-- tenia el codigo) y el nombre "Showroom". El resto queda con name/mapsUrl
-- vacios hasta que se carguen desde el admin. Idempotente: no pisa valores
-- ya cargados.
do $$
declare
  current_value jsonb;
  legacy_maps text;
  new_value jsonb := '[]'::jsonb;
  item jsonb;
  idx integer := 0;
begin
  select value::jsonb into current_value
    from site_content where key = 'contact.address.list';
  if current_value is null or jsonb_typeof(current_value) != 'array' then
    return;
  end if;

  select nullif(trim(value), '') into legacy_maps
    from site_content where key = 'contact.whatsapp.maps';
  legacy_maps := coalesce(
    legacy_maps,
    'https://www.google.com/maps/place/Montevideo+536,+C1019ABL+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.6025739,-58.389679,16z/data=!3m1!4b1!4m6!3m5!1s0x95bccac1265e5245:0xe109fa22d96fdd68!8m2!3d-34.6025739!4d-58.389679!16s%2Fg%2F11q2x8287_?entry=ttu'
  );

  for item in select * from jsonb_array_elements(current_value) loop
    if jsonb_typeof(item) = 'object' then
      item := jsonb_build_object(
        'name', coalesce(nullif(item->>'name', ''), case when idx = 0 then 'Showroom' else '' end),
        'address', coalesce(item->>'address', ''),
        'phone', coalesce(item->>'phone', ''),
        'mapsUrl', coalesce(nullif(item->>'mapsUrl', ''), case when idx = 0 then legacy_maps else '' end)
      );
    end if;
    new_value := new_value || jsonb_build_array(item);
    idx := idx + 1;
  end loop;

  update site_content
  set value = new_value::text,
      label = 'Locales'
  where key = 'contact.address.list';
end $$;

-- La key suelta ya no se usa (el link vive en cada local).
delete from site_content where key = 'contact.whatsapp.maps';
