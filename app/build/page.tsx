"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGift, BoxItem } from "../context/GiftContext";
import { Sparkles, Trash2, Box, ShoppingBag, Plus, Minus, Check, ArrowLeft, ArrowRight, MessageSquareHeart } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface BazaarListItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface BoxStyleListItem {
  name: string;
  color: string;
}

const STEPS = [
  { key: "packaging", label: "Packaging" },
  { key: "products", label: "Products" },
  { key: "message", label: "Greeting Card" },
  { key: "review", label: "Review & Checkout" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export default function BuildBox() {
  const router = useRouter();
  const {
    buildABoxItems,
    boxCapacity,
    addToBox,
    removeFromBox,
    clearBox,
    moveBoxToCart,
  } = useGift();

  const [step, setStep] = useState<StepKey>("packaging");
  const [selectedBoxStyle, setSelectedBoxStyle] = useState<string>("Classic Royal Gold");
  const [selectedRibbonStyle, setSelectedRibbonStyle] = useState<string>("Premium Gold Satin");
  const [giftMessage, setGiftMessage] = useState<string>("");
  const [bazaarFilter, setBazaarFilter] = useState<string>("All");

  const [bazaarList, setBazaarList] = useState<BazaarListItem[]>([]);
  const [boxStyleList, setBoxStyleList] = useState<BoxStyleListItem[]>([]);
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
            { name: "Classic Royal Gold", color: "from-amber-50 to-amber-100/50 border-amber-200" },
            { name: "Blossom Rani Pink", color: "from-pink-50 to-pink-100/50 border-pink-200" },
            { name: "Midnight Teal Elegance", color: "from-teal-50 to-teal-100/50 border-teal-200" },
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
  const hamperItemsTotal = buildABoxItems.reduce((acc: number, item: BoxItem) => acc + item.price, 0);
  const totalHamperPrice = hamperItemsTotal + boxPrice;
  const isFull = buildABoxItems.length >= boxCapacity;

  const handleAddItem = (item: BoxItem) => {
    addToBox(item);
  };

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const canLeaveProducts = buildABoxItems.length > 0;

  const goNext = () => {
    if (step === "products" && !canLeaveProducts) return;
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next.key);
  };
  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev.key);
  };

  const handleCheckout = () => {
    moveBoxToCart(selectedBoxStyle, giftMessage);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 py-10 px-6 relative overflow-hidden">
      {/* Decorative light ambient glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-teal-50 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-teal-deep/5 border border-teal-deep/15 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-deep uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Customizer</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-teal-deep tracking-tight">
            Hamper Customization Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Build your own box in four simple steps — packaging, products, a personal message, then checkout.
          </p>
        </section>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {STEPS.map((s, idx) => {
            const isDone = idx < stepIndex;
            const isActive = idx === stepIndex;
            return (
              <React.Fragment key={s.key}>
                <button
                  onClick={() => (idx <= stepIndex || (idx === stepIndex + 1 && canLeaveProducts)) && setStep(s.key)}
                  className="flex items-center gap-2 group"
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-colors ${
                      isActive
                        ? "bg-teal-deep text-white"
                        : isDone
                        ? "bg-teal-deep/15 text-teal-deep"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </span>
                  <span className={`hidden sm:inline text-[11px] font-bold uppercase tracking-wider ${isActive ? "text-teal-deep" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && <span className="w-6 sm:w-10 h-px bg-slate-200" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6 text-left">
            {step === "packaging" && (
              <>
                <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 flex items-center space-x-2">
                    <Box className="w-4.5 h-4.5 text-teal-deep" />
                    <span>Packaging Box Style</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {boxStyleList.map((bstyle) => {
                      const isSelected = selectedBoxStyle === bstyle.name;
                      return (
                        <button
                          key={bstyle.name}
                          onClick={() => setSelectedBoxStyle(bstyle.name)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-300 bg-gradient-to-br ${
                            bstyle.color || "from-amber-50 to-amber-100/50 border-amber-200"
                          } ${
                            isSelected
                              ? "border-teal-deep ring-2 ring-teal-deep/10 shadow-sm scale-[1.01]"
                              : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-teal-deep">{bstyle.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-teal-deep" />}
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">Lidded rigid board box</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 flex items-center space-x-2">
                    <Sparkles className="w-4.5 h-4.5 text-saffron" />
                    <span>Silk Ribbon Wrap</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ribbonStyles.map((rstyle) => {
                      const isSelected = selectedRibbonStyle === rstyle.name;
                      return (
                        <button
                          key={rstyle.name}
                          onClick={() => setSelectedRibbonStyle(rstyle.name)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-saffron bg-saffron/5 shadow-sm scale-[1.01]"
                              : "border-slate-200 bg-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full ${rstyle.color}`} />
                            <span className="text-xs font-semibold text-slate-800">{rstyle.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-saffron" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {step === "products" && (
              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 flex items-center space-x-2">
                    <ShoppingBag className="w-4.5 h-4.5 text-teal-deep" />
                    <span>Treats Bazaar</span>
                  </h3>
                  <div className="flex space-x-1.5 flex-wrap gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setBazaarFilter(cat)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors ${
                          bazaarFilter === cat
                            ? "bg-teal-deep text-white font-black shadow-sm"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {isLoading ? (
                  <p className="text-xs text-slate-400 text-center py-8">Loading treats...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-1">
                    {filteredBazaar.map((item) => {
                      const currentQty = buildABoxItems.filter((x) => x.id === item.id).length;
                      return (
                        <div
                          key={item.id}
                          className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between space-x-4 hover:border-slate-350 transition-colors"
                        >
                          <div className="flex items-center space-x-3 text-left">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block leading-tight">{item.name}</span>
                              <span className="text-[10px] text-teal-deep font-bold block mt-0.5">₹{item.price}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {currentQty > 0 ? (
                              <div className="flex items-center space-x-2.5 bg-white border border-slate-200 rounded-xl px-2 py-1">
                                <button
                                  onClick={() => removeFromBox(item.id)}
                                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold text-slate-800">{currentQty}</span>
                                <button
                                  disabled={isFull}
                                  onClick={() => handleAddItem(item)}
                                  className="text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                disabled={isFull}
                                onClick={() => handleAddItem(item)}
                                className="p-2 bg-white hover:bg-slate-50 rounded-xl text-slate-600 border border-slate-200 disabled:opacity-30 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!canLeaveProducts && (
                  <p className="text-[10px] text-rani-pink font-semibold">Add at least one treat to continue.</p>
                )}
              </div>
            )}

            {step === "message" && (
              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 flex items-center space-x-2">
                  <MessageSquareHeart className="w-4.5 h-4.5 text-rani-pink" />
                  <span>Greeting Card Message</span>
                </h3>
                <p className="text-xs text-slate-500">Optional — write a note and we&apos;ll include a printed card in the box. Leave it blank to skip the card.</p>
                <textarea
                  rows={5}
                  maxLength={400}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="e.g. Happy Diwali! Wishing you a year full of light and laughter. With love, Aastha."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm italic font-medium focus:outline-none focus:border-rani-pink/40 resize-none font-heading text-teal-deep/90"
                />
                <span className="text-[10px] text-slate-400 block text-right">{giftMessage.length}/400</span>

                {giftMessage.trim() && (
                  <div className="border-t border-slate-100 pt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Card Preview</span>
                    <div className="bg-[#FAF4E8] border border-gold/20 rounded-2xl p-6 text-center">
                      <p className="font-heading italic text-sm text-teal-deep/90 leading-relaxed whitespace-pre-wrap">{giftMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === "review" && (
              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-5 shadow-sm">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500">Review Your Box</h3>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500"><span>Box Style</span><span className="font-bold text-slate-800">{selectedBoxStyle}</span></div>
                  <div className="flex justify-between text-slate-500"><span>Ribbon</span><span className="font-bold text-slate-800">{selectedRibbonStyle}</span></div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Treats ({buildABoxItems.length})</span>
                  {buildABoxItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-600">
                      <span>{item.name}</span>
                      <span className="font-bold">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Greeting Card</span>
                  {giftMessage.trim() ? (
                    <p className="font-heading italic text-xs text-teal-deep/80 leading-relaxed">&quot;{giftMessage}&quot;</p>
                  ) : (
                    <p className="text-xs text-slate-400">No card message added.</p>
                  )}
                </div>
              </div>
            )}

            {/* Step navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={goBack}
                disabled={stepIndex === 0}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-0 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {step !== "review" ? (
                <button
                  onClick={goNext}
                  disabled={step === "products" && !canLeaveProducts}
                  className="flex items-center space-x-1.5 text-xs font-bold bg-teal-deep text-white px-5 py-2.5 rounded-xl disabled:opacity-30 hover:bg-teal-deep/90 transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={buildABoxItems.length === 0}
                  className="flex items-center space-x-2 text-xs font-bold bg-teal-deep text-white px-6 py-3 rounded-xl disabled:opacity-30 hover:bg-teal-deep/90 transition-colors shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Pane: Sticky Visual Hamper Preview Card */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-md rounded-[40px]">

              <div className="flex justify-between items-center border-b border-slate-100 pb-4 text-left">
                <div>
                  <h3 className="font-heading text-lg font-bold text-teal-deep">Your Box Preview</h3>
                  <span className="text-[10px] text-slate-500">Ribbon: {selectedRibbonStyle}</span>
                </div>
                <button
                  onClick={clearBox}
                  className="text-[10px] font-bold uppercase tracking-wider text-rani-pink hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Capacity Filled</span>
                  <span>{buildABoxItems.length} / {boxCapacity} Items</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-teal-deep to-saffron transition-all duration-300"
                    style={{ width: `${(buildABoxItems.length / boxCapacity) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-400 block leading-normal">Limit up to 5 items to guarantee premium styling and fit.</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-left">
                {buildABoxItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 border border-dashed border-slate-200 rounded-2xl text-slate-400 space-y-2">
                    <Box className="w-8 h-8 text-slate-300" />
                    <span className="text-[11px]">No treats placed in the box yet.</span>
                  </div>
                ) : (
                  buildABoxItems.map((item: BoxItem, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                        <span className="text-xs font-bold text-slate-800">{item.name}</span>
                      </div>
                      <button
                        onClick={() => removeFromBox(item.id)}
                        className="text-slate-400 hover:text-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-left">
                <div className="flex justify-between text-slate-500">
                  <span>Artisan Box Packaging Fee</span>
                  <span className="font-bold text-slate-800">₹{boxPrice}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Selected Treats ({buildABoxItems.length})</span>
                  <span className="font-bold text-slate-800">₹{hamperItemsTotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-emerald-600 uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-slate-100 pt-2">
                  <span>Hamper Subtotal</span>
                  <span className="text-saffron text-base">₹{totalHamperPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
