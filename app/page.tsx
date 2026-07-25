"use client";

import React from "react";
import Link from "next/link";
import { curatedProducts } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { Sparkles, Gift, ArrowRight, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const trending = curatedProducts.slice(0, 3);

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

  // Steps for Build-a-box
  const steps = [
    {
      num: "01",
      title: "Select Your Premium Box",
      desc: "Choose from our signature rigid boxes with handcrafted gold foiling details.",
    },
    {
      num: "02",
      title: "Curate Up To 5 Artisanal Items",
      desc: "Fill it with gourmet delicacies, custom wellness treats, and timeless brass decor.",
    },
    {
      num: "03",
      title: "Deliver With Warmth",
      desc: "Add a personalized cursive-font card, and ship directly or send via a Magical Link.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center px-6 overflow-hidden">
        {/* Dynamic Warm Mesh Background */}
        <div className="absolute inset-0 -z-10 bg-[#FFFDF5]">
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
                Introducing The Box Story AI
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-teal-deep leading-tight">
              Thoughtful Gifting, <br />
              <span className="text-rani-pink">Artfully Configured</span>
            </h1>

            <p className="text-base sm:text-lg text-teal-deep/75 max-w-xl leading-relaxed">
              Express love, respect, and celebrations with our luxurious bespoke hampers. Choose pre-curated sets or custom-build a box of delights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/build"
                className="group flex items-center justify-center space-x-2 bg-rani-pink hover:bg-rani-pink/95 text-[#FFFDF5] px-8 py-4 rounded-full font-bold text-base shadow-[0_15px_30px_rgba(209,18,106,0.25)] hover:shadow-[0_20px_40px_rgba(209,18,106,0.35)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Build Your Box</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/collections"
                className="flex items-center justify-center space-x-2 bg-[#FFFDF5] hover:bg-teal-deep/5 text-teal-deep border-2 border-teal-deep px-8 py-4 rounded-full font-bold text-base shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
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
            {/* Visual Box Layers */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Golden Ribbon Layer */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute top-4 left-6 w-full h-full border border-gold/30 bg-gradient-to-tr from-[#FFFDF5]/80 to-gold/20 rounded-3xl backdrop-blur-md shadow-[0_30px_60px_rgba(226,186,95,0.15)] flex flex-col p-8 justify-between z-20"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-saffron bg-saffron/10 border border-saffron/20 px-3 py-1 rounded-full">
                    Handcrafted Premium Box
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

              {/* Back Box Shadow Layer */}
              <div className="absolute top-12 left-12 w-full h-full bg-teal-deep rounded-3xl shadow-[0_40px_80px_rgba(4,47,46,0.15)] z-10" />

              {/* Side Accent Floating Sphere */}
              <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 w-20 h-20 bg-rani-pink rounded-full blur-sm opacity-80 z-20 flex items-center justify-center shadow-lg"
              >
                <Gift className="w-8 h-8 text-[#FFFDF5]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. INFINITE OCCASIONS MARQUEE */}
      <section className="bg-teal-deep py-6 overflow-hidden border-y-4 border-gold">
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="flex animate-marquee space-x-12">
            {[...occasions, ...occasions].map((occ, idx) => (
              <span
                key={idx}
                className="flex items-center space-x-3 text-[#FFFDF5] font-heading font-black text-xl md:text-2xl tracking-widest"
              >
                <span>{occ}</span>
                <Sparkles className="w-5 h-5 text-saffron" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING CURATIONS GRID */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-teal-deep">
              Trending Celebrations
            </h2>
            <p className="text-sm text-teal-deep/70 max-w-lg">
              Expertly paired items combined into delightful custom boxes, curated for immediate celebration and joy.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center space-x-1 text-sm font-bold text-rani-pink hover:text-rani-pink/80 group"
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

      {/* 4. THE CUSTOM CONFIGURATOR CTA ("HOW IT WORKS") */}
      <section className="bg-[#042F2E]/5 rounded-[40px] max-w-6xl mx-auto p-8 md:p-16 border border-teal-deep/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rani-pink/5 rounded-full blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-rani-pink bg-rani-pink/10 px-3 py-1.5 rounded-full">
              Artisan Configurator
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-teal-deep leading-tight">
              Design Your Own Gift Box
            </h2>
            <p className="text-sm md:text-base text-teal-deep/75 leading-relaxed">
              Every detail is tailored to your taste. Build a customized hamper by selecting specific artisanal items that represent the message you want to send.
            </p>
            <Link
              href="/build"
              className="inline-flex items-center space-x-2 bg-teal-deep hover:bg-teal-deep/90 text-[#FFFDF5] px-6 py-3.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all"
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

      {/* 5. AI GIFT GENIE BANNER */}
      <section className="max-w-6xl mx-auto px-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="relative rounded-[40px] overflow-hidden bg-gradient-to-r from-teal-deep to-[#031d1d] p-8 md:p-12 text-[#FFFDF5] border border-[#FFFDF5]/10 shadow-[0_20px_50px_rgba(4,47,46,0.25)] flex flex-col md:flex-row justify-between items-center gap-8"
        >
          {/* Sparkles background */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-rani-pink/15 rounded-full blur-2xl filter animate-pulse" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-gold/10 rounded-full blur-2xl filter animate-pulse" />

          <div className="space-y-4 relative z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 bg-saffron/10 border border-saffron/20 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-saffron uppercase">
                Interactive Assistant
              </span>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-black tracking-tight">
              Stuck on gift selection? <br />
              Let the <span className="text-saffron">Gift Genie AI</span> choose.
            </h3>
            <p className="text-xs md:text-sm text-[#FFFDF5]/70 max-w-lg">
              Describe who you are buying for, their interests, and your budget, and our AI Genie will select the exact combinations to make them smile.
            </p>
          </div>

          <Link
            href="/gift-genie"
            className="flex-shrink-0 flex items-center space-x-2 bg-gradient-to-r from-saffron to-rani-pink hover:from-saffron hover:to-rani-pink text-[#FFFDF5] font-bold text-sm px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative z-10"
          >
            <span>Consult the Genie</span>
            <Sparkles className="w-4 h-4 text-[#FFFDF5]" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
