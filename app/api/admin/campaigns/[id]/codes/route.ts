import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../../lib/supabaseAdmin";
import { generateUniqueCampaignCodes } from "../../../../../../lib/campaignCode";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const count = Number(body.count);
    if (!Number.isInteger(count) || count <= 0) {
      return NextResponse.json({ success: false, error: "Count must be a positive whole number." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const generatedCodes = generateUniqueCampaignCodes(count);
    const { error: insertError } = await supabase
      .from("campaign_codes")
      .insert(generatedCodes.map((code) => ({ code, campaign_id: id })));
    if (insertError) return NextResponse.json({ success: false, error: insertError.message }, { status: 400 });

    const { data: campaign, error: fetchError } = await supabase
      .from("corporate_campaigns")
      .select("num_hampers")
      .eq("id", id)
      .single();
    if (!fetchError && campaign) {
      await supabase
        .from("corporate_campaigns")
        .update({ num_hampers: campaign.num_hampers + count })
        .eq("id", id);
    }

    return NextResponse.json({ success: true, codes: generatedCodes });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
