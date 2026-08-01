import { createClient } from "@supabase/supabase-js";

// Server-only client using the service role key, which bypasses Row Level
// Security. The existing admin write calls in app/admin/page.tsx use the
// public anon-key client (lib/supabase.ts) directly from the browser, but
// every write-access RLS policy in supabase-schema.sql requires
// `auth.role() = 'authenticated'` — a real Supabase Auth session, which this
// app never creates (the /admin password gate is a separate, custom cookie
// check in proxy.ts, not Supabase Auth). So those direct client-side writes
// are rejected by RLS with a real Supabase project.
//
// New admin write endpoints should go through an /api/admin/* route using
// this client instead: proxy.ts already password-protects everything under
// /api/admin/*, so gating happens before this file is ever reached, and the
// service role key never reaches the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseAdmin() {
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
