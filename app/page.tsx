"use client";

import React, { useState } from "react";
import Link from "next/link";
import { curatedProducts } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { Sparkles, Gift, ArrowRight, CheckCircle2, ChevronRight, Zap, Star, ShieldCheck, Heart, Info, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const trending = curatedProducts.slice(0, 3);
  const [activeTab, setActiveTab] = useState<"occasion" | "recipient">("occasion");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
      { name: "Diwali", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&auto=format&fit=crop&q=80" },
      { name: "Weddings", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=300&auto=format&fit=crop&q=80" },
      { name: "Anniversary", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80" },
      { name: "Corporate", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80" },
      { name: "Housewarming", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&auto=format&fit=crop&q=80" },
    ],
    recipient: [
      { name: "For Him", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80" },
      { name: "For Her", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" },
      { name: "For Couples", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=80" },
      { name: "For Co-workers", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80" },
      { name: "For Parents", image: "https://images.unsplash.com/photo-1531844703905-3c128f81c737?w=300&auto=format&fit=crop&q=80" },
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
      <section className="relative min-h-[85vh] flex items-center px-6 overflow-hidden">
        {/* Dynamic Warm Mesh Background */}
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-saffron/15 rounded-full blur-3xl mix-blend-multiply filter animate-pulse" />
          <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-rani-pink/10 rounded-full blur-3xl mix-blend-multiply filter animate-pulse" />
          <div className="absolute top-1/2 left-1/3 w-[250px] h-[250px] bg-teal-deep/5 rounded-full blur-3xl filter" />
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-saffron/10 border border-saffron/20 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-saffron" />
              <span className="text-xs font-bold uppercase tracking-wider text-saffron">
                Bespoke Luxury Gifting Studio
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-teal-deep leading-tight">
              Gifts of Distinction, <br />
              <span className="text-rani-pink">Beautifully Styled</span>
            </h1>

            <p className="text-base sm:text-lg text-teal-deep/75 max-w-xl leading-relaxed">
              Express love and celebrations with our luxurious rigid hamper boxes. Sourced from local Indian artisans, customized with custom ribbon wrapping, and shipped with handwritten messages.
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
          </motion.div>

          {/* Right Floating Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Box Layer */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute top-4 left-6 w-full h-full border border-gold/30 bg-gradient-to-tr from-[#FAF4E8]/85 to-gold/20 rounded-3xl backdrop-blur-md shadow-[0_30px_60px_rgba(226,186,95,0.15)] flex flex-col p-8 justify-between z-20"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-saffron bg-saffron/10 border border-saffron/20 px-3 py-1 rounded-full">
                    Satin Wrap & Rigid Box
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-1.5 bg-rani-pink rounded-full" />
                  <h3 className="font-heading text-2xl font-bold leading-tight text-teal-deep">
                    The Royal Heritage Hamper
                  </h3>
                  <div className="flex space-x-2">
                    <span className="text-[10px] bg-teal-deep/5 px-2 py-0.5 rounded-full text-teal-deep/75">Brass Diya</span>
                    <span className="text-[10px] bg-teal-deep/5 px-2 py-0.5 rounded-full text-teal-deep/75">Mithai</span>
                    <span className="text-[10px] bg-teal-deep/5 px-2 py-0.5 rounded-full text-teal-deep/75">Saffron</span>
                  </div>
                </div>
              </motion.div>

              <div className="absolute top-12 left-12 w-full h-full bg-[#FAF4E8] border border-slate-200 rounded-3xl shadow-sm z-10" />

              <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 w-20 h-20 bg-rani-pink rounded-full blur-sm opacity-80 z-20 flex items-center justify-center shadow-lg"
              >
                <Gift className="w-8 h-8 text-[#FAF4E8]" />
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

      {/* 3. CIRCULAR CATEGORY SHOWCASE (Inspired by Confetti Gifts & The Good Road) */}
      <section className="max-w-6xl mx-auto px-6 space-y-10 text-center">
        <div className="space-y-4">
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
        </div>

        {/* Categories slider row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 justify-center">
          {circularCategories[activeTab].map((cat, idx) => (
            <Link
              key={idx}
              href="/collections"
              className="group flex flex-col items-center space-y-3 focus:outline-none"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-teal-deep/5 shadow-sm group-hover:shadow-md group-hover:border-rani-pink/20 transition-all duration-300 relative">
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
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL BRAND STORY (The Good Road style) */}
      <section className="max-w-4xl mx-auto px-6 text-center relative py-12">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        
        <div className="space-y-6 max-w-2xl mx-auto py-4">
          <Heart className="w-6 h-6 text-rani-pink mx-auto animate-pulse" />
          <h2 className="font-heading text-3xl font-extrabold text-teal-deep italic">
            The Art of Handcrafted Gifting
          </h2>
          <p className="font-body text-sm sm:text-base text-teal-deep/80 leading-relaxed font-light">
            We believe that a gift should tell a story. Not of mass production, but of local Indian artisans, handcrafted brass, stone burners, and premium organic harvests. Every box is curated individually in our Jaipur studio, hand-wrapped with high-grade silk or gold bows, and shipped directly with a personalized message card.
          </p>
          <div className="w-16 h-0.5 bg-saffron mx-auto rounded-full" />
        </div>
      </section>

      {/* 5. TRENDING CURATIONS GRID */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 text-left">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-teal-deep">
              Trending Celebrations
            </h2>
            <p className="text-sm text-teal-deep/70 max-w-lg">
              Expertly paired items combined into delightful custom boxes, curated for immediate celebration and joy.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center space-x-1 text-sm font-bold text-rani-pink hover:text-rani-pink/80 group self-start"
          >
            <span>View All Curations</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. THE CUSTOM CONFIGURATOR CTA ("HOW IT WORKS") */}
      <section className="bg-[#042F2E]/5 rounded-[40px] max-w-6xl mx-auto p-8 md:p-16 border border-teal-deep/5 relative overflow-hidden">
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

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-teal-deep/5 flex flex-col justify-between h-56 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="font-heading text-3xl font-black text-rani-pink/20">
                  {step.num}
                </span>
                <div className="space-y-2 mt-auto">
                  <h4 className="font-heading text-base font-bold text-teal-deep">
                    {step.title}
                  </h4>
                  <p className="text-xs text-teal-deep/60 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AI GIFT GENIE BANNER */}
      <section className="max-w-6xl mx-auto px-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="relative rounded-[40px] overflow-hidden bg-gradient-to-r from-amber-50 via-background to-rose-50 border border-amber-200 p-8 md:p-12 text-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 text-left"
        >
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-rani-pink/5 rounded-full blur-2xl filter animate-pulse" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-gold/5 rounded-full blur-2xl filter animate-pulse" />

          <div className="space-y-4 relative z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 bg-saffron/10 border border-saffron/20 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-saffron uppercase">
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

      {/* 8. TESTIMONIALS SLIDER SECTION */}
      <section className="max-w-6xl mx-auto px-6 space-y-10 text-center">
        <div className="space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-rani-pink bg-rani-pink/10 px-3 py-1 rounded-full uppercase">
            Client Testimonials
          </span>
          <h2 className="font-heading text-3xl font-black text-teal-deep">
            Trusted by Gifting Lovers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
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
                  <span className="text-[10px] text-teal-deep/50">{t.role}</span>
                </div>
                <Heart className="w-4 h-4 text-rani-pink/30" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-6 space-y-10 text-left">
        <h2 className="font-heading text-3xl font-black text-teal-deep text-center">
          Gifting Questions? We Have Answers
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isFaqActive = activeFaq === idx;
            return (
              <div
                key={idx}
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
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
