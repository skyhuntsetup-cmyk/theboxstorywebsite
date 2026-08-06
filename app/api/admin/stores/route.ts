import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("display_order");
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, stores: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, tagline, description, hero_image, display_order } = body;
    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Store name is required." }, { status: 400 });
    }
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("stores")
      .insert([{ name, slug, tagline: tagline || null, description: description || null, hero_image: hero_image || null, display_order: display_order ?? 0 }])
      .select()
      .single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, store: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
