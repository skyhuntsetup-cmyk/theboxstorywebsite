"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useGift } from "../app/context/GiftContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CartDrawer = () => {
  const { cartItems, isCartOpen, setCartOpen, updateCartQuantity, removeFromCart } = useGift();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, setCartOpen]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-teal-deep/40 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Drawer container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-background text-teal-deep shadow-[-10px_0_50px_rgba(4,47,46,0.15)] border-l border-teal-deep/10 z-50 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-teal-deep/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="w-6 h-6 text-rani-pink" />
                <span className="font-heading text-xl font-bold">Your Celebration Bag</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-teal-deep/5 transition-all text-teal-deep/60 hover:text-teal-deep"
                aria-label="Close Shopping Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-6 bg-teal-deep/5 rounded-full">
                    <ShoppingBag className="w-12 h-12 text-teal-deep/45" />
                  </div>
                  <h3 className="font-heading text-lg font-bold">Your bag is empty</h3>
                  <p className="text-sm text-teal-deep/70 max-w-[280px]">
                    Create memories by adding beautifully pre-curated sets or crafting your custom celebration box.
                  </p>
                  <Link
                    href="/collections"
                    onClick={() => setCartOpen(false)}
                    className="inline-flex items-center space-x-2 text-sm font-semibold bg-teal-deep hover:bg-teal-deep/90 text-[#FAF4E8] px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Browse Collections</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/70 backdrop-blur-sm border border-teal-deep/5 rounded-2xl flex space-x-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-teal-deep/5 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-teal-deep/5 relative">
                        {item.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails, show placeholder fallback
                              e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80";
                            }}
                          />
                        ) : (
                          <Gift className="w-10 h-10 text-teal-deep/40" />
                        )}
                      </div>

                      {/* Product Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm truncate pr-4 text-teal-deep">
                            {item.name}
                          </h4>
                          <span className="font-bold text-sm text-teal-deep">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-teal-deep/60 line-clamp-1 mb-2">
                          {item.description}
                        </p>

                        {/* If customized, show hamper item pills */}
                        {item.isCustomBox && item.boxItems && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.boxItems.map((boxItem, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-teal-deep/5 text-teal-deep border border-teal-deep/10 px-2 py-0.5 rounded-full"
                              >
                                {boxItem.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.giftMessage && (
                          <p className="text-[10px] italic text-rani-pink/80 mb-3 line-clamp-1">
                            &quot;{item.giftMessage}&quot;
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-teal-deep/15 rounded-full p-1 bg-background">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-teal-deep/5 rounded-full text-teal-deep/75 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-teal-deep">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-teal-deep/5 rounded-full text-teal-deep/75 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Delete Item */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 hover:bg-rani-pink/5 hover:text-rani-pink rounded-full text-teal-deep/50 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t border-teal-deep/10 space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold text-teal-deep/80">
                  <span>Standard Shipping</span>
                  <span className="text-teal-deep">FREE</span>
                </div>
                <div className="flex justify-between items-end border-b border-teal-deep/5 pb-4">
                  <span className="font-heading text-lg font-bold">Subtotal</span>
                  <span className="font-heading text-xl font-black text-rani-pink">
                    ₹{subtotal}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-teal-deep hover:bg-teal-deep/90 text-[#FAF4E8] rounded-full font-semibold text-base shadow-[0_15px_30px_rgba(4,47,46,0.15)] transition-all transform hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(4,47,46,0.2)]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[10px] text-center text-teal-deep/50 mt-2">
                  Tax included. Discount codes can be applied in checkout.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
