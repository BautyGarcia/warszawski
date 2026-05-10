"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Field, Textarea } from "@/components/admin/ui/Field";
import { SelectField } from "@/components/admin/ui/SelectField";
import { FormSection } from "@/components/admin/ui/SectionHeader";
import { ColorTagInput } from "./ColorTagInput";
import { ImageUploader } from "./ImageUploader";
import { productSchema, type ProductFormValues } from "@/schemas/product";
import { createProductAction, updateProductAction } from "@/actions/products";
import { slugify } from "@/lib/products/slug";
import type { Product } from "@/types/product";

const EMPTY: ProductFormValues = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  materials: "",
  lens_type: null,
  category: null,
  available_colors: [],
  images: [],
  is_exclusive: false,
  seo_title: "",
  seo_description: "",
};

function toInput(p: Product): ProductFormValues {
  return {
    name: p.name,
    slug: p.slug,
    short_description: p.short_description ?? "",
    description: p.description ?? "",
    materials: p.materials ?? "",
    lens_type: p.lens_type,
    category: p.category,
    available_colors: p.available_colors,
    images: p.images,
    is_exclusive: p.is_exclusive,
    seo_title: p.seo_title ?? "",
    seo_description: p.seo_description ?? "",
  };
}

type Props = { mode: "create" } | { mode: "edit"; product: Product };

export function ProductForm(props: Props) {
  const isEdit = props.mode === "edit";
  const defaults = isEdit ? toInput(props.product) : EMPTY;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaults,
  });

  const [pending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const name = watch("name");
  const slug = watch("slug");

  const onSubmit = handleSubmit((values) => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updateProductAction(props.product.id, values);
        } else {
          await createProductAction(values);
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) return;
        setSubmitError(err instanceof Error ? err.message : "Error al guardar");
      }
    });
  });

  const seoTitle = watch("seo_title") ?? "";
  const seoDesc = watch("seo_description") ?? "";

  return (
    <form onSubmit={onSubmit} className="flex max-w-[720px] flex-col gap-10">
      <FormSection title="Información básica">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Nombre"
            placeholder="Aurora"
            error={errors.name?.message}
            {...register("name", {
              onBlur: () => {
                if (!slug && name) setValue("slug", slugify(name));
              },
            })}
          />
          <Field
            label="Slug"
            placeholder="aurora"
            hint="URL-safe. Letras minúsculas, números y guiones."
            error={errors.slug?.message}
            {...register("slug")}
          />
        </div>
        <Field
          label="Descripción corta"
          placeholder="Recetado — Acetato negro"
          hint="Aparece en cards y listados."
          error={errors.short_description?.message}
          {...register("short_description")}
        />
        <Textarea
          label="Descripción completa"
          rows={4}
          placeholder="Detalle del modelo, materiales, ocasiones de uso..."
          error={errors.description?.message}
          {...register("description")}
        />
      </FormSection>

      <FormSection title="Detalles">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field
            label="Materiales"
            placeholder="Acetato italiano"
            error={errors.materials?.message}
            {...register("materials")}
          />
          <Controller
            control={control}
            name="lens_type"
            render={({ field }) => (
              <SelectField
                label="Tipo de lente"
                value={field.value ?? null}
                onChange={field.onChange}
                error={errors.lens_type?.message}
                options={[
                  { value: "recetado", label: "Recetado" },
                  { value: "sol", label: "Sol" },
                  { value: "multifocal", label: "Multifocal" },
                ]}
              />
            )}
          />
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <SelectField
                label="Categoría"
                value={field.value ?? null}
                onChange={field.onChange}
                error={errors.category?.message}
                options={[
                  { value: "recetados", label: "Recetados" },
                  { value: "sol", label: "Sol" },
                ]}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-ink">Colores disponibles</span>
          <Controller
            control={control}
            name="available_colors"
            render={({ field }) => (
              <ColorTagInput value={field.value ?? []} onChange={field.onChange} />
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Imágenes">
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImageUploader value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </FormSection>

      <FormSection title="Visualización">
        <Controller
          control={control}
          name="is_exclusive"
          render={({ field }) => (
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={field.value ?? false}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-1 size-4 rounded border-black/20 accent-ink"
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] font-medium text-ink">Producto exclusivo</span>
                <span className="text-[12px] text-[#6B6B6B]">
                  Se muestra en la sección destacada del home con su propio bloque.
                </span>
              </span>
            </label>
          )}
        />
      </FormSection>

      <FormSection title="SEO">
        <Field
          label="Meta title"
          placeholder={`${name || "Aurora"} — Warszawski`}
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
          {pending ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
        <Link
          href="/admin/productos"
          className="flex h-10 items-center rounded-md border border-black/10 px-5 text-sm text-ink transition-colors hover:border-ink/30"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
