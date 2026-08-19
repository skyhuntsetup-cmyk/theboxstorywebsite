import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string || "vsn";
    const type = formData.get("type") as string || "past-work";
    const fieldKey = formData.get("fieldKey") as string || "field";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let objectPath = "";
    if (type === "site-content") {
      const cleanName = (file.name || "image.jpg").replace(/[^a-zA-Z0-9.]/g, "_");
      const cleanKey = fieldKey.replace(/[^a-zA-Z0-9.]/g, "-");
      objectPath = `site-content/${cleanKey}-${Date.now()}-${cleanName}`;
    } else {
      const cleanName = (file.name || "photo.jpeg").replace(/[^a-zA-Z0-9_.]/g, "_");
      objectPath = `past-work/${folder}/${Date.now()}-${cleanName}`;
    }

    const supabase = getSupabaseAdmin();
    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(objectPath, buffer, { contentType: file.type || "image/jpeg" });
    if (uploadError) return NextResponse.json({ success: false, error: uploadError.message }, { status: 400 });

    const { data } = supabase.storage.from("site-assets").getPublicUrl(objectPath);
    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
