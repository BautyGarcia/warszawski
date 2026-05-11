export type ContentMap = Record<string, string>;

export type ContentRow = {
  id: string;
  key: string;
  value: string;
  page: "home" | "about" | "contact";
  section: string;
  label: string;
  field_type: "short_text" | "long_text" | "url" | "image";
  sort_order: number;
  updated_at: string;
};
