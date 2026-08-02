import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  try {
    const body = await req.json();
    const { name, vendor_name, purchase_price, selling_price, photo_drive_link, stock_quantity, is_synced, synced_type } = body;
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (vendor_name !== undefined) update.vendor_name = vendor_name;
    if (purchase_price !== undefined) update.purchase_price = Number(purchase_price);
    if (selling_price !== undefined) update.selling_price = Number(selling_price);
    if (photo_drive_link !== undefined) update.photo_drive_link = photo_drive_link || null;
    if (stock_quantity !== undefined) update.stock_quantity = Number(stock_quantity);
    if (is_synced !== undefined) update.is_synced = is_synced;
    if (synced_type !== undefined) update.synced_type = synced_type;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("offline_inventory")
      .update(update)
      .eq("product_code", code)
      .select()
      .single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, item: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("offline_inventory").delete().eq("product_code", code);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
