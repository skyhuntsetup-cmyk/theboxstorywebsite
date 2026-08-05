import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import type { CustomFieldDef } from "../../../../lib/types";

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
    const body = await req.json();
    const {
      code,
      selectedProductId,
      recipientName,
      recipientPhone,
      recipientEmail,
      shippingAddress,
      customFieldAnswers,
    } = body;

    if (!code || !recipientName || !recipientPhone || !shippingAddress?.address || !shippingAddress?.city) {
      return NextResponse.json({ success: false, error: "Name, phone, and delivery address are required." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const normalizedCode = String(code).trim().toUpperCase();

    const { data: codeRow } = await supabase
      .from("campaign_codes")
      .select("code, campaign_id, is_redeemed")
      .eq("code", normalizedCode)
      .maybeSingle();
    if (!codeRow) {
      return NextResponse.json({ success: false, error: "That code wasn't recognized." }, { status: 404 });
    }
    if (codeRow.is_redeemed) {
      return NextResponse.json({ success: false, error: "This code has already been redeemed." }, { status: 409 });
    }

    const { data: campaign } = await supabase
      .from("corporate_campaigns")
      .select("campaign_type, custom_fields, is_active")
      .eq("id", codeRow.campaign_id)
      .single();
    if (!campaign || !campaign.is_active) {
      return NextResponse.json({ success: false, error: "This campaign is no longer active." }, { status: 410 });
    }
    if (campaign.campaign_type === "choice" && !selectedProductId) {
      return NextResponse.json({ success: false, error: "Please select a hamper option." }, { status: 400 });
    }

    const fieldDefs: CustomFieldDef[] = campaign.custom_fields || [];
    for (const field of fieldDefs) {
      if (field.required && !customFieldAnswers?.[field.key]) {
        return NextResponse.json({ success: false, error: `"${field.label}" is required.` }, { status: 400 });
      }
    }

    let productIdToStore: string | null = selectedProductId || null;
    if (campaign.campaign_type === "single") {
      const { data: onlyProduct } = await supabase
        .from("campaign_products")
        .select("id")
        .eq("campaign_id", codeRow.campaign_id)
        .single();
      productIdToStore = onlyProduct?.id || null;
    }

    // Atomic claim: only succeeds if the code is still unredeemed at the
    // moment of the update, guarding against a double-submit race between
    // two concurrent requests for the same code.
    const { data: updated, error: updateError } = await supabase
      .from("campaign_codes")
      .update({
        is_redeemed: true,
        redeemed_at: new Date().toISOString(),
        selected_product_id: productIdToStore,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        recipient_email: recipientEmail || null,
        shipping_address: shippingAddress,
        custom_field_answers: customFieldAnswers || {},
      })
      .eq("code", normalizedCode)
      .eq("is_redeemed", false)
      .select()
      .maybeSingle();

    if (updateError) return NextResponse.json({ success: false, error: updateError.message }, { status: 400 });
    if (!updated) {
      return NextResponse.json({ success: false, error: "This code has already been redeemed." }, { status: 409 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
