"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { ProductCard } from "../../components/ProductCard";
import { SlidersHorizontal, Gift, X, Tag, IndianRupee, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CategoryRow, ProductWithCategories } from "../../lib/types";
import { revealProps } from "../../lib/motion";

// Curated icons for categories that have one in /public/images/icons; anything
// else (including new categories added later via the admin) falls back to a
// generic gift icon so the page never shows a broken image.
const CATEGORY_ICONS: Record<string, string> = {
  "for-him": "/images/icons/icon_him.png",
  "for-her": "/images/icons/icon_her.png",
  "anniversary": "/images/icons/icon_anniversary.png",
  "diwali": "/images/icons/icon_diwali.png",
  "weddings": "/images/icons/icon_wedding.png",
  "corporate": "/images/icons/icon_corporate.png",
  "housewarming": "/images/icons/icon_housewarming.png",
};

export default function Collections() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("All");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [{ data: catData }, { data: storeData }] = await Promise.all([
          supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
          supabase.from("stores").select("id").eq("slug", "pre-curated-collections").maybeSingle(),
        ]);
        if (catData) setCategories(catData);

        if (storeData) {
          const { data: prodData } = await supabase
            .from("products")
            .select("*, product_categories(category_id), product_stores!inner(store_id)")
            .eq("product_stores.store_id", storeData.id)
            .order("name");
          if (prodData) {
            setProducts(
              prodData.map((p) => {
                const { product_categories, product_stores, ...rest } = p as typeof p & {
                  product_categories: { category_id: string }[];
                  product_stores: { store_id: string }[];
                };
                return {
                  ...rest,
                  categoryIds: (product_categories || []).map((pc: { category_id: string }) => pc.category_id),
                  storeIds: (product_stores || []).map((ps: { store_id: string }) => ps.store_id),
                };
              })
            );
          }
        }
      } catch (err) {
        console.error("Failed to load collections:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const priceRanges = [
    { label: "All Prices", value: "All" },
    { label: "Under ₹2,000", value: "under2000" },
    { label: "₹2,000 - ₹3,000", value: "2000to3000" },
    { label: "Over ₹3,000", value: "over3000" },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategoryId === "All" || product.categoryIds.includes(selectedCategoryId);

      let priceMatch = true;
      if (selectedPriceRange === "under2000") {
        priceMatch = product.price < 2000;
      } else if (selectedPriceRange === "2000to3000") {
        priceMatch = product.price >= 2000 && product.price <= 3000;
      } else if (selectedPriceRange === "over3000") {
        priceMatch = product.price > 3000;
      }

      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategoryId, selectedPriceRange]);

  return (
    <div className="min-h-screen bg-background text-slate-800 py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Banner: Clean Minimalist Editorial Layout */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[32px] overflow-hidden bg-white border border-slate-200/60 p-8 md:p-14 shadow-sm text-left"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-100 rounded-full blur-3xl -z-10" />
          <div className="space-y-4 max-w-xl">
            <span className="text-[12px] tracking-widest font-black uppercase text-slate-400 block">
              Pre-Curated Selection
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-light text-slate-900 tracking-tight leading-tight">
              Ready-made <br />
              <span className="font-black italic text-slate-700">Curated Sets</span>
            </h1>
            <div className="w-12 h-0.5 bg-slate-900" />
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Discover gift box curations styled for Diwali, luxury marriages, B2B milestones, and corporate celebrations.
            </p>
          </div>
        </motion.section>

        {/* Visual Category Filters */}
        <motion.section {...revealProps} className="bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-sm">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            <button
              onClick={() => setSelectedCategoryId("All")}
              className="group flex flex-col items-center space-y-2 focus:outline-none transition-all w-16 sm:w-20"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border p-0.5 transition-all duration-300 relative bg-white flex items-center justify-center ${
                selectedCategoryId === "All"
                  ? "border-rani-pink shadow-md scale-105"
                  : "border-slate-200/65 shadow-sm group-hover:border-slate-350 hover:shadow"
              }`}>
                <Gift className="w-7 h-7 text-teal-deep/70" />
              </div>
              <span className={`text-[12px] sm:text-xs font-bold transition-colors text-center ${
                selectedCategoryId === "All" ? "text-rani-pink font-extrabold" : "text-slate-500 group-hover:text-slate-900"
              }`}>
                All Gifts
              </span>
            </button>
            {categories.map((cat) => {
              const icon = cat.image || CATEGORY_ICONS[cat.slug];
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className="group flex flex-col items-center space-y-2 focus:outline-none transition-all w-16 sm:w-20"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border p-0.5 transition-all duration-300 relative bg-white flex items-center justify-center ${
                    selectedCategoryId === cat.id
                      ? "border-rani-pink shadow-md scale-105"
                      : "border-slate-200/65 shadow-sm group-hover:border-slate-350 hover:shadow"
                  }`}>
                    {icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={icon} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Gift className="w-7 h-7 text-teal-deep/70" />
                    )}
                  </div>
                  <span className={`text-[12px] sm:text-xs font-bold transition-colors text-center ${
                    selectedCategoryId === cat.id ? "text-rani-pink font-extrabold" : "text-slate-500 group-hover:text-slate-900"
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Catalog Body with Split Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

          {/* Sticky Left Filter Sidebar */}
          <aside className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-3xl space-y-8 sticky top-24 text-left shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <SlidersHorizontal className="w-4.5 h-4.5 text-slate-900" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Filters</h3>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1" />
                <span>Categories</span>
              </span>
              <div className="flex flex-col space-y-1.5">
                <button
                  onClick={() => setSelectedCategoryId("All")}
                  className={`text-xs font-semibold px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    selectedCategoryId === "All" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  All Occasion Boxes
                </button>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/collections/${cat.slug}`}
                    className="text-xs font-semibold px-3.5 py-2.5 rounded-xl text-left transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900 block"
                  >
                    {cat.name} Gifts
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <IndianRupee className="w-3.5 h-3.5 mr-1" />
                <span>Budget Tier</span>
              </span>
              <div className="flex flex-col space-y-1.5">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedPriceRange(range.value)}
                    className={`text-xs font-semibold px-3.5 py-2.5 rounded-xl text-left transition-all ${
                      selectedPriceRange === range.value
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-3 space-y-6 text-left">
            <div className="flex justify-between items-center text-xs text-slate-400 px-2">
              <span>Showing <strong>{filteredProducts.length}</strong> items matching filters</span>
              {(selectedCategoryId !== "All" || selectedPriceRange !== "All") && (
                <button
                  onClick={() => {
                    setSelectedCategoryId("All");
                    setSelectedPriceRange("All");
                  }}
                  className="flex items-center text-slate-950 font-bold hover:underline"
                >
                  Clear Filters
                  <X className="w-3.5 h-3.5 ml-1" />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-14 flex justify-center">
                <Loader className="w-6 h-6 text-slate-400 animate-spin" />
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full py-14 text-center space-y-3"
                    >
                      <Gift className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold text-slate-600">No curations match these filters.</p>
                    </motion.div>
                  ) : (
                    filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ProductCard product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image || "",
                          description: product.description || "",
                          badge: product.badge || undefined,
                          stock_quantity: product.stock_quantity,
                        }} />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
