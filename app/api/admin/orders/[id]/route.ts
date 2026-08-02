import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { status } = body;
    if (!status || !["pending", "paid", "shipped", "claimed"].includes(status)) {
      return NextResponse.json({ success: false, error: "A valid status is required." }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
