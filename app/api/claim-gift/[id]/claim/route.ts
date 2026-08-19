import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { addressInfo, items } = body;

    if (!addressInfo?.name || !addressInfo?.phone || !addressInfo?.address || !addressInfo?.city || !addressInfo?.state || !addressInfo?.zip) {
      return NextResponse.json({ success: false, error: "Name, phone, address, city, state, and ZIP are all required." }, { status: 400 });
    }

    const updatePayload: { status: string; shipping_address: unknown; items?: unknown } = {
      status: "claimed",
      shipping_address: addressInfo,
    };
    if (Array.isArray(items) && items.length > 0) {
      updatePayload.items = items;
    }

    const supabase = getSupabaseAdmin();
    // Atomic claim: only succeeds if the order is still "paid" (unclaimed)
    // at the moment of update, guarding against a double-submit race.
    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .eq("status", "paid")
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    if (!data) {
      return NextResponse.json({ success: false, error: "This gift has already been claimed, or the link is invalid." }, { status: 409 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
