"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "../../lib/supabase";
import { useGift } from "../context/GiftContext";
import { PartyPopper, Sparkles, ShoppingBag, Star, Gift, Loader } from "lucide-react";
import type { CategoryRow, ProductWithCategories } from "../../lib/types";

const FLOATERS = [
  { Icon: Star, className: "top-16 left-[8%] text-saffron", size: "w-8 h-8", duration: 4 },
  { Icon: PartyPopper, className: "top-24 right-[10%] text-rani-pink", size: "w-9 h-9", duration: 5 },
  { Icon: Gift, className: "bottom-10 left-[15%] text-teal-deep", size: "w-7 h-7", duration: 4.5 },
  { Icon: Sparkles, className: "bottom-16 right-[18%] text-saffron", size: "w-6 h-6", duration: 3.5 },
];

const burstConfetti = () => {
  confetti({
    particleCount: 50,
    spread: 65,
    startVelocity: 35,
    origin: { x: 0.5, y: 0.7 },
    colors: ["#D1126A", "#F97316", "#042F2E", "#E2BA5F"],
  });
};

export default function KidsSectionPage() {
  const { addToCart } = useGift();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data: storeRow } = await supabase
          .from("stores")
          .select("id")
          .eq("slug", "kids")
          .maybeSingle();
        if (!storeRow) return;

        const [{ data: catData }, { data: prodData }] = await Promise.all([
          supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
          supabase
            .from("products")
            .select("*, product_categories(category_id), product_stores!inner(store_id)")
            .eq("product_stores.store_id", storeRow.id)
            .order("name"),
        ]);

        if (catData) setCategories(catData);
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
        console.error("Failed to load Kids Section:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const kidsCategories = useMemo(
    () => categories.filter((c) => c.slug === "kids-birthday-gifts" || c.slug === "kids-return-gifts"),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "All") return products;
    return products.filter((p) => p.categoryIds.includes(selectedCategoryId));
  }, [products, selectedCategoryId]);

  const handleAddToBag = (product: ProductWithCategories) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "",
      description: product.description || "",
    });
    burstConfetti();
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-8 px-6 relative overflow-hidden">
      {FLOATERS.map(({ Icon, className, size, duration }, i) => (
        <motion.div
          key={i}
          className={`hidden sm:block absolute ${className} ${size} pointer-events-none`}
          animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="w-full h-full" fill="currentColor" fillOpacity={0.15} />
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto space-y-10 relative">
        <motion.section
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-xl mx-auto space-y-4"
        >
          <motion.span
            animate={{ rotate: [0, -4, 4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center space-x-1.5 bg-rani-pink/10 border border-rani-pink/20 px-4 py-1.5 rounded-full text-xs font-black text-rani-pink uppercase tracking-widest"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span>Kids Section</span>
          </motion.span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-teal-deep tracking-tight">
            Party-Ready Gifts &amp; Return Favours!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Birthday hampers, fun return gifts, and little surprises kids actually get excited about.
          </p>
        </motion.section>

        <div className="flex flex-wrap justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategoryId("All")}
            className={`text-[13px] font-bold px-5 py-2.5 rounded-full border-2 transition-all ${
              selectedCategoryId === "All"
                ? "bg-rani-pink text-white border-rani-pink shadow-md"
                : "bg-white text-teal-deep/70 border-teal-deep/10 hover:border-rani-pink/40"
            }`}
          >
            All Fun Stuff
          </motion.button>
          {kidsCategories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`text-[13px] font-bold px-5 py-2.5 rounded-full border-2 transition-all ${
                selectedCategoryId === cat.id
                  ? "bg-saffron text-white border-saffron shadow-md"
                  : "bg-white text-teal-deep/70 border-teal-deep/10 hover:border-saffron/40"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader className="w-6 h-6 text-rani-pink animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <PartyPopper className="w-10 h-10 text-rani-pink/30 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Nothing here just yet — check back soon!</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock_quantity === 0;
                return (
                  <motion.div
                    key={product.id}
                    variants={{ hidden: { opacity: 0, y: 24, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                    whileHover={!isOutOfStock ? { rotate: [0, -2, 2, 0], y: -6 } : undefined}
                    transition={{ duration: 0.35 }}
                    className="bg-white rounded-[28px] overflow-hidden border-2 border-teal-deep/5 shadow-[0_10px_30px_rgba(209,18,106,0.06)] flex flex-col"
                  >
                    <div className="aspect-[4/5] bg-rani-pink/5 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80"}
                        alt={product.name}
                        className={`w-full h-full object-cover ${isOutOfStock ? "grayscale opacity-60" : ""}`}
                      />
                      {isOutOfStock && (
                        <span className="absolute top-3 left-3 bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                          Sold Out
                        </span>
                      )}
                      {!isOutOfStock && product.badge && (
                        <span className="absolute top-3 left-3 bg-saffron text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-heading text-sm font-black text-teal-deep line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-teal-deep/50 line-clamp-2 min-h-[32px]">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-base font-extrabold text-rani-pink">₹{product.price}</span>
                        <motion.button
                          whileHover={!isOutOfStock ? { scale: 1.08 } : undefined}
                          whileTap={!isOutOfStock ? { scale: 0.92 } : undefined}
                          disabled={isOutOfStock}
                          onClick={() => handleAddToBag(product)}
                          className="inline-flex items-center space-x-1.5 text-[12px] font-bold px-4 py-2.5 bg-teal-deep hover:bg-rani-pink text-white rounded-full transition-colors disabled:opacity-40"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isOutOfStock ? "Sold Out" : "Add to Bag"}</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
