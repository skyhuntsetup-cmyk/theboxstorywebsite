"use client";

import React, { useState, useEffect, useMemo } from "react";
import { jsPDF } from "jspdf";
import { supabase } from "../../lib/supabase";
import { ShoppingBag, Plus, Minus, Trash2, Building2, Loader, CheckCircle2, X, ArrowRight, Download } from "lucide-react";
import type { CategoryRow, ProductWithCategories, CatalogueCartItem } from "../../lib/types";

const LEAD_STORAGE_KEY = "tbs_corporate_quote_lead";

export default function CorporateQuotePage() {
  const [step, setStep] = useState<"info" | "browse" | "submitted">("info");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
  const [isLoadingCatalogue, setIsLoadingCatalogue] = useState(true);

  const [cart, setCart] = useState<CatalogueCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(LEAD_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.whatsapp && parsed.company) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from sessionStorage, only possible post-mount
          setName(parsed.name);
          setWhatsapp(parsed.whatsapp);
          setCompany(parsed.company);
          setEmail(parsed.email || "");
          setStep("browse");
        }
      } catch {
        // ignore corrupt storage
      }
    }
  }, []);

  useEffect(() => {
    if (step !== "browse") return;
    const load = async () => {
      setIsLoadingCatalogue(true);
      try {
        const [{ data: catData }, { data: prodData }] = await Promise.all([
          supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
          supabase.from("products").select("*, product_categories(category_id)").order("name"),
        ]);
        if (catData) {
          setCategories(catData);
          const corporate = catData.find((c) => c.slug === "corporate");
          if (corporate) {
            setSelectedCategoryId(corporate.id);
          }
        }
        if (prodData) {
          setProducts(
            prodData.map((p) => {
              const { product_categories, ...rest } = p as typeof p & { product_categories: { category_id: string }[] };
              return { ...rest, categoryIds: (product_categories || []).map((pc: { category_id: string }) => pc.category_id) };
            })
          );
        }
      } catch (err) {
        console.error("Failed to load corporate quote catalogue:", err);
      } finally {
        setIsLoadingCatalogue(false);
      }
    };
    load();
  }, [step]);

  const handleStartBrowsing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || !company.trim()) return;
    sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify({ name: name.trim(), whatsapp: whatsapp.trim(), company: company.trim(), email: email.trim() }));
    setStep("browse");
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "All") return products;
    return products.filter((p) => p.categoryIds.includes(selectedCategoryId));
  }, [products, selectedCategoryId]);

  const addToCart = (product: ProductWithCategories) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image || "", quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const doc = new jsPDF();
      let y = 20;
      doc.setFontSize(18);
      doc.text("The Box Story", 14, y);
      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text("Corporate Gift Quote Request", 14, y);
      y += 10;

      doc.setTextColor(0);
      doc.setFontSize(11);
      doc.text(`Company: ${company}`, 14, y); y += 6;
      doc.text(`Contact: ${name}`, 14, y); y += 6;
      doc.text(`WhatsApp: ${whatsapp}`, 14, y); y += 6;
      doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 14, y); y += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Item", 14, y);
      doc.text("Qty", 130, y);
      doc.text("Price", 150, y);
      doc.text("Subtotal", 175, y);
      doc.setFont("helvetica", "normal");
      y += 4;
      doc.line(14, y, 196, y);
      y += 6;

      cart.forEach((item) => {
        doc.text(item.name.slice(0, 55), 14, y);
        doc.text(String(item.quantity), 130, y);
        doc.text(`Rs ${item.price}`, 150, y);
        doc.text(`Rs ${item.price * item.quantity}`, 175, y);
        y += 7;
      });

      y += 4;
      doc.line(14, y, 196, y);
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Tentative Total: Rs ${subtotal}`, 150, y);
      doc.save(`TheBoxStory-Corporate-Quote-${Date.now()}.pdf`);

      const res = await fetch("/api/catalogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp, cart_items: cart, subtotal, company, email, source: "corporate" }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("submitted");
      } else {
        alert("Submission failed: " + data.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "info") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6 text-center">
          <div className="w-14 h-14 bg-amber-950/5 rounded-2xl flex items-center justify-center mx-auto text-amber-950">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-black text-teal-deep">Corporate Quote Builder</h1>
            <p className="text-xs text-slate-500">Browse our catalogue and build a tentative selection — we&apos;ll follow up with pricing and next steps.</p>
          </div>
          <form onSubmit={handleStartBrowsing} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-teal-deep/60 uppercase tracking-wider">Company Name</label>
              <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Pvt Ltd"
                className="w-full bg-background border border-teal-deep/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-deep/40" />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-teal-deep/60 uppercase tracking-wider">Your Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-background border border-teal-deep/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-deep/40" />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-teal-deep/60 uppercase tracking-wider">WhatsApp Number</label>
              <input type="tel" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-background border border-teal-deep/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-deep/40" />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-teal-deep/60 uppercase tracking-wider">Email (optional)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-background border border-teal-deep/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-deep/40" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-amber-950 hover:bg-amber-900 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center space-x-2">
              <span>Start Building</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === "submitted") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-4 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <h1 className="font-heading text-2xl font-black text-teal-deep">Quote Request Sent</h1>
          <p className="text-xs text-slate-500">Thanks, {name.split(" ")[0]}! We&apos;ve received {company}&apos;s tentative selection and will follow up on WhatsApp with pricing and next steps.</p>
          <p className="text-[12px] text-teal-deep/40">A PDF copy has been downloaded for your records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-800 py-8 px-6 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-teal-deep">{company}&apos;s Tentative Selection</h1>
            <p className="text-xs text-slate-500">Add anything you&apos;d like a quote for — nothing is final until we confirm together.</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 bg-white border border-teal-deep/15 px-4 py-2.5 rounded-full text-xs font-bold text-teal-deep hover:border-teal-deep/40 transition-colors self-start"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{cart.reduce((n, i) => n + i.quantity, 0)} items · ₹{subtotal}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategoryId("All")}
            className={`text-[13px] font-bold px-4 py-2 rounded-full border transition-all ${
              selectedCategoryId === "All" ? "bg-amber-950 text-white border-amber-950" : "bg-white text-teal-deep/70 border-teal-deep/15 hover:border-teal-deep/40"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`text-[13px] font-bold px-4 py-2 rounded-full border transition-all ${
                selectedCategoryId === cat.id ? "bg-amber-950 text-white border-amber-950" : "bg-white text-teal-deep/70 border-teal-deep/15 hover:border-teal-deep/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoadingCatalogue ? (
          <div className="py-14 flex justify-center">
            <Loader className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Nothing here yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const inCart = cart.find((i) => i.id === product.id);
              const isOutOfStock = product.stock_quantity === 0;
              return (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-teal-deep/5 shadow-sm flex flex-col">
                  <div className="aspect-[4/5] bg-teal-deep/5 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80"}
                      alt={product.name}
                      className={`w-full h-full object-cover ${isOutOfStock ? "grayscale opacity-60" : ""}`}
                    />
                    {isOutOfStock && (
                      <span className="absolute top-3 left-3 bg-slate-800 text-white text-[12px] font-bold px-2.5 py-1 rounded-full">Sold Out</span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-heading text-sm font-bold text-teal-deep line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-teal-deep/50 line-clamp-2 min-h-[32px]">{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-base font-extrabold text-teal-deep">₹{product.price}</span>
                      {isOutOfStock ? (
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Unavailable</span>
                      ) : inCart ? (
                        <div className="flex items-center space-x-2 bg-teal-deep/5 rounded-full px-1">
                          <button onClick={() => updateQuantity(product.id, -1)} className="p-1.5 text-teal-deep hover:text-rani-pink"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="text-xs font-bold w-4 text-center">{inCart.quantity}</span>
                          <button onClick={() => updateQuantity(product.id, 1)} className="p-1.5 text-teal-deep hover:text-rani-pink"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="text-[13px] font-bold px-3 py-2 bg-amber-950 hover:bg-amber-900 text-white rounded-full transition-colors"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-teal-deep/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-teal-deep/5">
              <h3 className="font-heading text-lg font-bold text-teal-deep">Tentative Selection</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-1.5 rounded-full hover:bg-teal-deep/5"><X className="w-5 h-5 text-teal-deep" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">Nothing selected yet — browse the catalogue to add items.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-teal-deep/5 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-teal-deep truncate">{item.name}</p>
                      <p className="text-[13px] text-teal-deep/50">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-teal-deep/60 hover:text-teal-deep"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-teal-deep/60 hover:text-teal-deep"><Plus className="w-3.5 h-3.5" /></button>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 text-teal-deep/40 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 border-t border-teal-deep/5 space-y-3">
              <div className="flex justify-between text-sm font-bold text-teal-deep">
                <span>Tentative Total</span>
                <span>₹{subtotal}</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={cart.length === 0 || isSubmitting}
                className="w-full py-3.5 bg-amber-950 hover:bg-amber-900 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Submit Quote Request</span>
                  </>
                )}
              </button>
              <p className="text-[12px] text-teal-deep/40 text-center">Downloads a PDF for your records and sends this to our team.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
