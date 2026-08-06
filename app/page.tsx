"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { ProductCard } from "../components/ProductCard";
import type { ProductRow } from "../lib/types";
import {
  Sparkles, Gift, ArrowRight, CheckCircle2, ChevronRight, Zap, Star,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { getContent } from "../lib/siteContent";

const revealProps = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);


export default function Home() {
  const heroBadge = getContent("home.hero.badge", "Premium Diwali Gifting 2026");
  const heroSubtext = getContent(
    "home.hero.subtext",
    "Craft bespoke celebration hampers, select artisanal sweets, clay-brass diyas, and premium relics wrapped in gold foiled rigid boxes."
  );
  const missionHeadline = getContent("home.mission.headline", "To Help You Create Wonderful Stories");
  const missionBody = getContent(
    "home.mission.body",
    "Our vision is to revolutionize the art of gifting by creating personalized and memorable experiences that celebrate life's special moments."
  );
  const [bestsellers, setBestsellers] = useState<ProductRow[]>([]);
  const [activeTab, setActiveTab] = useState<"occasion" | "recipient">("occasion");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => { if (data) setBestsellers(data); });
  }, []);

  const homepageSlides = [
    {
      id: "slide-1",
      name: "Royal Saffron & Sweet Hamper",
      badge: "Auspicious",
      price: "2,450",
      image: "/images/homepage/slide_1.jpg"
    },
    {
      id: "slide-2",
      name: "The Classic Groom & Wedding favour",
      badge: "Wedding Elite",
      price: "3,200",
      image: "/images/homepage/slide_2.jpg"
    },
    {
      id: "slide-3",
      name: "Jaipur Heritage Brass Crate",
      badge: "Heritage Crate",
      price: "4,500",
      image: "/images/homepage/slide_3.jpg"
    },
    {
      id: "slide-4",
      name: "Curated Gourmet Tea & Nut Case",
      badge: "Gourmet Box",
      price: "1,850",
      image: "/images/homepage/slide_4.jpg"
    },
    {
      id: "slide-5",
      name: "Milestone Celebration Tray",
      badge: "Anniversary Gold",
      price: "2,990",
      image: "/images/homepage/slide_5.jpg"
    },
    {
      id: "slide-6",
      name: "Luxury Velvet Onboarding Box",
      badge: "Executive Swag",
      price: "2,100",
      image: "/images/homepage/slide_6.jpg"
    }
  ];

  // Auto-advance the hero slideshow through homepageSlides; pauses on hover.
  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % homepageSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  // Bulk Gifting Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "20-50",
    budget: "Under ₹1500",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 60,
          colors: ["#9D174D", "#B45309", "#E2BA5F"],
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          quantity: "20-50",
          budget: "Under ₹1500",
          details: "",
        });
      } else {
        alert("Failed to submit inquiry: " + (data.error || "Please check connection."));
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const clientLogos = [
    { name: "TATA", type: "Enterprise" },
    { name: "CRED", type: "Fintech" },
    { name: "Google", type: "Technology" },
    { name: "Zomato", type: "Logistics" },
    { name: "Reliance", type: "Retail" },
    { name: "Razorpay", type: "Fintech" },
  ];

  const occasions = [
    "DIWALI CELEBRATIONS",
    "WEDDING CEREMONIES",
    "CORPORATE RETREATS",
    "BIRTHDAY MILESTONES",
    "ANNIVERSARY ROMANCE",
    "BABY SHOWERS",
    "HOUSEWARMING WARMTH",
    "RAKHI BONDING",
  ];

  const circularCategories = {
    occasion: [
      { name: "Diwali", image: "/images/icons/icon_diwali.png" },
      { name: "Weddings", image: "/images/icons/icon_wedding.png" },
      { name: "Anniversary", image: "/images/icons/icon_anniversary.png" },
      { name: "Corporate", image: "/images/icons/icon_corporate.png" },
      { name: "Housewarming", image: "/images/icons/icon_housewarming.png" },
      { name: "Rakhi Gifts", image: "/images/icons/icon_rakhi.png" },
    ],
    recipient: [
      { name: "For Him", image: "/images/icons/icon_him.png" },
      { name: "For Her", image: "/images/icons/icon_her.png" },
      { name: "For Boyfriend", image: "/images/icons/icon_boyfriend.png" },
      { name: "For Wife", image: "/images/icons/icon_wife.png" },
      { name: "For Couples", image: "/images/icons/icon_couple.png" },
    ],
  };

  const steps = [
    {
      num: "01",
      title: "Select Premium Box Size",
      desc: "Choose from our gold-foiled rigid drawers, premium pine wood boxes, or elegant leather baskets.",
    },
    {
      num: "02",
      title: "Fill With Up To 5 Delights",
      desc: "Select dry fruits, saffron-honey jars, custom tea blends, copper tumblers, or spa essentials.",
    },
    {
      num: "03",
      title: "Add Notes & Wrap",
      desc: "Write a greeting note rendered in cursive script, select satin bow ribbons, and ship.",
    },
  ];

  const offers = [
    {
      title: "Curated Celebration Boxes",
      desc: "Expertly themed hampers packed with premium clay diyas, gourmet sweets, and artisanal creations.",
      link: "/collections",
      badge: "Festive Ready",
    },
    {
      title: "Build-a-Box Studio",
      desc: "A fully custom interactive experience where you choose the rigid box style, wraps, and treats.",
      link: "/build",
      badge: "Interactive Co-create",
    },
    {
      title: "Corporate Swag & Milestones",
      desc: "Branded client panels, automated employee address collections, and bulk corporate distributions.",
      link: "/corporate",
      badge: "Automation B2B",
    },
    {
      title: "Maharaja Wedding Favors",
      desc: "Royal heritage packaging, personalized wedding stationery, and curated premium favors.",
      link: "/weddings",
      badge: "Royal Monograms",
    },
  ];

  const instagramPosts = [
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80",
  ];

  const testimonials = [
    {
      quote: "The Box Story completely elevated our company onboarding! The laser-engraved copper bottles and premium notebook diaries were standard-setting. Every new hire was wowed.",
      author: "Aditi Sharma",
      role: "HR Director, CRED",
      rating: 5,
    },
    {
      quote: "I sent a custom built anniversary hamper to my sister via a Magical Link. She filled in her shipping address directly and loved the unboxing confetti simulation. Genius concept!",
      author: "Vikram Malhotra",
      role: "Mumbai",
      rating: 5,
    },
    {
      quote: "Exquisite packing and outstanding local sweets. Saffron honey and dry fruits were premium grade. Will definitely choose them for Diwali bulk gifting next month.",
      author: "Pooja Hegde",
      role: "Wedding Planner, Jaipur",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "Can I ship box hampers to multiple addresses?",
      a: "Yes! During standard checkout, you can generate a Magical Link to let recipients fill in their own shipping coordinates. For bulk corporate orders, you can submit an Excel sheet with multiple addresses on our Corporate page.",
    },
    {
      q: "How does the AI Gift Genie recommend boxes?",
      a: "Our AI Genie matches keywords in your description (like budget, occasion, recipient details) to our active catalog database, compiling the most fitting pre-curated combinations automatically.",
    },
    {
      q: "Is shipping free across India?",
      a: "We offer completely free shipping on all pre-curated collection boxes and custom build-a-box hampers throughout India. There are no hidden fees at checkout.",
    },
  ];

  return (
    <div className="space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center px-6 overflow-hidden cultural-pattern">
        {/* Dynamic Warm Mesh Background */}
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-saffron/15 rounded-full blur-3xl mix-blend-multiply filter animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-rani-pink/10 rounded-full blur-3xl mix-blend-multiply filter animate-pulse" />
          <div className="absolute top-1/2 left-1/3 w-[250px] h-[250px] bg-teal-deep/5 rounded-full blur-3xl filter" />
          <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] bg-gold/10 rounded-full blur-3xl filter" />
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 text-left space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-saffron/10 border border-saffron/25 px-4 py-2 rounded-full text-xs font-bold text-saffron uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{heroBadge}</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black text-teal-deep leading-[1.05] tracking-tight">
              Gifts That <br />
              Tell a <span className="text-rani-pink italic font-normal font-serif">Story</span>
            </h1>
            <p className="text-sm sm:text-base text-teal-deep/80 leading-relaxed max-w-lg font-light">
              {heroSubtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/build"
                className="group flex items-center justify-center space-x-2 bg-rani-pink hover:bg-rani-pink/95 text-[#FAF4E8] px-8 py-4 rounded-full font-bold text-base shadow-[0_15px_30px_rgba(209,18,106,0.25)] hover:shadow-[0_20px_40px_rgba(209,18,106,0.35)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Build Your Box</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/collections"
                className="flex items-center justify-center space-x-2 bg-background hover:bg-teal-deep/5 text-teal-deep border-2 border-teal-deep px-8 py-4 rounded-full font-bold text-base shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore Collections</span>
              </Link>
            </div>

            {/* Trust row — fills the empty space under the CTAs with real, verifiable claims */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-teal-deep/10"
            >
              <div className="flex items-center space-x-2">
                <span className="font-heading text-xl font-black text-teal-deep">10,000+</span>
                <span className="text-[11px] text-teal-deep/55 uppercase font-bold tracking-wide leading-tight">Hampers<br />Shipped</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-xl font-black text-teal-deep">30+</span>
                <span className="text-[11px] text-teal-deep/55 uppercase font-bold tracking-wide leading-tight">Enterprise<br />Brands</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-[11px] text-teal-deep/55 uppercase font-bold tracking-wide leading-tight">Free Shipping<br />Pan-India</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Floating Visual — auto-advancing slideshow of live bestsellers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onMouseEnter={() => setIsHeroPaused(true)}
            onMouseLeave={() => setIsHeroPaused(false)}
            className="md:col-span-5 flex justify-center"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Background Layer (Visual Stack) */}
              <div
                className="absolute top-12 left-12 w-full h-full border border-slate-200/50 rounded-3xl shadow-md z-10 opacity-80"
                style={{
                  backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.65)), url('/images/homepage/slide_1.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />

              {/* Slideshow Layer */}
              <div className="absolute top-4 left-6 w-full h-full z-20">
                <AnimatePresence mode="wait">
                  {homepageSlides.length > 0 ? (
                    <motion.div
                      key={homepageSlides[heroSlide % homepageSlides.length]?.id ?? heroSlide}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0, y: [0, -10, 0], rotate: [0, 2, 0] }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{
                        opacity: { duration: 0.5 },
                        x: { duration: 0.5 },
                        y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                        rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                      }}
                      className="absolute inset-0 border border-gold/30 rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(226,186,95,0.25)] flex flex-col p-8 justify-between"
                      style={{
                        backgroundImage: `linear-gradient(to top, rgba(13, 27, 23, 0.95) 0%, rgba(13, 27, 23, 0.45) 55%, rgba(13, 27, 23, 0.15) 100%), url('${homepageSlides[heroSlide % homepageSlides.length]?.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[12px] uppercase font-bold tracking-widest text-[#FCFAF2] bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                          {homepageSlides[heroSlide % homepageSlides.length]?.badge}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="w-12 h-1.5 bg-rani-pink rounded-full" />
                        <h3 className="font-heading text-2xl font-black leading-tight text-white line-clamp-2">
                          {homepageSlides[heroSlide % homepageSlides.length]?.name}
                        </h3>
                        <span className="inline-block text-[13px] font-bold bg-white/10 text-[#FCFAF2] border border-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                          ₹{homepageSlides[heroSlide % homepageSlides.length]?.price}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 border border-gold/20 rounded-3xl bg-teal-deep/5 animate-pulse"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Slide indicator dots */}
              {homepageSlides.length > 1 && (
                <div className="absolute -bottom-8 left-6 z-30 flex items-center space-x-1.5">
                  {homepageSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroSlide(idx)}
                      aria-label={`Show slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === heroSlide % homepageSlides.length ? "w-6 bg-rani-pink" : "w-1.5 bg-teal-deep/20 hover:bg-teal-deep/40"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Floating trust badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [-15, 15, -15] }}
                transition={{ opacity: { duration: 0.6, delay: 0.6 }, y: { repeat: Infinity, duration: 8, ease: "easeInOut" } }}
                className="absolute -top-5 -left-5 z-30 bg-white shadow-lg rounded-2xl px-4 py-2.5 flex items-center space-x-2 border border-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-rani-pink/10 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-rani-pink" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[11px] font-black text-teal-deep">Free Shipping</span>
                  <span className="block text-[10px] text-teal-deep/50">Across India</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. INFINITE OCCASIONS MARQUEE */}
      <section className="bg-amber-100 py-6 overflow-hidden border-y-4 border-gold">
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="flex animate-marquee space-x-12">
            {[...occasions, ...occasions].map((occ, idx) => (
              <span
                key={idx}
                className="flex items-center space-x-3 text-teal-deep font-heading font-black text-xl md:text-2xl tracking-widest"
              >
                <span>{occ}</span>
                <Sparkles className="w-5 h-5 text-saffron" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CIRCULAR CATEGORY SHOWCASE */}
      <section className="max-w-6xl mx-auto px-6 space-y-8 text-center">
        <motion.div {...revealProps} className="space-y-4">
          <h2 className="font-heading text-3xl font-black text-teal-deep">
            Find the Perfect Gift Box
          </h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab("occasion")}
              className={`text-xs px-5 py-2.5 rounded-full font-bold transition-all border ${
                activeTab === "occasion"
                  ? "bg-teal-deep border-teal-deep text-white"
                  : "bg-white border-teal-deep/15 text-teal-deep hover:border-teal-deep/30"
              }`}
            >
              Shop By Occasion
            </button>
            <button
              onClick={() => setActiveTab("recipient")}
              className={`text-xs px-5 py-2.5 rounded-full font-bold transition-all border ${
                activeTab === "recipient"
                  ? "bg-teal-deep border-teal-deep text-white"
                  : "bg-white border-teal-deep/15 text-teal-deep hover:border-teal-deep/30"
              }`}
            >
              Shop By Recipient
            </button>
          </div>
        </motion.div>

        {/* Categories slider row */}
        <motion.div
          key={activeTab}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10"
        >
          {circularCategories[activeTab].map((cat, idx) => (
            <motion.div key={idx} variants={staggerItem} whileHover={{ y: -4 }}>
              <Link
                href="/collections"
                className="group flex flex-col items-center space-y-3 focus:outline-none w-24 sm:w-28"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-teal-deep/5 shadow-sm group-hover:shadow-md group-hover:border-rani-pink/20 transition-all duration-300 relative bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-teal-deep/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white animate-spin" />
                  </div>
                </div>
                <span className="text-xs font-bold text-teal-deep group-hover:text-rani-pink transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. GIFTS THAT STAND OUT SECTION */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <motion.div {...revealProps} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 text-left">
            <span className="text-[12px] font-bold tracking-widest text-saffron bg-saffron/10 px-3 py-1 rounded-full uppercase">
              Curated Masterpieces
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-teal-deep leading-tight">
              Gifts That Stand Out
            </h2>
            <p className="text-sm text-teal-deep/70 max-w-lg font-light">
              Explore our handpicked curation of luxury celebration hampers, bespoke B2B swag, and wellness cases designed to make an impact.
            </p>
          </div>
          <Link
            href="/collections"
            className="flex items-center space-x-2 text-xs font-bold text-teal-deep hover:text-rani-pink transition-colors border-b-2 border-teal-deep/15 pb-1 hover:border-rani-pink/40"
          >
            <span>Explore All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              name: "The Maharaja Gold Chest",
              desc: "Premium double-decker gold rigid drawer chest filled with organic saffron honey, handmade dry fruit sweets, and clay diyas.",
              img: "/images/standout/standout_1.png",
              badge: "Royal Traditional",
              link: "/collections"
            },
            {
              name: "Jaipur Royal Relic Crate",
              desc: "Crafted pine wood sliding chest containing royal heritage brass bowls, Mysore sandalwood cones, and gourmet hazelnut clusters.",
              img: "/images/standout/standout_2.png",
              badge: "Heritage Crate",
              link: "/collections"
            },
            {
              name: "Saffron & Honey Wellness Box",
              desc: "Elegant wellness hamper featuring organic chamomile infusion teas, pure acacia honeys, brass infusers, and a soy wax candle.",
              img: "/images/standout/standout_3.png",
              badge: "Pure Wellness",
              link: "/collections"
            },
            {
              name: "The Executive Swag Case",
              desc: "Bespoke corporate onboarding case with name-engraved thermal insulated flask, smart notebook, key ring, and gourmet snacks.",
              img: "/images/standout/standout_4.png",
              badge: "Elite Corporate",
              link: "/corporate"
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FCFAF2]/80 border border-gold/15 rounded-[36px] overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col md:flex-row h-full"
            >
              {/* Image Section */}
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-72 overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-teal-deep text-[#FAF4E8] text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md">
                  {item.badge}
                </span>
              </div>

              {/* Text Info Section */}
              <div className="p-8 flex flex-col justify-between items-start text-left flex-1 h-full min-h-[220px]">
                <div className="space-y-3">
                  <h3 className="font-heading text-xl font-bold text-teal-deep leading-tight group-hover:text-rani-pink transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-teal-deep/75 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
                <Link
                  href={item.link}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-teal-deep hover:text-rani-pink transition-colors group-hover:translate-x-1 transition-transform pt-4"
                >
                  <span>Select Curation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3.5 WHAT WE OFFER SECTION */}
      <section className="max-w-6xl mx-auto px-6 space-y-10 text-center">
        <motion.div {...revealProps} className="space-y-3">
          <span className="text-[12px] font-bold tracking-widest text-rani-pink bg-rani-pink/10 px-3 py-1 rounded-full uppercase">
            Signature Services
          </span>
          <h2 className="font-heading text-3xl font-black text-teal-deep">What We Offer</h2>
          <p className="text-xs sm:text-sm text-teal-deep/60 max-w-md mx-auto leading-relaxed">
            Beautifully curated collections, bespoke unboxing studios, and high-volume corporate services scaled for your needs.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {offers.map((off, idx) => (
            <motion.div key={idx} variants={staggerItem} whileHover={{ y: -5 }}>
              <Link
                href={off.link}
                className="group bg-white border border-teal-deep/5 rounded-3xl p-6 text-left flex flex-col justify-between h-72 shadow-sm hover:shadow-md hover:border-rani-pink/10 transition-all duration-300"
              >
                <div className="space-y-4">
                  <span className="inline-block bg-saffron/5 text-saffron text-[11px] font-black tracking-wider uppercase border border-saffron/10 px-2.5 py-1 rounded-full">
                    {off.badge}
                  </span>
                  <h3 className="font-heading text-lg font-black text-teal-deep group-hover:text-rani-pink transition-colors">
                    {off.title}
                  </h3>
                  <p className="text-xs text-teal-deep/65 leading-relaxed">
                    {off.desc}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-deep group-hover:text-saffron transition-colors pt-4 border-t border-teal-deep/5">
                  <span>Explore Channel</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. THE CUSTOM CONFIGURATOR CTA */}
      <motion.section {...revealProps} className="bg-[#042F2E]/5 rounded-[40px] max-w-6xl mx-auto p-8 md:p-16 border border-teal-deep/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rani-pink/5 rounded-full blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 text-left">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-rani-pink bg-rani-pink/10 px-3 py-1.5 rounded-full">
              Artisan Configurator
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-teal-deep leading-tight">
              Design Your Own Gift Box
            </h2>
            <p className="text-sm md:text-base text-teal-deep/75 leading-relaxed">
              Every detail is tailored to your taste. Build a customized hamper by selecting specific packaging and ribbon styles, and choose up to 5 artisanal treats.
            </p>
            <Link
              href="/build"
              className="inline-flex items-center space-x-2 bg-teal-deep hover:bg-teal-deep/90 text-[#FAF4E8] px-6 py-3.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>Launch Configurator</span>
              <Zap className="w-4 h-4 text-saffron" />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-teal-deep/5 flex flex-col justify-between h-56 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <span className="font-heading text-3xl font-black text-saffron">
                    {step.num}
                  </span>
                  <h3 className="font-heading text-sm font-bold text-teal-deep">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-teal-deep/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 7. AI GIFT GENIE BANNER */}
      <section className="max-w-6xl mx-auto px-6">
        <motion.div
          {...revealProps}
          whileHover={{ y: -4 }}
          className="relative rounded-[40px] overflow-hidden bg-gradient-to-r from-amber-50 via-background to-rose-50 border border-amber-200 p-8 md:p-12 text-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 text-left"
        >
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-rani-pink/5 rounded-full blur-2xl filter animate-pulse" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-gold/5 rounded-full blur-2xl filter animate-pulse" />

          <div className="space-y-4 relative z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 bg-saffron/10 border border-saffron/20 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
              <span className="text-[12px] font-bold tracking-widest text-saffron uppercase">
                Interactive Assistant
              </span>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-black text-teal-deep tracking-tight">
              Stuck on gift selection? <br />
              Let the <span className="text-saffron">Gift Genie AI</span> choose.
            </h3>
            <p className="text-xs md:text-sm text-slate-650">
              Describe who you are buying for, their interests, and your budget, and our AI Genie will select the exact combinations to make them smile.
            </p>
          </div>

          <Link
            href="/gift-genie"
            className="flex-shrink-0 flex items-center space-x-2 bg-teal-deep hover:bg-teal-deep/90 text-[#FAF4E8] font-bold text-sm px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative z-10"
          >
            <span>Consult the Genie</span>
            <Sparkles className="w-4 h-4 text-[#FAF4E8]" />
          </Link>
        </motion.div>
      </section>

      {/* 4. BRAND MISSION STATEMENT */}
      <motion.section {...revealProps} className="max-w-4xl mx-auto px-6 text-center relative py-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="space-y-6 max-w-2xl mx-auto py-4">
          <Heart className="w-6 h-6 text-rani-pink mx-auto animate-pulse" />
          <h2 className="font-heading text-3xl font-extrabold text-teal-deep italic">
            {missionHeadline}
          </h2>
          <p className="font-body text-sm sm:text-base text-teal-deep/80 leading-relaxed font-light">
            {missionBody}
          </p>
          <div className="w-16 h-0.5 bg-saffron mx-auto rounded-full" />
        </div>
      </motion.section>

      {/* 8. TESTIMONIALS SLIDER SECTION */}
      <section className="max-w-6xl mx-auto px-6 space-y-8 text-center">
        <motion.div {...revealProps} className="space-y-3">
          <span className="text-[12px] font-bold tracking-widest text-rani-pink bg-rani-pink/10 px-3 py-1 rounded-full uppercase">
            Client Testimonials
          </span>
          <h2 className="font-heading text-3xl font-black text-teal-deep">
            Trusted by Gifting Lovers
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="bg-white border border-teal-deep/5 p-8 rounded-3xl shadow-sm text-left flex flex-col justify-between h-72 relative"
            >
              <div className="space-y-4">
                <div className="flex space-x-1 text-saffron">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-saffron" />
                  ))}
                </div>
                <p className="text-xs text-teal-deep/85 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="border-t border-teal-deep/5 pt-4 flex justify-between items-center mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-teal-deep">{t.author}</span>
                  <span className="text-[12px] text-teal-deep/50">{t.role}</span>
                </div>
                <Heart className="w-4 h-4 text-rani-pink/30" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 2.5 TRUSTED BY MANY CLIENT CAROUSEL */}
      <section className="max-w-6xl mx-auto px-6 text-center space-y-8">
        <motion.div {...revealProps} className="space-y-1">
          <span className="text-[11px] uppercase tracking-widest font-black text-saffron block">Our Corporate Partners</span>
          <h2 className="font-heading text-2xl font-black text-teal-deep">Trusted By Industry Leaders</h2>
        </motion.div>

        <div className="relative py-4 overflow-hidden bg-white/40 border-y border-teal-deep/5 backdrop-blur-sm">
          <div className="flex space-x-16 animate-marquee whitespace-nowrap">
            {[...clientLogos, ...clientLogos].map((client, idx) => (
              <div key={idx} className="inline-flex flex-col items-center justify-center min-w-[120px]">
                <span className="font-heading text-lg font-black tracking-tight text-teal-deep hover:text-rani-pink transition-colors">
                  {client.name}
                </span>
                <span className="text-[10px] text-teal-deep/40 uppercase tracking-widest">{client.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8.5 QUICK BULK & CORPORATE GIFTING CONTACT FORM */}
      <section id="bulk-contact" className="max-w-4xl mx-auto px-6">
        <motion.div {...revealProps} className="bg-white border border-teal-deep/5 rounded-[40px] p-8 md:p-14 shadow-lg text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -z-10" />
          
          <div className="md:col-span-5 space-y-6">
            <span className="text-[11px] uppercase tracking-widest font-black text-saffron bg-saffron/10 border border-saffron/25 px-3.5 py-1.5 rounded-full inline-block">
              Inquire Now
            </span>
            <h2 className="font-heading text-3xl font-black text-teal-deep leading-tight">
              Planning a <br />
              Bulk Order?
            </h2>
            <p className="text-xs text-teal-deep/75 leading-relaxed">
              Submit your corporate branding details or wedding catalog request. Get dedicated designers, custom card monograms, and shipping link coordination.
            </p>
            <div className="space-y-3 pt-2">
              <Link
                href="/corporate"
                className="text-xs font-bold text-rani-pink hover:underline flex items-center space-x-1"
              >
                <span>Corporate Bulk Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/weddings"
                className="text-xs font-bold text-saffron hover:underline flex items-center space-x-1"
              >
                <span>Wedding Favors Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 w-full bg-background border border-teal-deep/5 rounded-3xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleBulkSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Contact Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      required
                      placeholder="Phone (WhatsApp) *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                    <input
                      type="text"
                      placeholder="Company / Wedding Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none text-teal-deep"
                    >
                      <option value="20-50">20 to 50 boxes</option>
                      <option value="50-100">50 to 100 boxes</option>
                      <option value="100-300">100 to 300 boxes</option>
                      <option value="300+">300+ boxes</option>
                    </select>

                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none text-teal-deep"
                    >
                      <option value="Under ₹1500">Under ₹1,500</option>
                      <option value="₹1500 - ₹2500">₹1,500 - ₹2,500</option>
                      <option value="₹2500 - ₹4000">₹2,500 - ₹4,000</option>
                      <option value="₹4000+">₹4,000+ per box</option>
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Short brief details (e.g. customized logo wraps, specific diwali candles)..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full bg-white border border-teal-deep/15 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-rani-pink/40 resize-none"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-teal-deep hover:bg-teal-deep/95 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow"
                  >
                    {isSubmitting ? "Logging Inquiry..." : "Send Bulk Inquiry"}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-teal-deep">Inquiry Logged!</h3>
                  <p className="text-[13px] text-teal-deep/70 max-w-xs mx-auto leading-relaxed">
                    Thank you! Our bulk accounts consultant will reach out via WhatsApp/Email in under 12 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-semibold px-4 py-1.5 border border-teal-deep text-teal-deep rounded-full hover:bg-teal-deep/5 transition-colors"
                  >
                    Inquire Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* 8.8 INSTAGRAM FEED SECTION (Inspired by confettigifts.in footer display) */}
      <section className="max-w-6xl mx-auto px-6 space-y-8 text-center">
        <motion.div {...revealProps} className="space-y-2">
          <InstagramIcon className="w-6 h-6 text-rani-pink mx-auto animate-bounce" />
          <h2 className="font-heading text-3xl font-black text-teal-deep">Shop Our Instagram</h2>
          <p className="text-xs text-teal-deep/60 max-w-sm mx-auto leading-relaxed">
            Follow <a href="https://instagram.com/theboxstory" target="_blank" rel="noopener noreferrer" className="text-rani-pink font-bold hover:underline">@theboxstory</a> on Instagram for unboxing reels, artisan stories, and hampers updates.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {instagramPosts.map((url, idx) => (
            <motion.a
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -3 }}
              href="https://instagram.com/theboxstory"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-3xl overflow-hidden bg-teal-deep/5 border border-teal-deep/5 shadow-sm block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Instagram Feed Post ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#9D174D]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-[#FAF4E8] space-y-1">
                <InstagramIcon className="w-5 h-5 text-[#FAF4E8]" />
                <span className="text-[12px] font-bold uppercase tracking-wider">Shop the Look</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-6 space-y-8 text-left">
        <motion.h2 {...revealProps} className="font-heading text-3xl font-black text-teal-deep text-center">
          Gifting Questions? We Have Answers
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-4"
        >
          {faqs.map((faq, idx) => {
            const isFaqActive = activeFaq === idx;
            return (
              <motion.div
                key={idx}
                variants={staggerItem}
                className="bg-white rounded-2xl border border-teal-deep/5 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isFaqActive ? null : idx)}
                  className="w-full flex items-center justify-between p-6 focus:outline-none"
                >
                  <span className="text-sm font-bold text-teal-deep">{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-teal-deep/50 transition-transform duration-300 ${
                      isFaqActive ? "transform rotate-90 text-rani-pink" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isFaqActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-teal-deep/5"
                    >
                      <p className="p-6 text-xs text-teal-deep/75 leading-relaxed bg-background/40">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
