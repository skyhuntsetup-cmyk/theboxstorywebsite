import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { type, config } = await req.json();
    
    let filePath = "";
    if (type === "catalog") {
      filePath = path.join(process.cwd(), "data", "catalog-config.json");
    } else if (type === "past-work") {
      filePath = path.join(process.cwd(), "data", "past-work-config.json");
    } else {
      return NextResponse.json({ success: false, error: "Invalid configuration type" }, { status: 400 });
    }
    
    // Write config back to local JSON
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), "utf-8");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save config error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
