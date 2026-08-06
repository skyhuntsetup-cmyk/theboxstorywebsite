"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { PersonalizationModal } from "../../components/PersonalizationModal";
import { useGift } from "../context/GiftContext";
import { Gift, Loader, Sparkles, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductWithCategories } from "../../lib/types";

export default function CustomGiftsPage() {
  const { addToCart } = useGift();
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [personalizingProduct, setPersonalizingProduct] = useState<ProductWithCategories | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data: storeRow } = await supabase
          .from("stores")
          .select("id")
          .eq("slug", "custom-gifts")
          .maybeSingle();
        if (!storeRow) return;

        const { data: prodData } = await supabase
          .from("products")
          .select("*, product_categories(category_id), product_stores!inner(store_id)")
          .eq("product_stores.store_id", storeRow.id)
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
        console.error("Failed to load Custom Gifts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleAddToBag = (product: ProductWithCategories) => {
    if (product.personalization_fields.length > 0) {
      setPersonalizingProduct(product);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "",
      description: product.description || "",
    });
  };

  return (
    <div className="min-h-screen bg-background text-slate-800 py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[32px] overflow-hidden bg-white border border-slate-200/60 p-8 md:p-14 shadow-sm text-left"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-rani-pink/5 rounded-full blur-3xl -z-10" />
          <div className="space-y-4 max-w-xl">
            <span className="text-[12px] tracking-widest font-black uppercase text-saffron bg-saffron/10 border border-saffron/15 px-3 py-1.5 rounded-full inline-flex items-center space-x-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Made Just For You</span>
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-light text-slate-900 tracking-tight leading-tight">
              Custom Gifts
            </h1>
            <div className="w-12 h-0.5 bg-slate-900" />
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Personalized and engraved keepsakes — add a name, a date, or a message before it ships.
            </p>
          </div>
        </motion.section>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Gift className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No custom gifts published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const isOutOfStock = product.stock_quantity === 0;
              return (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-teal-deep/5 shadow-sm flex flex-col">
                  <div className="aspect-[4/5] bg-teal-deep/5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80"}
                      alt={product.name}
                      className={`w-full h-full object-cover ${isOutOfStock ? "grayscale opacity-60" : ""}`}
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-heading text-sm font-bold text-teal-deep line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-teal-deep/50 line-clamp-2 min-h-[32px]">{product.description}</p>
                      {product.personalization_fields.length > 0 && (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-saffron mt-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Personalizable</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-base font-extrabold text-teal-deep">₹{product.price}</span>
                      <button
                        disabled={isOutOfStock}
                        onClick={() => handleAddToBag(product)}
                        className="inline-flex items-center space-x-1 text-[12px] font-bold px-3 py-2 bg-teal-deep hover:bg-rani-pink text-white rounded-full transition-colors disabled:opacity-40"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isOutOfStock ? "Sold Out" : "Add to Bag"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {personalizingProduct && (
        <PersonalizationModal
          productName={personalizingProduct.name}
          productImage={personalizingProduct.image || undefined}
          fields={personalizingProduct.personalization_fields}
          onClose={() => setPersonalizingProduct(null)}
          onConfirm={(answers) => {
            addToCart({
              id: personalizingProduct.id,
              name: personalizingProduct.name,
              price: personalizingProduct.price,
              image: personalizingProduct.image || "",
              description: personalizingProduct.description || "",
              personalization: answers,
            });
            setPersonalizingProduct(null);
          }}
        />
      )}
    </div>
  );
}
