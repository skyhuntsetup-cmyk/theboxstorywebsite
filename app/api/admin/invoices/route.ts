import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import type { InvoiceLineItem } from "../../../../lib/types";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, invoices: data });
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
    const { customer_name, customer_phone, customer_address, line_items, notes } = body;

    if (!customer_name || typeof customer_name !== "string") {
      return NextResponse.json({ success: false, error: "Customer name is required." }, { status: 400 });
    }
    if (!Array.isArray(line_items) || line_items.length === 0) {
      return NextResponse.json({ success: false, error: "At least one line item is required." }, { status: 400 });
    }

    const cleanItems: InvoiceLineItem[] = line_items.map((item: InvoiceLineItem) => ({
      description: String(item.description || "").trim(),
      quantity: Number(item.quantity) || 0,
      cost_price: Number(item.cost_price) || 0,
      selling_price: Number(item.selling_price) || 0,
    }));

    if (cleanItems.some((item) => !item.description || item.quantity <= 0)) {
      return NextResponse.json({ success: false, error: "Every line item needs a description and a quantity greater than 0." }, { status: 400 });
    }

    // Computed server-side, never trusting client-supplied totals.
    const subtotal = cleanItems.reduce((sum, item) => sum + item.selling_price * item.quantity, 0);
    const total_cost = cleanItems.reduce((sum, item) => sum + item.cost_price * item.quantity, 0);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("invoices")
      .insert([{
        customer_name,
        customer_phone: customer_phone || null,
        customer_address: customer_address || null,
        line_items: cleanItems,
        subtotal,
        total_cost,
        notes: notes || null,
      }])
      .select()
      .single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, invoice: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
