import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

interface SkippedRow {
  sheet: string;
  row: number;
  reason: string;
}

const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product";

const cellText = (row: ExcelJS.Row, col: number): string => (row.getCell(col).text || "").toString().trim();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());

    const supabase = getSupabaseAdmin();
    const [{ data: stores, error: storesError }, { data: categories, error: catError }, { data: existingProducts, error: prodError }] = await Promise.all([
      supabase.from("stores").select("id, name"),
      supabase.from("categories").select("id, name"),
      supabase.from("products").select("id"),
    ]);
    if (storesError) return NextResponse.json({ success: false, error: storesError.message }, { status: 400 });
    if (catError) return NextResponse.json({ success: false, error: catError.message }, { status: 400 });
    if (prodError) return NextResponse.json({ success: false, error: prodError.message }, { status: 400 });

    const storesByName = new Map((stores || []).map((s) => [s.name.toLowerCase(), s.id]));
    const categoriesByName = new Map((categories || []).map((c) => [c.name.toLowerCase(), c.id]));
    const knownIds = new Set((existingProducts || []).map((p) => p.id));

    let created = 0;
    const skipped: SkippedRow[] = [];

    for (const sheet of workbook.worksheets) {
      const storeId = storesByName.get(sheet.name.toLowerCase());
      if (!storeId) continue; // Instructions / _Categories / anything renamed away from a store

      for (let r = 2; r <= sheet.rowCount; r++) {
        const row = sheet.getRow(r);
        const rawId = cellText(row, 1);
        const name = cellText(row, 2);
        const priceText = cellText(row, 3);

        if (!name && !priceText) continue; // fully blank row, not a real entry

        if (!name || !priceText) {
          skipped.push({ sheet: sheet.name, row: r, reason: "Missing Name or Price" });
          continue;
        }
        const price = Number(priceText);
        if (!Number.isFinite(price)) {
          skipped.push({ sheet: sheet.name, row: r, reason: `Invalid price "${priceText}"` });
          continue;
        }

        let id = rawId;
        if (id) {
          if (knownIds.has(id)) {
            skipped.push({ sheet: sheet.name, row: r, reason: `ID "${id}" already exists` });
            continue;
          }
        } else {
          const base = slugify(name);
          id = base;
          let suffix = 2;
          while (knownIds.has(id)) {
            id = `${base}-${suffix}`;
            suffix++;
          }
        }

        const costPriceText = cellText(row, 4);
        const description = cellText(row, 5);
        const image = cellText(row, 6);
        const badge = cellText(row, 7);
        const stockText = cellText(row, 8);

        const categoryIds = [9, 10, 11]
          .map((col) => cellText(row, col))
          .filter(Boolean)
          .map((catName) => categoriesByName.get(catName.toLowerCase()))
          .filter((catId): catId is string => Boolean(catId));

        const { error: insertError } = await supabase.from("products").insert([{
          id,
          name,
          price,
          image: image || null,
          description: description || null,
          badge: badge || null,
          stock_quantity: stockText === "" ? null : Number(stockText),
          cost_price: costPriceText === "" ? null : Number(costPriceText),
          personalization_fields: [],
        }]);
        if (insertError) {
          skipped.push({ sheet: sheet.name, row: r, reason: insertError.message });
          continue;
        }
        knownIds.add(id);

        await supabase.from("product_stores").insert([{ product_id: id, store_id: storeId }]);
        if (categoryIds.length > 0) {
          await supabase.from("product_categories").insert(categoryIds.map((categoryId) => ({ product_id: id, category_id: categoryId })));
        }

        created++;
      }
    }

    return NextResponse.json({ success: true, created, skipped });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
