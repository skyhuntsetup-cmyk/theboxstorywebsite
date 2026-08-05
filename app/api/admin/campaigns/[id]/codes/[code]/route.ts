import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../../../lib/supabaseAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; code: string }> }) {
  const { id, code } = await params;
  try {
    const body = await req.json();
    const { fulfillment_status } = body;
    if (!["pending", "shipped"].includes(fulfillment_status)) {
      return NextResponse.json({ success: false, error: "A valid fulfillment status is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("campaign_codes")
      .update({ fulfillment_status })
      .eq("code", code)
      .eq("campaign_id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, redemption: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
