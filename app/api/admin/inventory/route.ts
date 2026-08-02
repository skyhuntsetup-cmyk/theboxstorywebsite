import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("offline_inventory").select("*").order("product_code");
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, items: data });
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
    const { product_code, name, vendor_name, purchase_price, selling_price, photo_drive_link, stock_quantity } = body;
    if (!product_code || !name || !vendor_name || !purchase_price || !selling_price) {
      return NextResponse.json({ success: false, error: "Product code, name, vendor, and prices are required." }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("offline_inventory")
      .insert([{
        product_code,
        name,
        vendor_name,
        purchase_price: Number(purchase_price),
        selling_price: Number(selling_price),
        photo_drive_link: photo_drive_link || null,
        stock_quantity: Number(stock_quantity || 0),
        is_synced: false,
      }])
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
