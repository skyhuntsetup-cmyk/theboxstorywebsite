import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { normalizePhone } from "../../../../lib/customerSync";
import type { CustomerWithStats } from "../../../../lib/types";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const [{ data: customers, error: custError }, { data: orders, error: orderError }] = await Promise.all([
      supabase.from("customers").select("*").order("updated_at", { ascending: false }),
      supabase.from("orders").select("customer_phone, subtotal"),
    ]);
    if (custError) return NextResponse.json({ success: false, error: custError.message }, { status: 400 });
    if (orderError) return NextResponse.json({ success: false, error: orderError.message }, { status: 400 });

    const statsByPhone = new Map<string, { totalOrders: number; totalSpent: number }>();
    for (const order of orders || []) {
      const phone = normalizePhone(order.customer_phone);
      if (!phone) continue;
      const existing = statsByPhone.get(phone) || { totalOrders: 0, totalSpent: 0 };
      existing.totalOrders += 1;
      existing.totalSpent += Number(order.subtotal) || 0;
      statsByPhone.set(phone, existing);
    }

    const withStats: CustomerWithStats[] = (customers || []).map((c) => ({
      ...c,
      totalOrders: statsByPhone.get(c.phone)?.totalOrders || 0,
      totalSpent: statsByPhone.get(c.phone)?.totalSpent || 0,
    }));

    return NextResponse.json({ success: true, customers: withStats });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
