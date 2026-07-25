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
            { name: "Midnight Teal Elegance", color: "from-[#042F2E]/20 to-blue-900/20 border-[#042F2E]/30" },
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

  const boxPrice = 250; 
  const hamperItemsTotal = buildABoxItems.reduce((acc: number, item: any) => acc + item.price, 0);
  const totalHamperPrice = hamperItemsTotal + boxPrice;
  const isFull = buildABoxItems.length >= boxCapacity;

  const handleAddItem = (item: any) => {
    const success = addToBox(item);
    if (!success) {
      // Show alerts or effects
    }
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 py-10 px-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl filter animate-pulse -z-10" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-teal-900/10 rounded-full blur-3xl filter animate-pulse -z-10" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-purple-500/15 border border-purple-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-purple-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Workshop</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Hamper Customization Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Unleash your creativity. Choose your custom box structure, tie ribbon bows, and fill up to 5 delicacies.
          </p>
        </section>

        {/* Builder Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Pane: Customizer Controls */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Box Styles Selection */}
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                <Box className="w-4.5 h-4.5 text-purple-400" />
                <span>1. Packaging Box Style</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {boxStyleList.map((style) => {
                  const isSelected = selectedBoxStyle === style.name;
                  return (
                    <button
                      key={style.name}
                      onClick={() => setSelectedBoxStyle(style.name)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 bg-gradient-to-br ${style.color} ${
                        isSelected
                          ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] scale-[1.01]"
                          : "border-white/5 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">{style.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Lidded rigid board box</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ribbon Styles Selection */}
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                <Sparkles className="w-4.5 h-4.5 text-saffron" />
                <span>2. Silk Ribbon Wrap</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ribbonStyles.map((style) => {
                  const isSelected = selectedRibbonStyle === style.name;
                  return (
                    <button
                      key={style.name}
                      onClick={() => setSelectedRibbonStyle(style.name)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-saffron bg-saffron/10 shadow-[0_0_15px_rgba(249,115,22,0.1)] scale-[1.01]"
                          : "border-white/5 bg-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full ${style.color}`} />
                        <span className="text-xs font-semibold text-white">{style.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-saffron" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Treats Bazaar Selection */}
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-6 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                  <ShoppingBag className="w-4.5 h-4.5 text-teal-400" />
                  <span>3. Treats Bazaar</span>
                </h3>
                {/* Filters */}
                <div className="flex space-x-1.5 flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setBazaarFilter(cat)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors ${
                        bazaarFilter === cat
                          ? "bg-teal-500 text-slate-950 font-black shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
                {filteredBazaar.map((item) => {
                  const currentQty = buildABoxItems.filter((x) => x.id === item.id).length;
                  return (
                    <div
                      key={item.id}
                      className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between space-x-4 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3 text-left">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-white/5" />
                        <div>
                          <span className="text-xs font-bold text-white block leading-tight">{item.name}</span>
                          <span className="text-[10px] text-teal-400 font-bold block mt-0.5">₹{item.price}</span>
                        </div>
                      </div>

                      {/* Add controls */}
                      <div className="flex items-center space-x-2">
                        {currentQty > 0 ? (
                          <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                            <button
                              onClick={() => removeFromBox(item.id)}
                              className="text-xs font-bold text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-white">{currentQty}</span>
                            <button
                              disabled={isFull}
                              onClick={() => handleAddItem(item)}
                              className="text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={isFull}
                            onClick={() => handleAddItem(item)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-200 border border-white/5 disabled:opacity-30 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Pane: Sticky Visual Hamper Preview Card */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-purple-500/5 rounded-full blur-2xl" />
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4 text-left">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Your Box Preview</h3>
                  <span className="text-[10px] text-slate-400">Ribbon: {selectedRibbonStyle}</span>
                </div>
                <button
                  onClick={clearBox}
                  className="text-[10px] font-bold uppercase tracking-wider text-rani-pink/70 hover:text-rani-pink"
                >
                  Reset Drawer
                </button>
              </div>

              {/* Glowing Capacity Bar */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Capacity Filled</span>
                  <span>{buildABoxItems.length} / {boxCapacity} Items</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${(buildABoxItems.length / boxCapacity) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 block leading-normal">Limit up to 5 items to guarantee premium styling and fit.</span>
              </div>

              {/* List of items inside box preview */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-left">
                {buildABoxItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/5 rounded-2xl text-slate-500 space-y-2">
                    <Box className="w-8 h-8 text-white/10" />
                    <span className="text-[11px]">No treats placed in the box yet.</span>
                  </div>
                ) : (
                  buildABoxItems.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                        <span className="text-xs font-bold text-white">{item.name}</span>
                      </div>
                      <button
                        onClick={() => removeFromBox(item.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Invoice Breakdown */}
              <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-left">
                <div className="flex justify-between text-slate-400">
                  <span>Artisan Box Packaging Fee</span>
                  <span className="font-bold text-white">₹{boxPrice}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Selected Treats ({buildABoxItems.length})</span>
                  <span className="font-bold text-white">₹{hamperItemsTotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-teal-400 uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-2">
                  <span>Hamper Subtotal</span>
                  <span className="text-saffron text-base">₹{totalHamperPrice}</span>
                </div>
              </div>

              {/* Move to Bag button */}
              <button
                disabled={buildABoxItems.length === 0}
                onClick={() => {
                  moveBoxToCart(selectedBoxStyle);
                  alert("Bespoke Box added to Gifting Bag!");
                }}
                className="w-full flex items-center justify-center space-x-2 py-4 bg-white text-[#07080B] hover:bg-gold-light rounded-xl font-bold text-sm shadow-lg disabled:opacity-30 disabled:hover:bg-white transition-all transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Box to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple minus icon
function Minus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
  );
}
