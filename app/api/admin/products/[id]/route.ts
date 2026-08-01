import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, price, image, description, badge, categoryIds } = body;
    const supabase = getSupabaseAdmin();

    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (price !== undefined) update.price = Number(price);
    if (image !== undefined) update.image = image || null;
    if (description !== undefined) update.description = description || null;
    if (badge !== undefined) update.badge = badge || null;

    if (Object.keys(update).length > 0) {
      const { error: updateError } = await supabase.from("products").update(update).eq("id", id);
      if (updateError) return NextResponse.json({ success: false, error: updateError.message }, { status: 400 });
    }

    if (Array.isArray(categoryIds)) {
      if (categoryIds.length === 0) {
        return NextResponse.json({ success: false, error: "Select at least one category." }, { status: 400 });
      }
      const { error: deleteError } = await supabase.from("product_categories").delete().eq("product_id", id);
      if (deleteError) return NextResponse.json({ success: false, error: deleteError.message }, { status: 400 });
      const { error: tagError } = await supabase
        .from("product_categories")
        .insert(categoryIds.map((categoryId: string) => ({ product_id: id, category_id: categoryId })));
      if (tagError) return NextResponse.json({ success: false, error: tagError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
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
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
