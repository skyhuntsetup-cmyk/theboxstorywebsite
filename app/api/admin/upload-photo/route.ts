import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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

    let uploadDir = "";
    let relativeUrl = "";
    if (type === "catalog") {
      uploadDir = path.join(process.cwd(), "public", "images", "catalog");
      // Find what file index we should write
      const originalName = file.name || "page_X.png";
      const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, "_");
      relativeUrl = `/images/catalog/${cleanName}`;
    } else if (type === "site-content") {
      uploadDir = path.join(process.cwd(), "public", "images", "site-content");
      const originalName = file.name || "image.jpg";
      const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, "_");
      const cleanKey = fieldKey.replace(/[^a-zA-Z0-9.]/g, "-");
      relativeUrl = `/images/site-content/${cleanKey}-${Date.now()}-${cleanName}`;
    } else {
      uploadDir = path.join(process.cwd(), "public", "images", "past-work", folder);
      const originalName = file.name || "photo.jpeg";
      // Sanitize filename to avoid weird character issues in paths
      const cleanName = originalName.replace(/[^a-zA-Z0-9_.]/g, "_");
      relativeUrl = `/images/past-work/${folder}/${cleanName}`;
    }

    await fs.mkdir(uploadDir, { recursive: true });
    const fullPath = path.join(process.cwd(), "public", relativeUrl);
    await fs.writeFile(fullPath, buffer);

    return NextResponse.json({ success: true, url: relativeUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
