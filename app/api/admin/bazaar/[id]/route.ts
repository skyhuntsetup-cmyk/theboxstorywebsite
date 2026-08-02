import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, price, image, category, is_active } = body;
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (price !== undefined) update.price = Number(price);
    if (image !== undefined) update.image = image;
    if (category !== undefined) update.category = category;
    if (is_active !== undefined) update.is_active = is_active;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("bazaar_items").update(update).eq("id", id).select().single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, item: data });
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
    const { error } = await supabase.from("bazaar_items").delete().eq("id", id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
