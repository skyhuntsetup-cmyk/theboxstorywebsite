"use client";

import React, { useState, useMemo } from "react";
import { curatedProducts } from "../../data/products";
import { ProductCard } from "../../components/ProductCard";
import { SlidersHorizontal, Gift, X, Tag, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Collections() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("All");

  const categories = ["All", "Diwali", "Weddings", "Anniversary", "Corporate", "Housewarming"];

  const visualCategories = [
    { name: "All", label: "All Gifts", icon: "/images/icons/icon_couple.png" },
    { name: "Diwali", label: "Diwali", icon: "/images/icons/icon_diwali.png" },
    { name: "Weddings", label: "Weddings", icon: "/images/icons/icon_wedding.png" },
    { name: "Anniversary", label: "Anniversary", icon: "/images/icons/icon_anniversary.png" },
    { name: "Corporate", label: "Corporate", icon: "/images/icons/icon_corporate.png" },
    { name: "Housewarming", label: "Housewarming", icon: "/images/icons/icon_housewarming.png" }
  ];

  const priceRanges = [
    { label: "All Prices", value: "All" },
    { label: "Under ₹2,000", value: "under2000" },
    { label: "₹2,000 - ₹3,000", value: "2000to3000" },
    { label: "Over ₹3,000", value: "over3000" },
  ];

  const filteredProducts = useMemo(() => {
    return curatedProducts.filter((product) => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      
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
  }, [selectedCategory, selectedPriceRange]);

  return (
    <div className="min-h-screen bg-background text-slate-800 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Banner: Clean Minimalist Editorial Layout */}
        <section className="relative rounded-[32px] overflow-hidden bg-white border border-slate-200/60 p-8 md:p-14 shadow-sm text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-100 rounded-full blur-3xl -z-10" />
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] tracking-widest font-black uppercase text-slate-400 block">
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
        </section>

        {/* Visual Category Filters */}
        <section className="bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-sm">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {visualCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="group flex flex-col items-center space-y-2 focus:outline-none transition-all w-16 sm:w-20"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border p-0.5 transition-all duration-300 relative bg-white flex items-center justify-center ${
                  selectedCategory === cat.name
                    ? "border-rani-pink shadow-md scale-105"
                    : "border-slate-200/65 shadow-sm group-hover:border-slate-350 hover:shadow"
                }`}>
                  <img
                    src={cat.icon}
                    alt={cat.label}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {selectedCategory === cat.name && (
                    <div className="absolute inset-0 bg-rani-pink/5 rounded-full flex items-center justify-center">
                      <div className="absolute bottom-1 bg-rani-pink text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">
                        Active
                      </div>
                    </div>
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-bold transition-colors text-center ${
                  selectedCategory === cat.name
                    ? "text-rani-pink font-extrabold"
                    : "text-slate-500 group-hover:text-slate-900"
                }`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1" />
                <span>Categories</span>
              </span>
              <div className="flex flex-col space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-semibold px-3.5 py-2.5 rounded-xl text-left transition-all ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {cat === "All" ? "All Occated Boxes" : `${cat} Gifts`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
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
              {(selectedCategory !== "All" || selectedPriceRange !== "All") && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedPriceRange("All");
                  }}
                  className="flex items-center text-slate-950 font-bold hover:underline"
                >
                  Clear Filters
                  <X className="w-3.5 h-3.5 ml-1" />
                </button>
              )}
            </div>

            {/* Grid Container */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full py-20 text-center space-y-3"
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
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
