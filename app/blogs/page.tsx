"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { getAllBlogPosts, UnifiedBlogPost } from "../../lib/blog";
import { Search, Calendar, Clock, BookOpen, ChevronRight, Sparkles, Loader } from "lucide-react";

export default function BlogsIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [blogPosts, setBlogPosts] = useState<UnifiedBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllBlogPosts().then((posts) => {
      setBlogPosts(posts);
      setIsLoading(false);
    });
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))],
    [blogPosts]
  );

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background text-slate-800 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Banner Section */}
        <section className="relative rounded-[40px] overflow-hidden bg-white border border-slate-200 p-8 md:p-16 shadow-sm text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FAF4E8]/40 rounded-full blur-3xl -z-10" />

          <div className="max-w-2xl space-y-4">
            <span className="text-[10px] tracking-widest font-black uppercase text-saffron bg-saffron/10 px-3 py-1.5 rounded-full inline-block border border-saffron/20">
              GIFTING INSIGHTS & INSPIRATION
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-light text-slate-900 leading-tight">
              The Box Story <br />
              <span className="font-black italic text-slate-700">Inspiration Board</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Curated tips, step-by-step guides, and styling inspiration for customized hampers, premium B2B corporate kits, and festive Diwali celebrations.
            </p>
          </div>
        </section>

        {/* Filters and Search Bar Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-bold px-4 py-2.5 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search inspiration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold focus:outline-none focus:border-slate-400 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Articles Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full py-20 flex justify-center">
              <Loader className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-550">No articles match your search query.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-[420px]"
              >
                {/* Visual Header featuring Watercolor Icon */}
                <div className="relative h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-28 h-28 object-contain rounded-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200/60 text-[8px] font-black uppercase tracking-widest text-slate-600 px-2.5 py-1 rounded-full shadow-sm">
                    {post.category}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.publishedAt}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-slate-900 line-clamp-2 group-hover:text-teal-deep transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto text-[11px] font-bold text-teal-deep group-hover:text-saffron transition-colors">
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pinterest Sharing Callout */}
        <section className="bg-white border border-slate-200/60 rounded-[32px] p-8 text-center space-y-4 shadow-sm">
          <Sparkles className="w-6 h-6 text-saffron mx-auto animate-pulse" />
          <h3 className="font-heading text-lg font-bold text-slate-950">Love Gifting Boards?</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Follow our styling updates. All articles feature pre-configured pins—simply click on any post and use our one-click Pinterest Save button to bookmark them!
          </p>
        </section>
      </div>
    </div>
  );
}
