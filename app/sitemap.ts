import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";
import { getAllBlogPosts } from "../lib/blog";

const BASE_URL = "https://theboxstory.com";

const STATIC_ROUTES = [
  "", "/about", "/contact", "/collections", "/collections/divine", "/collections/diwali",
  "/build", "/catalogue", "/custom-gifts", "/kids", "/gift-genie", "/weddings",
  "/corporate", "/corporate/catalog", "/corporate/past-work", "/corporate/profile",
  "/corporate-quote", "/blogs",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const [{ data: categories }, { data: stores }, posts] = await Promise.all([
      supabase.from("categories").select("slug").eq("is_active", true),
      supabase.from("stores").select("slug").eq("is_active", true),
      getAllBlogPosts(),
    ]);

    for (const cat of categories || []) {
      entries.push({ url: `${BASE_URL}/collections/${cat.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 });
    }
    for (const store of stores || []) {
      entries.push({ url: `${BASE_URL}/store/${store.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 });
    }
    for (const post of posts) {
      entries.push({ url: `${BASE_URL}/blogs/${post.slug}`, lastModified: new Date(post.publishedAt), changeFrequency: "monthly", priority: 0.5 });
    }
  } catch (err) {
    console.error("Failed to build dynamic sitemap entries:", err);
  }

  return entries;
}
