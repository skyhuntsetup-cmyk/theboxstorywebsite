import { blogPosts as staticBlogPosts, BlogPost } from "../data/blogs";
import { supabase } from "./supabase";

/**
 * Unified shape for both the original static posts (data/blogs.ts) and
 * new posts added through the admin (Supabase `blog_posts`). Content for
 * both uses the same lightweight markdown (#, ##, *, >, **bold**) rendered
 * by app/blogs/[slug]/page.tsx's parseMarkdown, so admin-authored posts
 * read consistently with the original 42.
 */
export interface UnifiedBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  pinterestIdea?: string;
}

function fromStatic(post: BlogPost): UnifiedBlogPost {
  return post;
}

function fromSupabase(row: {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  image: string | null;
  published_at: string;
  read_time: string | null;
  tags: string[];
}): UnifiedBlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content,
    category: row.category || "Uncategorized",
    image: row.image || "/images/icons/icon_couple.png",
    publishedAt: row.published_at.slice(0, 10),
    readTime: row.read_time || "1 min read",
    tags: row.tags || [],
  };
}

export async function getAllBlogPosts(): Promise<UnifiedBlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const supabasePosts = (data || []).map(fromSupabase);
  // If an admin-authored post reuses a static slug, the admin version wins.
  const dedupedStatic = staticBlogPosts.filter((p) => !supabasePosts.some((sp) => sp.slug === p.slug));

  return [...supabasePosts, ...dedupedStatic.map(fromStatic)].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<UnifiedBlogPost | null> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (data) return fromSupabase(data);

  const staticPost = staticBlogPosts.find((p) => p.slug === slug);
  return staticPost ? fromStatic(staticPost) : null;
}
