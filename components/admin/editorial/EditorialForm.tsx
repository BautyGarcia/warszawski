"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Field, Textarea } from "@/components/admin/ui/Field";
import { FormSection } from "@/components/admin/ui/SectionHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageField } from "@/components/admin/content/ImageField";
import {
  editorialSchema,
  type EditorialFormValues,
} from "@/schemas/editorial";
import { createPostAction, updatePostAction } from "@/actions/editorial";
import { slugify } from "@/lib/products/slug";
import type { EditorialPost } from "@/types/editorial";

const EMPTY: EditorialFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  author_name: "Warszawski",
  published: false,
  seo_title: "",
  seo_description: "",
};

function toInput(p: EditorialPost): EditorialFormValues {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    content: p.content,
    cover_image: p.cover_image ?? "",
    author_name: p.author_name,
    published: p.published,
    seo_title: p.seo_title ?? "",
    seo_description: p.seo_description ?? "",
  };
}

type Props = { mode: "create" } | { mode: "edit"; post: EditorialPost };

export function EditorialForm(props: Props) {
  const isEdit = props.mode === "edit";
  const defaults = isEdit ? toInput(props.post) : EMPTY;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditorialFormValues>({
    resolver: zodResolver(editorialSchema),
    defaultValues: defaults,
  });

  const [pending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const title = watch("title");
  const slug = watch("slug");
  const excerpt = watch("excerpt") ?? "";
  const seoTitle = watch("seo_title") ?? "";
  const seoDesc = watch("seo_description") ?? "";

  const onSubmit = handleSubmit((values) => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updatePostAction(props.post.id, values);
        } else {
          await createPostAction(values);
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) return;
        setSubmitError(err instanceof Error ? err.message : "Error al guardar");
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex max-w-[720px] flex-col gap-10">
      <FormSection title="Contenido">
        <Field
          label="Título"
          placeholder="Guía de elección de marco"
          error={errors.title?.message}
          {...register("title", {
            onBlur: () => {
              if (!slug && title) setValue("slug", slugify(title));
            },
          })}
        />
        <Field
          label="Slug"
          placeholder="guia-de-eleccion-de-marco"
          hint="URL-safe. Letras minúsculas, números y guiones."
          error={errors.slug?.message}
          {...register("slug")}
        />
        <Textarea
          label="Resumen"
          rows={2}
          placeholder="Aparece en cards y en preview de redes."
          hint={`${excerpt.length}/220 caracteres`}
          maxLength={220}
          error={errors.excerpt?.message}
          {...register("excerpt")}
        />
        <Textarea
          label="Contenido"
          rows={16}
          placeholder="Separá los párrafos con una línea en blanco."
          error={errors.content?.message}
          {...register("content")}
        />
      </FormSection>

      <FormSection title="Imagen de portada">
        <Controller
          control={control}
          name="cover_image"
          render={({ field }) => (
            <ImageField value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </FormSection>

      <FormSection title="Publicación">
        <Field
          label="Autor"
          placeholder="Warszawski"
          {...register("author_name")}
        />
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className="mt-0.5"
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] font-medium text-ink">Publicada</span>
                <span className="text-[12px] text-[#6B6B6B]">
                  Marcala para que aparezca en /editorial. Sin marcar queda como borrador (solo visible en el admin).
                </span>
              </span>
            </label>
          )}
        />
      </FormSection>

      <FormSection title="SEO">
        <Field
          label="Meta title"
          placeholder={title || "Título de la nota"}
          hint={`${seoTitle.length}/70 caracteres`}
          maxLength={70}
          error={errors.seo_title?.message}
          {...register("seo_title")}
        />
        <Textarea
          label="Meta description"
          rows={2}
          maxLength={160}
          hint={`${seoDesc.length}/160 caracteres`}
          error={errors.seo_description?.message}
          {...register("seo_description")}
        />
      </FormSection>

      {submitError ? (
        <p className="text-[13px] text-red-700" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex h-10 items-center justify-center rounded-md bg-ink px-6 text-sm font-medium text-white transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear nota"}
        </button>
        <Link
          href="/admin/editorial"
          className="flex h-10 items-center rounded-md border border-black/10 px-5 text-sm text-ink transition-colors hover:border-ink/30"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
