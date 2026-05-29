-- Direccion de la oficina (editable desde admin Contacto)
insert into site_content (key, value, page, section, label, field_type, sort_order) values
  ('contact.address.full', 'Montevideo 536 1A, Capital Federal', 'contact', 'address', 'Direccion de la oficina', 'short_text', 5)
on conflict (key) do nothing;
