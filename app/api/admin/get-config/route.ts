import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    
    let filePath = "";
    if (type === "catalog") {
      filePath = path.join(process.cwd(), "data", "catalog-config.json");
    } else if (type === "past-work") {
      filePath = path.join(process.cwd(), "data", "past-work-config.json");
    } else if (type === "site-content") {
      filePath = path.join(process.cwd(), "data", "site-content.json");
    } else {
      return NextResponse.json({ success: false, error: "Invalid configuration type" }, { status: 400 });
    }
    
    const fileContent = await fs.readFile(filePath, "utf-8");
    const config = JSON.parse(fileContent);
    
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Get config error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
