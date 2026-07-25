import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, quantity, budget, details } = body;

    const { data, error } = await supabase
      .from("inquiries")
      .insert([
        {
          name,
          email,
          phone,
          company,
          quantity,
          budget,
          details: details || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, inquiry: data });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
