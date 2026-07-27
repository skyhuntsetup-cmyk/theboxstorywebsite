"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGift } from "../app/context/GiftContext";
import { ShoppingBag, Sparkles, Gift, Briefcase, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const pathname = usePathname();
  const { cartItems, setCartOpen } = useGift();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home", icon: Heart },
    { href: "/collections", label: "Collections", icon: Gift },
    { href: "/build", label: "Build a Box", icon: Sparkles },
    { href: "/corporate", label: "Corporate", icon: Briefcase },
    { href: "/weddings", label: "Weddings", icon: Heart },
    { href: "/claim-token", label: "Claim Token", icon: Gift },
    { href: "/about", label: "About", icon: Heart },
    { href: "/contact", label: "Contact", icon: Heart },
    { href: "/admin", label: "Admin", icon: Briefcase },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50">
      <nav className="backdrop-blur-md bg-[#FAF4E8]/75 border border-[#042F2E]/10 px-6 py-4 rounded-full flex items-center justify-between shadow-[0_10px_30px_rgba(4,47,46,0.06)] transition-all duration-300 hover:border-[#042F2E]/20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-teal-deep">
            The Box<span className="text-rani-pink"> Story</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "text-[#FAF4E8] bg-teal-deep"
                    : "text-teal-deep/80 hover:text-teal-deep hover:bg-teal-deep/5"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 bg-teal-deep rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center space-x-1.5">
                  {link.href === "/gift-genie" && (
                    <Sparkles className="w-4 h-4 text-saffron animate-pulse" />
                  )}
                  <span>{link.label}</span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/gift-genie"
            className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 border border-saffron/30 hover:border-saffron bg-[#FAF4E8] text-saffron rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 animate-bounce" />
            <span>AI Finder</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-full hover:bg-teal-deep/5 transition-all text-teal-deep duration-200 group"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-105" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 bg-rani-pink text-[#FAF4E8] text-[10px] font-bold rounded-full w-5.5 h-5.5 flex items-center justify-center border-2 border-[#FAF4E8]"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </header>
  );
};
