"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGift } from "../app/context/GiftContext";
import { ShoppingBag, Sparkles, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// Grouped like a category-based mega-menu (Shop vs. Bulk Gifting), matching
// the shopping-vs-B2B split used across confettigifts.in's nav, but only
// linking to routes that actually exist on this site.
const navGroups: NavGroup[] = [
  {
    label: "Shop",
    items: [
      { href: "/collections", label: "Pre-Curated Collections" },
      { href: "/collections/diwali", label: "Diwali Collection" },
      { href: "/build", label: "Build Your Own Box" },
      { href: "/store/quirky-stuff", label: "Quirky Stuff Store" },
      { href: "/store/divine-store", label: "Divine Store" },
      { href: "/custom-gifts", label: "Custom Gifts" },
      { href: "/kids", label: "Kids Section" },
      { href: "/store/wedding-essentials", label: "Wedding Essentials" },
    ],
  },
  {
    label: "Bulk Gifting",
    items: [
      { href: "/corporate", label: "Corporate Gifting" },
      { href: "/weddings", label: "Weddings" },
      { href: "/claim-token", label: "Corporate Claim Portal" },
    ],
  },
];

const singleLinks: NavItem[] = [
  { href: "/blogs", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isGroupActive = group.items.some((item) => item.href === pathname);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`relative px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-200 flex items-center space-x-1 ${
          isGroupActive
            ? "text-[#FAF4E8] bg-teal-deep"
            : "text-teal-deep/80 hover:text-teal-deep hover:bg-teal-deep/5"
        }`}
      >
        <span>{group.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 pt-2 w-56"
          >
            <div className="bg-[#FAF4E8] border border-[#042F2E]/10 rounded-2xl shadow-lg overflow-hidden py-2">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    pathname === item.href
                      ? "text-rani-pink font-semibold bg-teal-deep/5"
                      : "text-teal-deep/80 hover:text-teal-deep hover:bg-teal-deep/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Navbar = () => {
  const pathname = usePathname();
  const { cartItems, setCartOpen } = useGift();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldFloat = pathname !== "/" || isScrolled;

  return (
    <header className={`transition-all duration-300 ${shouldFloat ? "mx-auto mt-3 w-[92%] max-w-6xl" : "w-full max-w-none mt-0"}`}>
      <nav className={`transition-all duration-300 flex items-center justify-between ${
        shouldFloat
          ? "backdrop-blur-md bg-[#FAF4E8]/75 border border-[#042F2E]/10 px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(4,47,46,0.06)] hover:border-[#042F2E]/20"
          : "bg-[#FAF4E8] border-b border-[#042F2E]/10 px-8 py-4 rounded-none shadow-none"
      }`}>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-teal-deep">
            The Box<span className="text-rani-pink"> Story</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navGroups.map((group) => (
            <NavDropdown key={group.label} group={group} pathname={pathname} />
          ))}
          {singleLinks.map((link) => {
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
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
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
                  className="absolute -top-1.5 -right-1.5 bg-rani-pink text-[#FAF4E8] text-[12px] font-bold rounded-full w-5.5 h-5.5 flex items-center justify-center border-2 border-[#FAF4E8]"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="md:hidden p-2.5 rounded-full hover:bg-teal-deep/5 transition-all text-teal-deep"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 bg-[#FAF4E8] border border-[#042F2E]/10 rounded-3xl shadow-lg overflow-hidden"
          >
            {navGroups.map((group) => (
              <div key={group.label} className="border-b border-[#042F2E]/5 last:border-0">
                <span className="block px-5 pt-4 pb-1 text-[12px] font-black uppercase tracking-widest text-teal-deep/40">
                  {group.label}
                </span>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-5 py-2.5 text-sm ${
                      pathname === item.href ? "text-rani-pink font-semibold" : "text-teal-deep/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="border-b border-[#042F2E]/5 last:border-0">
              <span className="block px-5 pt-4 pb-1 text-[12px] font-black uppercase tracking-widest text-teal-deep/40">
                More
              </span>
              {[...singleLinks, { href: "/gift-genie", label: "AI Gift Genie" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-5 py-2.5 text-sm ${
                    pathname === link.href ? "text-rani-pink font-semibold" : "text-teal-deep/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
