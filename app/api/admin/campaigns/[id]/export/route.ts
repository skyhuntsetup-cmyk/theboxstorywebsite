import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../../lib/supabaseAdmin";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = getSupabaseAdmin();
    const [{ data: campaign }, { data: products }, { data: codes, error }] = await Promise.all([
      supabase.from("corporate_campaigns").select("name, custom_fields").eq("id", id).single(),
      supabase.from("campaign_products").select("id, name").eq("campaign_id", id),
      supabase.from("campaign_codes").select("*").eq("campaign_id", id).eq("is_redeemed", true).order("redeemed_at"),
    ]);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });

    const productNameById = new Map((products || []).map((p) => [p.id, p.name]));
    const customFieldDefs: { key: string; label: string }[] = campaign?.custom_fields || [];

    const headers = [
      "Code", "Redeemed At", "Name", "Phone", "Email", "Product",
      "Address", "City", "State", "ZIP", "Fulfillment Status",
      ...customFieldDefs.map((f) => f.label),
    ];

    const rows = (codes || []).map((c) => {
      const addr = (c.shipping_address || {}) as Record<string, string>;
      const answers = (c.custom_field_answers || {}) as Record<string, string>;
      return [
        c.code,
        c.redeemed_at || "",
        c.recipient_name || "",
        c.recipient_phone || "",
        c.recipient_email || "",
        c.selected_product_id ? (productNameById.get(c.selected_product_id) || "") : "",
        addr.address || "",
        addr.city || "",
        addr.state || "",
        addr.zip || "",
        c.fulfillment_status,
        ...customFieldDefs.map((f) => answers[f.key] || ""),
      ];
    });

    const csv = [headers, ...rows].map((row) => row.map((cell) => csvEscape(String(cell))).join(",")).join("\n");
    const filename = `${(campaign?.name || "campaign").replace(/[^a-zA-Z0-9]+/g, "-")}-redemptions.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
