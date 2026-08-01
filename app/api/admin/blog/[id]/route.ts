import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { title, excerpt, content, category, image, tags, is_published } = body;
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) update.title = title;
    if (excerpt !== undefined) update.excerpt = excerpt || null;
    if (content !== undefined) {
      update.content = content;
      const words = String(content).trim().split(/\s+/).filter(Boolean).length;
      update.read_time = `${Math.max(1, Math.ceil(words / 200))} min read`;
    }
    if (category !== undefined) update.category = category || null;
    if (image !== undefined) update.image = image || null;
    if (tags !== undefined) update.tags = Array.isArray(tags) ? tags : [];
    if (is_published !== undefined) update.is_published = is_published;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .update(update)
      .eq("id", id)
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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
