"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { ProductCard } from "../../../components/ProductCard";
import { Gift, Loader, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { CategoryRow, StoreRow, ProductWithCategories } from "../../../lib/types";

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [store, setStore] = useState<StoreRow | null>(null);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const [{ data: storeData }, { data: catData }] = await Promise.all([
          supabase.from("stores").select("*").eq("slug", slug).eq("is_active", true).maybeSingle(),
          supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
        ]);

        if (!storeData) {
          setNotFound(true);
          return;
        }
        setStore(storeData);
        if (catData) setCategories(catData);

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
      } catch (err) {
        console.error("Failed to load store:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "All") return products;
    return products.filter((p) => p.categoryIds.includes(selectedCategoryId));
  }, [products, selectedCategoryId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !store) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-6">
        <Gift className="w-10 h-10 text-slate-300" />
        <p className="text-sm font-semibold text-slate-600">This store doesn&apos;t exist or isn&apos;t published.</p>
        <Link href="/collections" className="text-xs font-bold text-rani-pink hover:underline">
          Browse all collections →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-800 py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-teal-deep transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[32px] overflow-hidden bg-white border border-slate-200/60 p-8 md:p-14 shadow-sm text-left"
        >
          {store.hero_image && (
            <div className="absolute inset-0 -z-10 opacity-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={store.hero_image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-100 rounded-full blur-3xl -z-10" />
          <div className="space-y-4 max-w-xl">
            {store.tagline && (
              <span className="text-[12px] tracking-widest font-black uppercase text-slate-400 block">
                {store.tagline}
              </span>
            )}
            <h1 className="font-heading text-4xl sm:text-5xl font-light text-slate-900 tracking-tight leading-tight">
              {store.name}
            </h1>
            <div className="w-12 h-0.5 bg-slate-900" />
            {store.description && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">{store.description}</p>
            )}
          </div>
        </motion.section>

        {/* Category filter chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategoryId("All")}
              className={`text-[13px] font-bold px-4 py-2 rounded-full border transition-all ${
                selectedCategoryId === "All" ? "bg-teal-deep text-white border-teal-deep" : "bg-white text-teal-deep/70 border-teal-deep/15 hover:border-teal-deep/40"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`text-[13px] font-bold px-4 py-2 rounded-full border transition-all ${
                  selectedCategoryId === cat.id ? "bg-teal-deep text-white border-teal-deep" : "bg-white text-teal-deep/70 border-teal-deep/15 hover:border-teal-deep/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Gift className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No products tagged into this store yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image || "",
                  description: product.description || "",
                  badge: product.badge || undefined,
                  stock_quantity: product.stock_quantity,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
