"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  isCustomBox?: boolean;
  boxItems?: { id: string; name: string; price: number; image: string }[];
  giftMessage?: string;
  personalization?: Record<string, string>;
}

export interface BoxItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface GiftContextType {
  cartItems: CartItem[];
  buildABoxItems: BoxItem[];
  boxCapacity: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  addToBox: (item: BoxItem) => boolean; // returns true if added, false if full
  removeFromBox: (id: string) => void;
  clearBox: () => void;
  moveBoxToCart: (boxStyleName?: string, giftMessage?: string) => void;
  clearCart: () => void;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export const GiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [buildABoxItems, setBuildABoxItems] = useState<BoxItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const boxCapacity = 5;

  // Load cart from localStorage on mount. This can only run client-side
  // (localStorage isn't available during SSR), so hydrating cart state via
  // effect + setState is intentional here, not an accidental render-time
  // side effect.
  useEffect(() => {
    const savedCart = localStorage.getItem("tbs_cart");
    if (savedCart) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage, only possible post-mount
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
  }, []);

  // Sync cart to localStorage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("tbs_cart", JSON.stringify(items));
  };

  const addToCart = (item: Omit<CartItem, "quantity">, qty = 1) => {
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      const updated = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
      );
      saveCart(updated);
    } else {
      saveCart([...cartItems, { ...item, quantity: qty }]);
    }
    // Automatically open cart drawer to provide direct tactile feedback
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    saveCart(cartItems.filter((i) => i.id !== id));
  };

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart(cartItems.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const addToBox = (item: BoxItem): boolean => {
    if (buildABoxItems.length >= boxCapacity) {
      return false;
    }
    setBuildABoxItems([...buildABoxItems, item]);
    return true;
  };

  const removeFromBox = (id: string) => {
    // Remove the first occurrence of the item with the given id
    const index = buildABoxItems.findIndex((item) => item.id === id);
    if (index > -1) {
      const updated = [...buildABoxItems];
      updated.splice(index, 1);
      setBuildABoxItems(updated);
    }
  };

  const clearBox = () => {
    setBuildABoxItems([]);
  };

  const moveBoxToCart = (boxStyleName = "Classic Royal Box", giftMessage?: string) => {
    if (buildABoxItems.length === 0) return;

    const boxTotal = buildABoxItems.reduce((acc, item) => acc + item.price, 250); // ₹250 base for premium packaging
    const uniqueId = `custom-box-${Date.now()}`;
    const newCartItem: CartItem = {
      id: uniqueId,
      name: `Custom Hamper (${boxStyleName})`,
      price: boxTotal,
      description: `Custom curated hamper containing: ${buildABoxItems.map((i) => i.name).join(", ")}`,
      image: "/images/custom-box-gold.png", // fallback or default gold hamper image
      isCustomBox: true,
      boxItems: [...buildABoxItems],
      quantity: 1,
      giftMessage: giftMessage?.trim() || undefined,
    };

    saveCart([...cartItems, newCartItem]);
    setBuildABoxItems([]);
    setCartOpen(true);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <GiftContext.Provider
      value={{
        cartItems,
        buildABoxItems,
        boxCapacity,
        isCartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToBox,
        removeFromBox,
        clearBox,
        moveBoxToCart,
        clearCart,
      }}
    >
      {children}
    </GiftContext.Provider>
  );
};

export const useGift = () => {
  const context = useContext(GiftContext);
  if (!context) {
    throw new Error("useGift must be used within a GiftProvider");
  }
  return context;
};
