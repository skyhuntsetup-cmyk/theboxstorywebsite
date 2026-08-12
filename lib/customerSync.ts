import { getSupabaseAdmin } from "./supabaseAdmin";

/** Strips everything but digits and keeps the last 10 — the same rule the
 * one-time SQL backfill in supabase-schema.sql uses, so both agree on what
 * counts as "the same phone number" regardless of +91/spacing differences. */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return digits.slice(-10);
}

interface SyncFields {
  phone: string | null | undefined;
  name?: string | null;
  email?: string | null;
  company?: string | null;
}

/** Best-effort upsert into `customers`, called after a primary action (an
 * order, inquiry, etc.) has already succeeded — never throws, since a sync
 * failure shouldn't block the user-facing action it's attached to. Merges
 * rather than overwrites, so a later event with fewer fields doesn't blank
 * out a name/email/company learned from an earlier one. */
export async function syncCustomer(fields: SyncFields): Promise<void> {
  const phone = normalizePhone(fields.phone);
  if (!phone) return;

  try {
    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase
      .from("customers")
      .select("id, name, email, company")
      .eq("phone", phone)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("customers")
        .update({
          name: fields.name || existing.name,
          email: fields.email || existing.email,
          company: fields.company || existing.company,
          updated_at: new Date().toISOString(),
        })
        .eq("phone", phone);
    } else {
      await supabase.from("customers").insert([{
        phone,
        name: fields.name || null,
        email: fields.email || null,
        company: fields.company || null,
      }]);
    }
  } catch (err) {
    console.error("syncCustomer failed (non-blocking):", err);
  }
}
