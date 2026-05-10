-- Permitir 'contact' como page válida en site_content.
alter table site_content drop constraint if exists site_content_page_check;
alter table site_content add constraint site_content_page_check
  check (page in ('home', 'about', 'contact'));

-- Seed inicial (valores vacíos a propósito: el sitio público oculta
-- las redes sin URL configurada).
insert into site_content (key, value, page, section, label, field_type, sort_order) values
  ('contact.whatsapp.number', '', 'contact', 'whatsapp', 'Numero de WhatsApp', 'short_text', 1),
  ('contact.social.instagram', '', 'contact', 'social', 'URL de Instagram', 'url', 2),
  ('contact.social.facebook', '', 'contact', 'social', 'URL de Facebook', 'url', 3),
  ('contact.social.tiktok', '', 'contact', 'social', 'URL de TikTok', 'url', 4)
on conflict (key) do nothing;
