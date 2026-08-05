import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = getSupabaseAdmin();
    const [{ data: campaign, error: campaignError }, { data: products, error: productsError }, { data: codes, error: codesError }] = await Promise.all([
      supabase.from("corporate_campaigns").select("*").eq("id", id).single(),
      supabase.from("campaign_products").select("*").eq("campaign_id", id).order("display_order"),
      supabase.from("campaign_codes").select("*").eq("campaign_id", id).order("created_at"),
    ]);
    if (campaignError) return NextResponse.json({ success: false, error: campaignError.message }, { status: 400 });
    if (productsError) return NextResponse.json({ success: false, error: productsError.message }, { status: 400 });
    if (codesError) return NextResponse.json({ success: false, error: codesError.message }, { status: 400 });

    return NextResponse.json({
      success: true,
      campaign: { ...campaign, products: products || [], codes: codes || [] },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, logo_url, is_active } = body;
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (logo_url !== undefined) update.logo_url = logo_url || null;
    if (is_active !== undefined) update.is_active = is_active;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("corporate_campaigns").update(update).eq("id", id).select().single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, campaign: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("corporate_campaigns").delete().eq("id", id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
