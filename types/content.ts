export type ContentMap = Record<string, string>;

export type ContentRow = {
  id: string;
  key: string;
  value: string;
  page: "home" | "about";
  section: string;
  label: string;
  field_type: "short_text" | "long_text" | "url";
  sort_order: number;
  updated_at: string;
};
