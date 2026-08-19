import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

// Scoped to a single primary-key lookup — safe to leave unauthenticated
// (that's the whole point of a magical gift link), but unlike a public RLS
// SELECT policy on `orders`, this can never be used to enumerate/bulk-read
// other orders since the service-role client here only ever returns the
// one row matching the id in the URL.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
    if (error || !data) {
      return NextResponse.json({ success: false, error: "This gift link is invalid or has already been claimed." }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
