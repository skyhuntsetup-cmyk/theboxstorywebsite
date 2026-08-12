import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "../../../../lib/supabase";

// Same in-memory rate-limit pattern used across the other public endpoints
// (/api/catalogue, /api/claim-campaign/submit) — resets on cold start, an
// acceptable tradeoff for a public endpoint that costs real money per call.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 30;
const WINDOW_MS = 5 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

interface HistoryMessage {
  role: "user" | "assistant";
  text: string;
}

const RECOMMEND_TOOL = {
  name: "recommend_gifts",
  description: "Reply to the shopper and recommend 0-3 products from the given catalog that best match what they're looking for.",
  input_schema: {
    type: "object" as const,
    properties: {
      reply: {
        type: "string" as const,
        description: "A warm, concise (1-2 sentence) conversational reply. If the request is too vague to recommend anything useful, ask a short clarifying question here instead of guessing, and leave product_ids empty.",
      },
      product_ids: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "0 to 3 product IDs, exactly as given in the catalog, that best match the request. Never invent an ID that isn't in the catalog.",
      },
    },
    required: ["reply", "product_ids"],
  },
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many messages, please slow down a little." }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "Gift Genie isn't configured yet — missing ANTHROPIC_API_KEY." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const message: string = body.message;
    const history: HistoryMessage[] = Array.isArray(body.history) ? body.history.slice(-6) : [];
    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: "Message is required." }, { status: 400 });
    }

    const [{ data: products }, { data: categories }] = await Promise.all([
      supabase.from("products").select("id, name, price, description, badge, stock_quantity, product_categories(category_id)").order("name").limit(200),
      supabase.from("categories").select("id, name"),
    ]);
    const categoryNameById = new Map((categories || []).map((c) => [c.id, c.name]));

    const catalogLines = (products || [])
      .filter((p) => p.stock_quantity !== 0)
      .map((p) => {
        const catIds = ((p as typeof p & { product_categories: { category_id: string }[] }).product_categories || []).map((pc) => pc.category_id);
        const categoryNames = catIds.map((id) => categoryNameById.get(id)).filter(Boolean).join(", ");
        return `${p.id} | ${p.name} | ₹${p.price} | ${categoryNames || "uncategorized"} | ${(p.description || "").slice(0, 100)}`;
      })
      .join("\n");

    const systemPrompt = `You are the Gift Genie, a warm and knowledgeable gifting concierge for The Box Story, a premium Indian gifting brand. A shopper is chatting with you to find the right gift.

Recommend only from this live catalog (format: id | name | price | categories | description):
${catalogLines}

Rules:
- Only ever recommend product IDs that appear in the catalog above.
- If the shopper's request is vague (no occasion, recipient, or budget hint), ask ONE short clarifying question in your reply and return an empty product_ids array rather than guessing.
- Keep your reply short and conversational — it's shown as a chat bubble and also read aloud via text-to-speech, so avoid long lists or markdown in the reply text itself.
- Always call the recommend_gifts tool with your response.`;

    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: [
        ...history.map((h) => ({ role: h.role, content: h.text })),
        { role: "user" as const, content: message },
      ],
      tools: [RECOMMEND_TOOL],
      tool_choice: { type: "tool", name: "recommend_gifts" },
    });

    const toolUse = response.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ success: false, error: "The Genie didn't respond properly, try again." }, { status: 502 });
    }

    const { reply, product_ids } = toolUse.input as { reply: string; product_ids: string[] };
    const recommendedProducts = (products || []).filter((p) => product_ids.includes(p.id));

    return NextResponse.json({ success: true, reply, productIds: recommendedProducts.map((p) => p.id) });
  } catch (err) {
    console.error("Gift Genie chat error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
