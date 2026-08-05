import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { generateUniqueCampaignCodes } from "../../../../lib/campaignCode";
import type { CustomFieldDef } from "../../../../lib/types";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const [{ data: campaigns, error: campaignsError }, { data: codes, error: codesError }] = await Promise.all([
      supabase.from("corporate_campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("campaign_codes").select("campaign_id, is_redeemed"),
    ]);
    if (campaignsError) return NextResponse.json({ success: false, error: campaignsError.message }, { status: 400 });
    if (codesError) return NextResponse.json({ success: false, error: codesError.message }, { status: 400 });

    const withCounts = (campaigns || []).map((c) => {
      const campaignCodes = (codes || []).filter((code) => code.campaign_id === c.id);
      return {
        ...c,
        redeemedCount: campaignCodes.filter((code) => code.is_redeemed).length,
        totalCount: campaignCodes.length,
      };
    });

    return NextResponse.json({ success: true, campaigns: withCounts });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

interface CampaignProductInput {
  name: string;
  description?: string;
  image_url?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      logo_url,
      campaign_type,
      num_hampers,
      custom_fields,
      products,
    }: {
      name: string;
      logo_url?: string;
      campaign_type: "single" | "choice";
      num_hampers: number;
      custom_fields: CustomFieldDef[];
      products: CampaignProductInput[];
    } = body;

    if (!name || !campaign_type || !num_hampers) {
      return NextResponse.json({ success: false, error: "Name, campaign type, and number of hampers are required." }, { status: 400 });
    }
    if (!["single", "choice"].includes(campaign_type)) {
      return NextResponse.json({ success: false, error: "Invalid campaign type." }, { status: 400 });
    }
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, error: "At least one hamper product is required." }, { status: 400 });
    }
    if (campaign_type === "single" && products.length > 1) {
      return NextResponse.json({ success: false, error: "\"Same Kit for All\" campaigns can only have one product." }, { status: 400 });
    }
    const hamperCount = Number(num_hampers);
    if (!Number.isInteger(hamperCount) || hamperCount <= 0) {
      return NextResponse.json({ success: false, error: "Number of hampers must be a positive whole number." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: campaign, error: campaignError } = await supabase
      .from("corporate_campaigns")
      .insert([{
        name,
        logo_url: logo_url || null,
        campaign_type,
        num_hampers: hamperCount,
        custom_fields: custom_fields || [],
      }])
      .select()
      .single();
    if (campaignError) return NextResponse.json({ success: false, error: campaignError.message }, { status: 400 });

    const { error: productsError } = await supabase
      .from("campaign_products")
      .insert(products.map((p, idx) => ({
        campaign_id: campaign.id,
        name: p.name,
        description: p.description || null,
        image_url: p.image_url || null,
        display_order: idx,
      })));
    if (productsError) return NextResponse.json({ success: false, error: productsError.message }, { status: 400 });

    const generatedCodes = generateUniqueCampaignCodes(hamperCount);
    const { error: codesError } = await supabase
      .from("campaign_codes")
      .insert(generatedCodes.map((code) => ({ code, campaign_id: campaign.id })));
    if (codesError) return NextResponse.json({ success: false, error: codesError.message }, { status: 400 });

    return NextResponse.json({ success: true, campaign, codes: generatedCodes });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
