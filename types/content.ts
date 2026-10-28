export type ContentMap = Record<string, string>;

/** Paginas con contenido editable desde el backoffice. */
export type ContentPage = "home" | "about" | "wholesale" | "contact";

export type ContentRow = {
  id: string;
  key: string;
  value: string;
  page: ContentPage;
  section: string;
  label: string;
  field_type: "short_text" | "long_text" | "url" | "image";
  sort_order: number;
  updated_at: string;
};
