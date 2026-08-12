import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { normalizePhone } from "../../../../../lib/customerSync";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const [{ data: customers, error }, { data: orders }] = await Promise.all([
      supabase.from("customers").select("*").order("updated_at", { ascending: false }),
      supabase.from("orders").select("customer_phone, subtotal"),
    ]);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });

    const statsByPhone = new Map<string, { totalOrders: number; totalSpent: number }>();
    for (const order of orders || []) {
      const phone = normalizePhone(order.customer_phone);
      if (!phone) continue;
      const existing = statsByPhone.get(phone) || { totalOrders: 0, totalSpent: 0 };
      existing.totalOrders += 1;
      existing.totalSpent += Number(order.subtotal) || 0;
      statsByPhone.set(phone, existing);
    }

    const headers = ["Phone", "Name", "Email", "Company", "Total Orders", "Total Spent", "Notes"];
    const rows = (customers || []).map((c) => {
      const stats = statsByPhone.get(c.phone) || { totalOrders: 0, totalSpent: 0 };
      return [c.phone, c.name || "", c.email || "", c.company || "", stats.totalOrders, stats.totalSpent, c.notes || ""];
    });

    const csv = [headers, ...rows].map((row) => row.map((cell) => csvEscape(String(cell))).join(",")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="TheBoxStory-Customers.csv"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
