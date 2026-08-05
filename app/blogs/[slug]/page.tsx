import React from "react";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug } from "../../../lib/blog";
import {
  ArrowLeft, Calendar, Clock, Share2, Pin, Tag, ChevronRight, Gift, Building2, Sparkles
} from "lucide-react";
import { Metadata } from "next";

// Next.js static generation of blog paths. New posts added via the admin
// after this build aren't in this list, but Next.js still renders them
// on-demand (dynamicParams defaults to true), hitting getBlogPostBySlug
// directly — this list just pre-renders posts known at build time.
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Next.js dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  if (!post) return { title: "Blog Not Found" };
  const imageUrl = post.image.startsWith("http") ? post.image : `https://theboxstory.com${post.image}`;
  return {
    title: `${post.title} | Gifting Inspiration - The Box Story`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: imageUrl }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-slate-800">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Inspiration Post Not Found</h1>
          <Link href="/blogs" className="text-teal-deep hover:underline">
            Back to Inspiration Board
          </Link>
        </div>
      </div>
    );
  }

  // Find related articles in the same category
  const allPosts = await getAllBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  // Styling helper for text styles (like **bold**)
  function renderStyledText(text: string) {
    const parts = text.split("**");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-extrabold text-slate-900">{part}</strong>;
      }
      return part;
    });
  }

  // Custom Markdown parser for dynamic rendering
  function parseMarkdown(markdown: string) {
    const lines = markdown.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="font-heading text-3xl font-black text-slate-900 mt-8 mb-4">{line.replace("# ", "")}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="font-heading text-2xl font-black text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2">{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="font-heading text-lg font-bold text-slate-900 mt-6 mb-3">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        const text = line.startsWith("* ") ? line.replace("* ", "") : line.replace("- ", "");
        return (
          <li key={idx} className="text-xs sm:text-sm text-slate-650 list-disc list-inside ml-4 mb-2 leading-relaxed">
            {renderStyledText(text)}
          </li>
        );
      }
      if (/^\d+\. /.test(line)) {
        return (
          <li key={idx} className="text-xs sm:text-sm text-slate-650 list-decimal list-inside ml-4 mb-2 leading-relaxed">
            {renderStyledText(line.replace(/^\d+\. /, ""))}
          </li>
        );
      }
      if (line.startsWith("> ")) {
        return (
          <div key={idx} className="border-l-4 border-saffron bg-saffron/5 p-4 rounded-r-2xl my-4 text-xs italic text-slate-700 leading-relaxed">
            {line.replace("> ", "").replace("[!IMPORTANT]", "").trim()}
          </div>
        );
      }
      if (line.trim() === "---") {
        return <hr key={idx} className="my-6 border-slate-200" />;
      }
      if (line.trim() === "") {
        return null;
      }
      return <p key={idx} className="text-xs sm:text-sm text-slate-650 leading-relaxed mb-4">{renderStyledText(line)}</p>;
    });
  }

  // Pre-formatted Pinterest save link parameters
  const absolutePostUrl = `https://theboxstory.com/blogs/${post.slug}`;
  const absoluteMediaUrl = post.image.startsWith("http") ? post.image : `https://theboxstory.com${post.image}`;
  const pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(absolutePostUrl)}&media=${encodeURIComponent(absoluteMediaUrl)}&description=${encodeURIComponent(post.title + " - " + post.excerpt)}`;

  return (
    <div className="min-h-screen bg-background text-slate-800 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <div className="text-left">
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Inspiration Board</span>
          </Link>
        </div>

        {/* Hero Header Area */}
        <section className="bg-white border border-slate-200 rounded-[36px] p-6 sm:p-12 shadow-sm text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="text-[11px] tracking-widest font-black uppercase text-saffron bg-saffron/10 border border-saffron/15 px-3 py-1.5 rounded-full inline-block">
              {post.category}
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {post.publishedAt}
              </span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {post.readTime}
              </span>
            </div>
          </div>
          
          <div className="md:col-span-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="w-32 h-32 object-contain rounded-full bg-slate-50 border border-slate-100 p-2 shadow-sm"
            />
          </div>
        </section>

        {/* Main Content Layout with Share Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sticky Social Sharing & Save Controls (Left) */}
          <aside className="lg:col-span-2 bg-white border border-slate-200 p-4 rounded-3xl space-y-4 sticky top-24 text-left shadow-sm flex flex-row lg:flex-col justify-around lg:justify-start items-center lg:items-stretch">
            <div className="hidden lg:block border-b border-slate-100 pb-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">Pin & Save</span>
            </div>
            
            <a
              href={pinterestShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-[#E60023] hover:bg-[#AD0018] text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all w-full shadow-sm hover:shadow"
            >
              <Pin className="w-4 h-4 fill-white" />
              <span>Pinterest</span>
            </a>

            <div className="hidden lg:block border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pinterest Board Idea</span>
              <p className="text-[12px] text-slate-500 leading-normal mt-1 italic">
                {post.pinterestIdea || "Aesthetic styling ideas for this hamper curation."}
              </p>
            </div>
          </aside>

          {/* Article Markdown Content Body (Center/Right) */}
          <main className="lg:col-span-10 bg-white border border-slate-200 rounded-[36px] p-6 sm:p-10 shadow-sm text-left prose prose-slate max-w-none">
            <article>
              {parseMarkdown(post.content)}
            </article>

            {/* In-content CTA box depending on category */}
            <div className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-4">
              <Gift className="w-6 h-6 text-teal-deep mx-auto" />
              <h3 className="font-heading text-lg font-bold text-slate-900">Curate Your Own Box</h3>
              <p className="text-xs text-slate-650 max-w-sm mx-auto leading-relaxed">
                Loved these styling tips? Create your custom hamper with custom laser engravings in our Build-a-Box Studio.
              </p>
              <div className="pt-2">
                <Link
                  href="/build"
                  className="bg-teal-deep hover:bg-teal-deep/95 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow"
                >
                  Enter Studio
                </Link>
              </div>
            </div>
          </main>
        </div>

        {/* Related Inspiration Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-heading text-xl font-black text-slate-900 text-left">Related Gifting Guides</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blogs/${related.slug}`}
                  className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-4 hover:shadow-md transition-shadow group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-saffron uppercase tracking-widest">
                      {related.category}
                    </span>
                    <h3 className="font-heading text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-teal-deep transition-colors leading-snug">
                      {related.title}
                    </h3>
                    <p className="text-[12px] text-slate-600 line-clamp-2 leading-relaxed">
                      {related.excerpt}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[12px] font-bold text-teal-deep group-hover:text-saffron transition-colors">
                    <span>Read Guide</span>
                    <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
