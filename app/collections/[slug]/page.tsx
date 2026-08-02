"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { ProductCard } from "../../../components/ProductCard";
import { Gift, Loader, ArrowLeft } from "lucide-react";
import type { CategoryRow, ProductWithCategories } from "../../../lib/types";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = useState<CategoryRow | null>(null);
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .maybeSingle();

        if (!catData) {
          setNotFound(true);
          return;
        }
        setCategory(catData);

        const { data: prodData } = await supabase
          .from("products")
          .select("*, product_categories!inner(category_id)")
          .eq("product_categories.category_id", catData.id)
          .order("name");

        if (prodData) {
          setProducts(
            prodData.map((p) => {
              const { product_categories, ...rest } = p as typeof p & { product_categories: { category_id: string }[] };
              return { ...rest, categoryIds: (product_categories || []).map((pc: { category_id: string }) => pc.category_id) };
            })
          );
        }
      } catch (err) {
        console.error("Failed to load category:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-6">
        <Gift className="w-10 h-10 text-slate-300" />
        <p className="text-sm font-semibold text-slate-600">This category doesn&apos;t exist or isn&apos;t published.</p>
        <Link href="/collections" className="text-xs font-bold text-rani-pink hover:underline">
          Browse all collections →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-800 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <Link href="/collections" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-teal-deep transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Collections</span>
        </Link>

        <section className="relative rounded-[32px] overflow-hidden bg-white border border-slate-200/60 p-8 md:p-14 shadow-sm text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-100 rounded-full blur-3xl -z-10" />
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] tracking-widest font-black uppercase text-slate-400 block">Collection</span>
            <h1 className="font-heading text-4xl sm:text-5xl font-light text-slate-900 tracking-tight leading-tight">
              {category.name}
            </h1>
            <div className="w-12 h-0.5 bg-slate-900" />
            {category.description && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">{category.description}</p>
            )}
          </div>
        </section>

        {products.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Gift className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No products tagged into this collection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
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
