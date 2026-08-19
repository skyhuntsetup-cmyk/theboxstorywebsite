import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type !== "past-work" && type !== "site-content") {
      return NextResponse.json({ success: false, error: "Invalid configuration type" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("site_config").select("data").eq("type", type).maybeSingle();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ success: false, error: `No config found for type "${type}"` }, { status: 404 });

    return NextResponse.json({ success: true, config: data.data });
  } catch (error) {
    console.error("Get config error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
