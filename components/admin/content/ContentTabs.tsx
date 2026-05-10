"use client";

import { useMemo, useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentSection } from "./ContentSection";
import { updateContentAction } from "@/actions/content";
import {
  SITE_CONTENT_FIELDS,
  type ContentField as ContentFieldDef,
} from "@/lib/content/keys";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  exclusive: "Sección Exclusiva",
  collection: "Colección",
  brand: "Brand Statement",
  cta: "CTA Final",
  origin: "Historia de Origen",
  values: "Valores",
  whatsapp: "WhatsApp",
  social: "Redes sociales",
};

function groupBySection(fields: ContentFieldDef[]) {
  const map = new Map<string, ContentFieldDef[]>();
  for (const f of fields) {
    if (!map.has(f.section)) map.set(f.section, []);
    map.get(f.section)!.push(f);
  }
  return Array.from(map.entries());
}

const HOME_FIELDS = SITE_CONTENT_FIELDS.filter((f) => f.page === "home");
const ABOUT_FIELDS = SITE_CONTENT_FIELDS.filter((f) => f.page === "about");
const CONTACT_FIELDS = SITE_CONTENT_FIELDS.filter((f) => f.page === "contact");

type Props = {
  initialValues: Record<string, string>;
};

export function ContentTabs({ initialValues }: Props) {
  const [values, setValues] = useState(initialValues);
  const [snapshot, setSnapshot] = useState(initialValues);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const dirtyKeys = useMemo(
    () => Object.keys(values).filter((k) => values[k] !== snapshot[k]),
    [values, snapshot],
  );
  const isDirty = dirtyKeys.length > 0;

  function setValue(key: string, value: string) {
    setJustSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    if (!isDirty) return;
    setError(null);
    const updates = dirtyKeys.map((key) => ({ key, value: values[key] }));
    startTransition(async () => {
      try {
        await updateContentAction(updates);
        setSnapshot(values);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2400);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error guardando");
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-ink">
            Contenido del sitio
          </h1>
          <p className="text-[13px] text-[#6B6B6B]">
            Editá los textos y enlaces que aparecen en la web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {error ? (
            <span className="text-[13px] text-red-700">{error}</span>
          ) : justSaved ? (
            <span className="text-[13px] text-[#3D7A4F]">Cambios guardados</span>
          ) : null}
          <button
            type="button"
            onClick={save}
            disabled={!isDirty || pending}
            className="flex h-10 items-center justify-center rounded-md bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-ink-soft disabled:opacity-40"
          >
            {pending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </header>

      <Tabs defaultValue="home" className="gap-6">
        <TabsList className="bg-transparent p-0">
          <TabsTrigger
            value="home"
            className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-sm text-[#6B6B6B] data-[state=active]:border-ink data-[state=active]:bg-transparent data-[state=active]:text-ink data-[state=active]:shadow-none"
          >
            Home
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-sm text-[#6B6B6B] data-[state=active]:border-ink data-[state=active]:bg-transparent data-[state=active]:text-ink data-[state=active]:shadow-none"
          >
            Nosotros
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-sm text-[#6B6B6B] data-[state=active]:border-ink data-[state=active]:bg-transparent data-[state=active]:text-ink data-[state=active]:shadow-none"
          >
            Contacto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="flex max-w-[720px] flex-col gap-10">
          {groupBySection(HOME_FIELDS).map(([section, fields]) => (
            <ContentSection
              key={section}
              title={SECTION_LABELS[section] ?? section}
              fields={fields}
              values={values}
              onChange={setValue}
            />
          ))}
        </TabsContent>

        <TabsContent value="about" className="flex max-w-[720px] flex-col gap-10">
          {groupBySection(ABOUT_FIELDS).map(([section, fields]) => (
            <ContentSection
              key={section}
              title={SECTION_LABELS[section] ?? section}
              fields={fields}
              values={values}
              onChange={setValue}
            />
          ))}
        </TabsContent>

        <TabsContent value="contact" className="flex max-w-[720px] flex-col gap-10">
          <p className="-mb-4 max-w-[560px] text-[13px] text-[#6B6B6B]">
            Si dejás un campo vacío, esa red social no se muestra en el sitio público.
            El WhatsApp es el único requerido para que funcionen los CTAs.
          </p>
          {groupBySection(CONTACT_FIELDS).map(([section, fields]) => (
            <ContentSection
              key={section}
              title={SECTION_LABELS[section] ?? section}
              fields={fields}
              values={values}
              onChange={setValue}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
