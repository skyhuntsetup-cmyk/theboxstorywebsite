import siteContentData from "../data/site-content.json";

export interface SiteContentField {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  value: string;
}

/** Look up an editable content field's current value by key, with a fallback if it's ever missing. */
export function getContent(key: string, fallback = ""): string {
  const field = (siteContentData.fields as SiteContentField[]).find((f) => f.key === key);
  return field?.value ?? fallback;
}
