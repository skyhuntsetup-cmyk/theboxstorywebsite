"use client";

import React, { useState, useMemo } from "react";
import { curatedProducts } from "../../data/products";
import { ProductCard } from "../../components/ProductCard";
import { Filter, SlidersHorizontal, Gift, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Collections() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("All");

  const categories = ["All", "Diwali", "Weddings", "Anniversary", "Corporate", "Housewarming"];

  const priceRanges = [
    { label: "All Prices", value: "All" },
    { label: "Under ₹2,000", value: "under2000" },
    { label: "₹2,000 - ₹3,000", value: "2000to3000" },
    { label: "Over ₹3,000", value: "over3000" },
  ];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return curatedProducts.filter((product) => {
      // Category Match
      const categoryMatch =
        selectedCategory === "All" || product.category === selectedCategory;

      // Price Match
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
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
      {/* Banner Header */}
      <section className="relative rounded-[32px] overflow-hidden bg-teal-deep text-[#FFFDF5] p-8 md:p-12 border border-teal-deep/10 shadow-lg">
        {/* Decorative Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-deep to-[#031d1d] -z-10" />
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-rani-pink/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-[250px] h-[250px] bg-saffron/10 rounded-full blur-3xl" />

        <div className="space-y-4 max-w-xl relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-saffron/10 border border-saffron/20 px-3 py-1 rounded-full text-xs font-bold text-saffron uppercase">
            <Gift className="w-3.5 h-3.5" />
            <span>Ready-made Curations</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            Exquisite Pre-Curated Gift Sets
          </h1>
          <p className="text-xs sm:text-sm text-[#FFFDF5]/70 leading-relaxed">
            Beautiful gift boxes filled with premium treats, handcrafted items, and luxurious wellness products. Ready to deliver instantly to your loved ones.
          </p>
        </div>
      </section>

      {/* Main Catalog Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-teal-deep/5 shadow-sm">
          <div className="flex items-center justify-between border-b border-teal-deep/10 pb-4">
            <div className="flex items-center space-x-2 text-teal-deep font-bold">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </div>
            {(selectedCategory !== "All" || selectedPriceRange !== "All") && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedPriceRange("All");
                }}
                className="text-xs font-semibold text-rani-pink hover:underline flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Occasions Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-deep/50">
              Occasions
            </h4>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-4 py-2 rounded-full font-semibold transition-all duration-200 border ${
                      isActive
                        ? "bg-teal-deep border-teal-deep text-[#FFFDF5]"
                        : "bg-[#FFFDF5] border-teal-deep/15 text-teal-deep/80 hover:border-teal-deep"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-deep/50">
              Price Range
            </h4>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {priceRanges.map((range) => {
                const isActive = selectedPriceRange === range.value;
                return (
                  <button
                    key={range.value}
                    onClick={() => setSelectedPriceRange(range.value)}
                    className={`text-xs px-4 py-2 rounded-full font-semibold transition-all duration-200 border ${
                      isActive
                        ? "bg-teal-deep border-teal-deep text-[#FFFDF5]"
                        : "bg-[#FFFDF5] border-teal-deep/15 text-teal-deep/80 hover:border-teal-deep"
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Catalog Grid */}
        <section className="lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center text-xs text-teal-deep/60 px-2">
            <span>
              Showing <strong className="text-teal-deep">{filteredProducts.length}</strong> items
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white/40 border border-teal-deep/5 p-12 rounded-3xl text-center space-y-3"
              >
                <Gift className="w-12 h-12 text-teal-deep/30 mx-auto" />
                <h3 className="font-heading text-lg font-bold text-teal-deep">
                  No Hampers Found
                </h3>
                <p className="text-xs text-teal-deep/60 max-w-sm mx-auto">
                  We don&apos;t have items matching this combination. Try clearing filters or launching our Build-a-Box tool to make your own.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedPriceRange("All");
                  }}
                  className="mt-2 text-xs font-bold bg-teal-deep hover:bg-teal-deep/90 text-[#FFFDF5] px-6 py-2.5 rounded-full"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} layout>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
