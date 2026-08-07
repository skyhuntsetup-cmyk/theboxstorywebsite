import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getSupabaseAdmin } from "../../../../../../lib/supabaseAdmin";

const HEADERS = [
  "ID (optional)", "Name*", "Price*", "Cost Price", "Description",
  "Image URL", "Badge", "Stock Quantity", "Category 1", "Category 2", "Category 3",
];
const COLUMN_WIDTHS = [16, 30, 10, 12, 42, 32, 16, 14, 20, 20, 20];
const TEMPLATE_ROWS = 300;

// Excel worksheet names can't exceed 31 chars or contain \ / ? * [ ]
const sheetName = (name: string) => name.replace(/[\\/?*[\]]/g, "").slice(0, 31);

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const [{ data: stores, error: storesError }, { data: categories, error: catError }] = await Promise.all([
      supabase.from("stores").select("name").order("display_order"),
      supabase.from("categories").select("name").eq("is_active", true).order("display_order"),
    ]);
    if (storesError) return NextResponse.json({ success: false, error: storesError.message }, { status: 400 });
    if (catError) return NextResponse.json({ success: false, error: catError.message }, { status: 400 });

    const workbook = new ExcelJS.Workbook();

    const instructions = workbook.addWorksheet("Instructions");
    instructions.columns = [{ width: 100 }];
    instructions.addRows([
      ["The Box Story — Bulk Inventory Import"],
      [""],
      ["Fill in one row per product on the tab matching the store it belongs to."],
      ["Upload this file back in Admin → Products → Bulk Import when you're done."],
      [""],
      ["Column notes:"],
      ["• ID (optional) — leave blank and one will be generated from the product name."],
      ["• Name and Price are required; every other column is optional."],
      ["• Stock Quantity — leave blank for unlimited/not tracked, or 0 to mark it Sold Out."],
      ["• Category 1/2/3 — pick from the dropdown; a product can have up to 3."],
      ["• A product can only be added to the store whose tab you put it on. To list it in more than"],
      ["  one store, add it again on that store's tab (it'll get its own row/ID there)."],
      ["• Custom Gifts: personalization fields (engraving, name, etc.) aren't set here — add those"],
      ["  afterward by editing the product in the admin."],
    ]);
    instructions.getRow(1).font = { bold: true, size: 14 };
    instructions.getRow(6).font = { bold: true };
    instructions.eachRow((row) => row.eachCell((cell) => { cell.alignment = { wrapText: true }; }));

    const categoryNames = (categories || []).map((c) => c.name);
    const catSheet = workbook.addWorksheet("_Categories");
    catSheet.state = "hidden";
    categoryNames.forEach((name, i) => { catSheet.getCell(i + 1, 1).value = name; });
    const catRange = `_Categories!$A$1:$A$${Math.max(categoryNames.length, 1)}`;

    for (const store of stores || []) {
      const sheet = workbook.addWorksheet(sheetName(store.name));
      sheet.columns = COLUMN_WIDTHS.map((width) => ({ width }));
      sheet.addRow(HEADERS);
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };

      for (let r = 2; r <= TEMPLATE_ROWS; r++) {
        for (const col of [9, 10, 11]) { // Category 1/2/3
          sheet.getCell(r, col).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [catRange],
          };
        }
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="TheBoxStory-Inventory-Template.xlsx"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
