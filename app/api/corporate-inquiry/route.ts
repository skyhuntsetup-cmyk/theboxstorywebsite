import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { syncCustomer } from "../../../lib/customerSync";

// Same in-memory rate limit pattern as /api/catalogue, /api/contact, etc.
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

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
  }

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

    await syncCustomer({ phone, name, email, company });

    return NextResponse.json({ success: true, inquiry: data });
  } catch (err) {
    console.error("API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
