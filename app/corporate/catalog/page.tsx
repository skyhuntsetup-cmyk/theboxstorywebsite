"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Sparkles, BookOpen, 
  Download, MessageSquare, Phone, Laptop, Award, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CatalogFlipbook() {
  const [currentPage, setCurrentPage] = useState(0); // 0, 2, 4, 6... (double-page spreads)
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  const catalogPages = Array.from({ length: 57 }, (_, i) => ({
    type: "image",
    src: `/images/catalog/page_${i + 1}.png`,
    pageNumber: i + 1,
    bg: "bg-white"
  }));

  const totalPageSets = Math.ceil(catalogPages.length / 2);

  const nextPage = () => {
    if (currentPage < (totalPageSets - 1) * 2) {
      setFlipDirection("next");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 2);
        setIsFlipping(false);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setFlipDirection("prev");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 2);
        setIsFlipping(false);
      }, 300);
    }
  };

  const pageSpreadVariants = {
    initial: (dir: "next" | "prev") => ({
      rotateY: dir === "next" ? 45 : -45,
      opacity: 0,
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" as const }
    },
    exit: (dir: "next" | "prev") => ({
      rotateY: dir === "next" ? -45 : 45,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" as const }
    })
  };

  const renderPageContent = (page: any) => {
    if (!page) return null;

    switch (page.type) {
      case "image":
        return (
          <div className="h-full w-full select-none relative bg-white flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={page.src} 
              alt={`Catalog Page ${page.pageNumber}`} 
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-teal-deep/40 bg-white/80 backdrop-blur-sm border border-teal-deep/5 px-3 py-1 rounded-full">
              Page {page.pageNumber} / 57
            </span>
          </div>
        );
      case "cover":
        return (
          <div className="h-full flex flex-col justify-between p-10 select-none relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#022423_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="flex justify-between items-center relative z-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-saffron bg-saffron/10 px-3 py-1.5 rounded-full border border-saffron/20">
                {page.description}
              </span>
              <BookOpen className="w-5 h-5 text-teal-deep/30" />
            </div>

            <div className="space-y-6 text-left relative z-10 my-auto">
              <span className="text-xs font-bold text-rani-pink tracking-widest uppercase">The Box Story</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-teal-deep leading-tight">
                {page.subtitle}
              </h2>
              <div className="w-16 h-1 bg-saffron rounded-full" />
              <p className="text-[11px] text-teal-deep/70 max-w-xs font-light leading-relaxed">
                {page.tagline}
              </p>
            </div>

            <div className="text-[9px] font-mono text-teal-deep/30 tracking-widest text-left">
              © 2026 THE BOX STORY STUDY
            </div>
          </div>
        );

      case "editorial":
        return (
          <div className="h-full flex flex-col justify-between p-10 select-none">
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-black text-teal-deep text-left">{page.title}</h3>
              {page.image && (
                <div className="w-full h-40 rounded-2xl overflow-hidden border border-teal-deep/5 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={page.image} alt={page.title} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs text-teal-deep/80 leading-relaxed font-light text-left">
                {page.content}
              </p>
            </div>
            {page.pageNumber && (
              <span className="text-[10px] font-mono text-teal-deep/40 text-center block">Page {page.pageNumber}</span>
            )}
          </div>
        );

      case "product":
        return (
          <div className="h-full flex flex-col justify-between p-10 select-none bg-white">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase font-black text-rani-pink bg-rani-pink/5 px-2.5 py-1 rounded-full border border-rani-pink/10">
                  {page.category}
                </span>
                <span className="font-heading font-black text-teal-deep text-lg">{page.price}</span>
              </div>

              {page.image && (
                <div className="w-full h-40 rounded-2xl overflow-hidden border border-teal-deep/5 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={page.image} alt={page.name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-2 text-left">
                <h4 className="font-heading text-base font-black text-teal-deep">{page.name}</h4>
                <p className="text-[11px] text-teal-deep/70 leading-relaxed font-light">
                  {page.description}
                </p>
              </div>
            </div>
            {page.pageNumber && (
              <span className="text-[10px] font-mono text-teal-deep/40 text-center block">Page {page.pageNumber}</span>
            )}
          </div>
        );

      case "portal":
        return (
          <div className="h-full flex flex-col justify-between p-10 select-none">
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-black text-teal-deep text-left">{page.title}</h3>
              {page.image && (
                <div className="w-full h-40 rounded-2xl overflow-hidden border border-teal-deep/5 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={page.image} alt={page.title} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs text-teal-deep/80 leading-relaxed font-light text-left">
                {page.content}
              </p>
            </div>
            {page.pageNumber && (
              <span className="text-[10px] font-mono text-teal-deep/40 text-center block">Page {page.pageNumber}</span>
            )}
          </div>
        );

      case "stats":
        return (
          <div className="h-full flex flex-col justify-between p-10 select-none bg-white">
            <div className="space-y-8 text-left">
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-black text-teal-deep">{page.title}</h3>
                <p className="text-[11px] text-teal-deep/60 leading-relaxed font-light">
                  {page.desc}
                </p>
              </div>

              <div className="space-y-4">
                {page.stats?.map((stat: any, i: number) => (
                  <div key={i} className="flex justify-between items-center border-b border-teal-deep/5 pb-2">
                    <span className="text-xs text-teal-deep/60 font-semibold">{stat.label}</span>
                    <span className="font-heading font-black text-saffron text-base">{stat.num}</span>
                  </div>
                ))}
              </div>
            </div>
            {page.pageNumber && (
              <span className="text-[10px] font-mono text-teal-deep/40 text-center block">Page {page.pageNumber}</span>
            )}
          </div>
        );

      case "backcover":
        return (
          <div className="h-full flex flex-col justify-between p-10 select-none text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold text-rani-pink tracking-wider block">Submit Brief</span>
              <h3 className="font-heading text-2xl font-black text-teal-deep leading-tight">Scale Gifting Campaigns</h3>
              <p className="text-[11px] text-teal-deep/70 font-light leading-relaxed">
                {page.tagline}
              </p>
            </div>

            <div className="space-y-4 bg-teal-deep/5 p-4 rounded-2xl border border-teal-deep/10">
              <div className="flex items-center space-x-2 text-xs text-teal-deep/80 font-bold">
                <MessageSquare className="w-4 h-4 text-rani-pink" />
                <span>{page.contact}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-teal-deep/80 font-bold">
                <Phone className="w-4 h-4 text-saffron" />
                <span>{page.whatsapp}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link 
                href="/corporate#brief-form"
                className="w-full py-2.5 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl text-center font-bold text-xs uppercase shadow block"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-800 py-16 px-6 flex flex-col items-center justify-between">
      
      {/* Top Header */}
      <div className="w-full max-w-5xl flex justify-between items-center border-b border-teal-deep/5 pb-4 mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            href="/corporate"
            className="p-2 bg-white hover:bg-teal-deep/5 border border-teal-deep/15 text-teal-deep rounded-full transition-colors flex items-center justify-center"
            title="Back to Corporate Gifting"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-bold text-teal-deep">Digital Lookbook</h1>
            <p className="text-[10px] text-teal-deep/50 uppercase tracking-widest font-black">Interactive Catalogue Edition 2026</p>
          </div>
        </div>

        <button 
          onClick={() => alert("Downloading PDF catalog...")}
          className="flex items-center space-x-1.5 bg-teal-deep hover:bg-teal-deep/95 text-white px-4 py-2 rounded-xl font-bold text-xs shadow transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Main Flipbook Container */}
      <div className="w-full max-w-5xl flex justify-center items-center my-auto perspective-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-[#FAF4E8] rounded-[32px] overflow-hidden shadow-2xl border-4 border-gold/40 relative aspect-[14/9] w-full min-h-[480px]">
          
          <AnimatePresence custom={flipDirection} mode="wait">
            {/* Left Page Page Spread */}
            <motion.div
              key={`left-${currentPage}`}
              custom={flipDirection}
              variants={pageSpreadVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`border-r border-teal-deep/10 shadow-[inset_-10px_0_20px_rgba(2,36,35,0.02)] h-full overflow-hidden ${
                catalogPages[currentPage]?.bg || "bg-white"
              }`}
            >
              {renderPageContent(catalogPages[currentPage])}
            </motion.div>

            {/* Right Page Page Spread */}
            <motion.div
              key={`right-${currentPage}`}
              custom={flipDirection}
              variants={pageSpreadVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`shadow-[inset_10px_0_20px_rgba(2,36,35,0.02)] h-full overflow-hidden ${
                catalogPages[currentPage + 1]?.bg || "bg-[#FCFAF2]"
              }`}
            >
              {renderPageContent(catalogPages[currentPage + 1])}
            </motion.div>
          </AnimatePresence>

          {/* Book Spine Center shadow overlay */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-teal-deep/10 via-teal-deep/20 to-teal-deep/10 pointer-events-none" />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-lg mt-12 flex flex-col items-center space-y-4">
        <div className="flex justify-between items-center w-full">
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-teal-deep/15 hover:border-teal-deep/35 rounded-xl disabled:opacity-40 font-bold text-xs text-teal-deep transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Prev Page</span>
          </button>

          <span className="text-xs font-mono font-bold text-teal-deep bg-teal-deep/5 px-4 py-1.5 rounded-full">
            Pages {currentPage + 1} - {currentPage + 2} of {catalogPages.length}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage >= (totalPageSets - 1) * 2 || isFlipping}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-teal-deep/15 hover:border-teal-deep/35 rounded-xl disabled:opacity-40 font-bold text-xs text-teal-deep transition-all shadow-sm"
          >
            <span>Next Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar indicator */}
        <div className="w-full h-1.5 bg-teal-deep/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-saffron"
            animate={{ width: `${((currentPage + 2) / catalogPages.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

    </div>
  );
}
