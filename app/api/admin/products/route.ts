import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories(category_id)")
      .order("name");
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    const products = (data || []).map((p) => {
      const { product_categories, ...rest } = p as typeof p & { product_categories: { category_id: string }[] };
      return { ...rest, categoryIds: (product_categories || []).map((pc: { category_id: string }) => pc.category_id) };
    });
    return NextResponse.json({ success: true, products });
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
    const { id, name, price, image, description, badge, stock_quantity, categoryIds } = body;
    if (!id || !name || price == null) {
      return NextResponse.json({ success: false, error: "id, name, and price are required." }, { status: 400 });
    }
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json({ success: false, error: "Select at least one category." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    // `category` is the legacy single-value column, superseded by
    // product_categories; left null for new products.
    const { error: insertError } = await supabase
      .from("products")
      .insert([{
        id, name, price: Number(price),
        image: image || null,
        description: description || null,
        badge: badge || null,
        stock_quantity: stock_quantity === "" || stock_quantity == null ? null : Number(stock_quantity),
      }]);
    if (insertError) return NextResponse.json({ success: false, error: insertError.message }, { status: 400 });

    const { error: tagError } = await supabase
      .from("product_categories")
      .insert(categoryIds.map((categoryId: string) => ({ product_id: id, category_id: categoryId })));
    if (tagError) return NextResponse.json({ success: false, error: tagError.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
