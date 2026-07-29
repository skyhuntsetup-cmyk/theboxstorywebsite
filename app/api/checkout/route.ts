import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      deliveryMode, 
      subtotal, 
      customerName, 
      customerPhone, 
      customerEmail, 
      shippingAddress, 
      magicalLinkDetails, 
      items 
    } = body;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          delivery_mode: deliveryMode,
          subtotal,
          customer_name: customerName || null,
          customer_phone: customerPhone || null,
          customer_email: customerEmail || null,
          shipping_address: shippingAddress || null,
          magical_link_details: magicalLinkDetails || null,
          items,
          status: "paid",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    console.error("API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
