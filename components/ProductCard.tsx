"use client";

import React from "react";
import { useGift, CartItem } from "../app/context/GiftContext";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    badge?: string;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useGift();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-3xl overflow-hidden border border-teal-deep/5 shadow-[0_10px_35px_rgba(4,47,46,0.03)] hover:shadow-[0_20px_45px_rgba(209,18,106,0.08)] hover:border-rani-pink/15 transition-all duration-300 relative flex flex-col h-full"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] bg-teal-deep/5 overflow-hidden flex items-center justify-center border-b border-teal-deep/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80";
          }}
        />

        {/* Badge Overlay */}
        {product.badge && (
          <span className="absolute top-4 left-4 bg-saffron text-[#FFFDF5] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
            {product.badge}
          </span>
        )}

        {/* Quick Interaction Overlay */}
        <div className="absolute inset-0 bg-teal-deep/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <button 
            onClick={() => addToCart(product)}
            className="p-3 bg-white text-teal-deep hover:bg-rani-pink hover:text-[#FFFDF5] rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            title="Add to Bag"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-bold text-teal-deep line-clamp-1 group-hover:text-rani-pink transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-teal-deep/60 line-clamp-2 min-h-[32px]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto">
          <span className="font-heading text-lg font-extrabold text-teal-deep">
            ₹{product.price}
          </span>

          <button
            onClick={() => addToCart(product)}
            className="inline-flex items-center space-x-1 px-4 py-2 bg-teal-deep hover:bg-rani-pink text-[#FFFDF5] hover:text-[#FFFDF5] text-xs font-bold rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
