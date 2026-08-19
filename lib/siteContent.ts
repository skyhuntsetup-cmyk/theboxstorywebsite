"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import siteContentFallback from "../data/site-content.json";

export interface SiteContentField {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  value: string;
}

// Module-level cache so every component calling useSiteContent() shares one
// fetch instead of each re-querying Supabase on mount.
let cachedFields: SiteContentField[] | null = null;

/** Live-editable site copy, backed by the `site_config` table (admin panel
 * writes to it via /api/admin/save-config). Renders instantly from the
 * build-time JSON fallback, then swaps in the live value once fetched —
 * so a redeploy is never required to see an admin edit, but the site still
 * works if the fetch fails. */
export function useSiteContent() {
  const [fields, setFields] = useState<SiteContentField[]>(cachedFields ?? (siteContentFallback.fields as SiteContentField[]));

  useEffect(() => {
    if (cachedFields) return; // already resolved by an earlier instance of this hook
    let active = true;
    supabase
      .from("site_config")
      .select("data")
      .eq("type", "site-content")
      .maybeSingle()
      .then(({ data }) => {
        const liveFields = (data?.data as { fields?: SiteContentField[] } | undefined)?.fields;
        if (active && liveFields) {
          cachedFields = liveFields;
          setFields(liveFields);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const getContent = (key: string, fallback = "") => fields.find((f) => f.key === key)?.value ?? fallback;
  return { getContent };
}
