import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, tagline, description, hero_image, display_order, is_active } = body;
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (tagline !== undefined) update.tagline = tagline || null;
    if (description !== undefined) update.description = description || null;
    if (hero_image !== undefined) update.hero_image = hero_image || null;
    if (display_order !== undefined) update.display_order = display_order;
    if (is_active !== undefined) update.is_active = is_active;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("stores")
      .update(update)
      .eq("id", id)
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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("stores").delete().eq("id", id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
