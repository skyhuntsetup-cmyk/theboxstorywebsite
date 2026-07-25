"use client";

import React, { useState, useEffect } from "react";
import { useGift } from "../context/GiftContext";
import { Sparkles, Trash2, Box, ShoppingBag, Info, Plus, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

export default function BuildBox() {
  const {
    buildABoxItems,
    boxCapacity,
    addToBox,
    removeFromBox,
    clearBox,
    moveBoxToCart,
  } = useGift();

  const [selectedBoxStyle, setSelectedBoxStyle] = useState<string>("Classic Royal Gold");
  const [selectedRibbonStyle, setSelectedRibbonStyle] = useState<string>("Premium Gold Satin");
  const [bazaarFilter, setBazaarFilter] = useState<string>("All");

  const [bazaarList, setBazaarList] = useState<any[]>([]);
  const [boxStyleList, setBoxStyleList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBazaar = async () => {
      try {
        const { data: bData } = await supabase
          .from("bazaar_items")
          .select("*")
          .eq("is_active", true);

        const { data: bsData } = await supabase
          .from("box_styles")
          .select("*")
          .eq("is_active", true);

        if (bData && bData.length > 0) {
          setBazaarList(bData);
        } else {
          setBazaarList([
            { id: "bz-1", name: "Artisanal Kaju Katli (250g)", price: 450, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80", category: "Sweets" },
            { id: "bz-2", name: "Handcrafted Brass Diya (Pair)", price: 600, image: "https://images.unsplash.com/photo-1605884768395-5cb5dbfb21be?w=300&auto=format&fit=crop&q=80", category: "Decor" },
            { id: "bz-3", name: "Organic Lavender Soy Candle", price: 350, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&auto=format&fit=crop&q=80", category: "Wellness" },
            { id: "bz-4", name: "Premium Kashmiri Saffron (1g)", price: 550, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80", category: "Gourmet" },
            { id: "bz-5", name: "Assorted Dry Fruits (200g)", price: 490, image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=300&auto=format&fit=crop&q=80", category: "Gourmet" },
            { id: "bz-6", name: "Rose Water Facial Mist", price: 320, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80", category: "Wellness" }
          ]);
        }

        if (bsData && bsData.length > 0) {
          setBoxStyleList(bsData);
          setSelectedBoxStyle(bsData[0].name);
        } else {
          const defaultStyles = [
            { name: "Classic Royal Gold", color: "from-[#F97316]/20 to-[#E2BA5F]/30 border-gold/30" },
            { name: "Blossom Rani Pink", color: "from-[#D1126A]/20 to-purple-500/20 border-rani-pink/20" },
            { name: "Midnight Teal Elegance", color: "from-[#042F2E]/20 to-blue-900/20 border-teal-deep/30" },
          ];
          setBoxStyleList(defaultStyles);
          setSelectedBoxStyle(defaultStyles[0].name);
        }
      } catch (err) {
        console.error("Error loading Hamper Studio catalog:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBazaar();
  }, []);

  const ribbonStyles = [
    { name: "Premium Gold Satin", color: "bg-[#E2BA5F]" },
    { name: "Festive Rani Pink Silk", color: "bg-[#D1126A]" },
    { name: "Classic Saffron Bow", color: "bg-[#F97316]" },
  ];

  const categories = ["All", "Sweets", "Decor", "Wellness", "Gourmet"];

  const filteredBazaar = bazaarList.filter(
    (item) => bazaarFilter === "All" || item.category === bazaarFilter
  );

  const boxPrice = 250; // Base package price
  const hamperItemsTotal = buildABoxItems.reduce((acc: number, item: any) => acc + item.price, 0);
  const totalHamperPrice = hamperItemsTotal + boxPrice;
  const isFull = buildABoxItems.length >= boxCapacity;

  const handleAddItem = (item: any) => {
    const success = addToBox(item);
    if (!success) {
      // Could show toast or visual cue
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-1.5 bg-[#D1126A]/10 border border-rani-pink/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-rani-pink uppercase animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hamper Studio</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-teal-deep">
          Build a Bespoke Hamper
        </h1>
        <p className="text-xs sm:text-sm text-teal-deep/75 leading-relaxed">
          Create a personalized gift box. Select a premium packaging style, select up to 5 artisanal treats, and let us package it with love.
        </p>
      </section>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Pane: The Bazaar */}
        <section className="lg:col-span-7 space-y-6">
          {/* Packaging Box Style Selector */}
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-teal-deep/5 shadow-sm space-y-4">
            <h3 className="font-heading text-lg font-bold flex items-center space-x-2">
              <Box className="w-5 h-5 text-saffron" />
              <span>Step 1: Choose Packaging Style</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {boxStyleList.map((style) => {
                const isSelected = selectedBoxStyle === style.name;
                return (
                  <button
                    key={style.name}
                    onClick={() => setSelectedBoxStyle(style.name)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 bg-gradient-to-br ${style.color} ${
                      isSelected
                        ? "border-teal-deep ring-2 ring-teal-deep/10 scale-[1.02]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-teal-deep">{style.name}</span>
                      {isSelected && (
                        <span className="w-4 h-4 bg-teal-deep rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-[#FFFDF5]" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-teal-deep/60">Premium Rigid Box + Gold Ribbons</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ribbon Style Selector */}
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-teal-deep/5 shadow-sm space-y-4">
            <h3 className="font-heading text-lg font-bold flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-rani-pink" />
              <span>Step 1.5: Select Ribbon Style</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ribbonStyles.map((style) => {
                const isSelected = selectedRibbonStyle === style.name;
                return (
                  <button
                    key={style.name}
                    type="button"
                    onClick={() => setSelectedRibbonStyle(style.name)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "border-teal-deep bg-teal-deep/5 ring-2 ring-teal-deep/10 scale-[1.02]"
                        : "border-transparent bg-white hover:border-teal-deep/20"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-3.5 h-3.5 rounded-full ${style.color}`} />
                      <span className="text-xs font-semibold text-teal-deep">{style.name}</span>
                    </div>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 bg-teal-deep rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-[#FFFDF5]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bazaar Items Grid */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/40 p-4 rounded-2xl border border-teal-deep/5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-deep/60">
                Step 2: Add Hamper Delights ({buildABoxItems.length}/5)
              </span>
              {/* Category selector */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setBazaarFilter(cat)}
                    className={`text-[10px] px-3 py-1.5 rounded-full font-bold transition-colors ${
                      bazaarFilter === cat
                        ? "bg-teal-deep text-[#FFFDF5]"
                        : "bg-white border border-teal-deep/15 text-teal-deep hover:border-teal-deep"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of bazaar items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredBazaar.map((item) => {
                const countInBox = buildABoxItems.filter((i: any) => i.id === item.id).length;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    className="group bg-white rounded-2xl border border-teal-deep/5 p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {/* Item Image */}
                    <div className="aspect-square bg-teal-deep/5 rounded-xl overflow-hidden flex items-center justify-center mb-3 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80";
                        }}
                      />
                      {countInBox > 0 && (
                        <span className="absolute top-2 right-2 bg-rani-pink text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                          {countInBox}
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-teal-deep line-clamp-1 group-hover:text-rani-pink transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-teal-deep/80">₹{item.price}</span>
                        <button
                          disabled={isFull}
                          onClick={() => handleAddItem(item)}
                          className={`p-1 rounded-full border transition-all duration-200 ${
                            isFull
                              ? "border-teal-deep/10 text-teal-deep/20 cursor-not-allowed"
                              : "border-teal-deep text-teal-deep hover:bg-teal-deep hover:text-white transform active:scale-90"
                          }`}
                          title={isFull ? "Box Full" : "Add to Box"}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Pane: Sticky Visual Container "Your Hamper" */}
        <section className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="bg-[#042F2E] text-[#FFFDF5] p-6 rounded-[32px] border border-white/10 shadow-lg space-y-6">
            {/* Visual Box Rendering */}
            <div className="border-2 border-dashed border-[#FFFDF5]/20 p-6 rounded-2xl relative bg-[#042F2E]/60 overflow-hidden">
              {/* Packaging Name */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col space-y-0.5 text-left">
                  <div className="flex items-center space-x-1.5">
                    <Box className="w-4 h-4 text-saffron" />
                    <span className="text-xs font-bold text-[#FFFDF5]/80">{selectedBoxStyle}</span>
                  </div>
                  <span className="text-[10px] text-[#FFFDF5]/50 italic">Ribbon: {selectedRibbonStyle}</span>
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">Base Box Fee: ₹{boxPrice}</span>
              </div>

              {/* Added items list with Framer Motion Layout animations */}
              <div className="min-h-[160px] flex flex-col justify-center">
                {buildABoxItems.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <Box className="w-10 h-10 text-white/20 mx-auto animate-bounce" />
                    <p className="text-xs text-[#FFFDF5]/50">Your hamper is empty</p>
                    <p className="text-[10px] text-[#FFFDF5]/30">Add goodies from the bazaar on the left</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {buildABoxItems.map((item: any, index: number) => (
                        <motion.div
                          key={`${item.id}-${index}`}
                          initial={{ opacity: 0, scale: 0.85, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.85, x: -20 }}
                          layout
                          className="flex items-center justify-between p-2 bg-[#FFFDF5]/10 rounded-xl border border-white/5 group"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80";
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold truncate max-w-[150px]">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-gold">₹{item.price}</span>
                            <button
                              onClick={() => removeFromBox(item.id)}
                              className="p-1 hover:bg-white/10 text-[#FFFDF5]/40 hover:text-white rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#FFFDF5]/70">Hamper Capacity</span>
                <span className={isFull ? "text-saffron" : "text-[#FFFDF5]"}>
                  {buildABoxItems.length} of {boxCapacity} Items
                </span>
              </div>
              <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(buildABoxItems.length / boxCapacity) * 100}%` }}
                  className="h-full bg-gradient-to-r from-saffron to-rani-pink rounded-full"
                />
              </div>
              <p className="text-[10px] text-[#FFFDF5]/40 leading-relaxed">
                Add at least 1 item to proceed. A maximum of 5 items guarantees clean packing.
              </p>
            </div>

            {/* Invoice breakdown */}
            {buildABoxItems.length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-[#FFFDF5]/70">
                  <span>Hamper Items Total</span>
                  <span>₹{hamperItemsTotal}</span>
                </div>
                <div className="flex justify-between text-xs text-[#FFFDF5]/70">
                  <span>Gift Box & Ribbons</span>
                  <span>₹{boxPrice}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-2">
                  <span>Subtotal Price</span>
                  <span className="text-gold">₹{totalHamperPrice}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              {buildABoxItems.length > 0 && (
                <button
                  onClick={clearBox}
                  className="px-4 py-3 bg-[#FFFDF5]/10 hover:bg-[#FFFDF5]/15 text-[#FFFDF5] rounded-xl text-xs font-bold transition-colors"
                >
                  Clear Box
                </button>
              )}
              <button
                disabled={buildABoxItems.length === 0}
                onClick={() => moveBoxToCart(`${selectedBoxStyle} with ${selectedRibbonStyle}`)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  buildABoxItems.length === 0
                    ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                    : "bg-[#FFFDF5] hover:bg-gold-light text-teal-deep shadow-md hover:shadow-lg transform active:scale-[0.98]"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Hamper to Bag</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
