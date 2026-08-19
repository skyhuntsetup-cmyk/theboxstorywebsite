import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const cleanName = (file.name || "image.jpg").replace(/[^a-zA-Z0-9.]/g, "_");
    const path = `${Date.now()}-${cleanName}`;

    const supabase = getSupabaseAdmin();
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, buffer, { contentType: file.type || "image/jpeg" });
    if (uploadError) return NextResponse.json({ success: false, error: uploadError.message }, { status: 400 });

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
