import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSessionToken, ADMIN_SESSION_COOKIE } from "../../../../lib/adminAuth";

// Simple in-memory rate limit: 5 attempts per IP per 5 minutes. Resets on
// server restart, which is an acceptable tradeoff for a single-admin panel.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
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
    return NextResponse.json(
      { success: false, error: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, error: "Admin login is not configured (ADMIN_PASSWORD unset)." },
      { status: 500 }
    );
  }

  try {
    const { password } = await req.json();
    if (typeof password !== "string" || !checkPassword(password)) {
      return NextResponse.json({ success: false, error: "Incorrect password." }, { status: 401 });
    }

    const token = createSessionToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Login failed." },
      { status: 500 }
    );
  }
}
