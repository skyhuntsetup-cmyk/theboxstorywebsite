import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { normalizePhone } from "../../../../../lib/customerSync";
import type { CustomerDetail } from "../../../../../lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  try {
    const supabase = getSupabaseAdmin();
    const [{ data: customer, error: custError }, { data: orders }, { data: inquiries }, { data: leads }] = await Promise.all([
      supabase.from("customers").select("*").eq("phone", phone).single(),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("catalogue_leads").select("*").order("created_at", { ascending: false }),
    ]);
    if (custError) return NextResponse.json({ success: false, error: custError.message }, { status: 404 });

    const matchingOrders = (orders || []).filter((o) => normalizePhone(o.customer_phone) === phone);
    const matchingInquiries = (inquiries || []).filter((i) => normalizePhone(i.phone) === phone);
    const matchingLeads = (leads || []).filter((l) => normalizePhone(l.whatsapp) === phone);

    const detail: CustomerDetail = {
      ...customer,
      totalOrders: matchingOrders.length,
      totalSpent: matchingOrders.reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0),
      orders: matchingOrders,
      inquiries: matchingInquiries,
      catalogueLeads: matchingLeads,
    };

    return NextResponse.json({ success: true, customer: detail });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  try {
    const body = await req.json();
    const { name, email, company, notes } = body;
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) update.name = name || null;
    if (email !== undefined) update.email = email || null;
    if (company !== undefined) update.company = company || null;
    if (notes !== undefined) update.notes = notes || null;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("customers").update(update).eq("phone", phone);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
