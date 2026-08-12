import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { syncCustomer } from "../../../lib/customerSync";

// Simple in-memory rate limit (same pattern as /api/admin/login): 10 shared
// carts per IP per 5 minutes. Resets on server restart/cold start, an
// acceptable tradeoff for a public, unauthenticated lead-capture endpoint.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 5 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests, try again shortly." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, whatsapp, cart_items, subtotal, company, email, source } = body;
    if (!name || !whatsapp || !Array.isArray(cart_items) || cart_items.length === 0) {
      return NextResponse.json({ success: false, error: "Name, WhatsApp number, and a non-empty cart are required." }, { status: 400 });
    }
    const leadSource = source === "corporate" ? "corporate" : "shop";
    if (leadSource === "corporate" && !company) {
      return NextResponse.json({ success: false, error: "Company name is required for a corporate quote." }, { status: 400 });
    }

    const { error } = await supabase
      .from("catalogue_leads")
      .insert([{
        name, whatsapp, cart_items, subtotal: Number(subtotal) || 0, status: "shared",
        company: company || null, email: email || null, source: leadSource,
      }]);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });

    await syncCustomer({ phone: whatsapp, name, email, company });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
