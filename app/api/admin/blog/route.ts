import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, posts: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

function slugify(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, excerpt, content, category, image, tags, is_published } = body;
    if (!title || !content) {
      return NextResponse.json({ success: false, error: "Title and content are required." }, { status: 400 });
    }
    const words = String(content).trim().split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([{
        slug: slugify(title),
        title,
        excerpt: excerpt || null,
        content,
        category: category || null,
        image: image || null,
        tags: Array.isArray(tags) ? tags : [],
        read_time: readTime,
        is_published: is_published !== false,
      }])
      .select()
      .single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, post: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
