import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

// Shared in-memory rate limiter, same pattern as /api/admin/login and
// /api/catalogue: this is a public, unauthenticated endpoint, so it needs a
// coarse guard against someone brute-forcing codes.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 20;
const WINDOW_MS = 5 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many attempts, try again shortly." }, { status: 429 });
  }

  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "A code is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: codeRow } = await supabase
      .from("campaign_codes")
      .select("code, campaign_id, is_redeemed")
      .eq("code", code.trim().toUpperCase())
      .maybeSingle();

    if (!codeRow) {
      return NextResponse.json({ success: false, error: "That code wasn't recognized. Double-check and try again." }, { status: 404 });
    }
    if (codeRow.is_redeemed) {
      return NextResponse.json({ success: false, error: "This code has already been redeemed." }, { status: 409 });
    }

    const { data: campaign } = await supabase
      .from("corporate_campaigns")
      .select("id, name, logo_url, campaign_type, custom_fields, is_active")
      .eq("id", codeRow.campaign_id)
      .single();
    if (!campaign || !campaign.is_active) {
      return NextResponse.json({ success: false, error: "This campaign is no longer active." }, { status: 410 });
    }

    const { data: products } = await supabase
      .from("campaign_products")
      .select("id, name, description, image_url")
      .eq("campaign_id", campaign.id)
      .order("display_order");

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        logo_url: campaign.logo_url,
        campaign_type: campaign.campaign_type,
        custom_fields: campaign.custom_fields,
      },
      products: products || [],
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
