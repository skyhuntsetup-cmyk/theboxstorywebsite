"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Sparkles, BookOpen, 
  Download, MessageSquare, Phone, Laptop, Award, Check,
  Maximize2, Minimize2, Grid, ChevronUp, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CatalogFlipbook() {
  const [currentPage, setCurrentPage] = useState(0); // 0, 2, 4, 6... (double-page spreads)
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const catalogPages = Array.from({ length: 57 }, (_, i) => ({
    type: "image",
    src: `/images/catalog/page_${i + 1}.png`,
    pageNumber: i + 1,
    bg: "bg-[#faf4e7]"
  }));

  const totalPageSets = Math.ceil(catalogPages.length / 2);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoomedImage) {
        if (e.key === "Escape") setZoomedImage(null);
        return;
      }
      if (e.key === "ArrowRight") {
        nextPage();
      } else if (e.key === "ArrowLeft") {
        prevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, zoomedImage]);

  const nextPage = () => {
    if (currentPage < (totalPageSets - 1) * 2 && !isFlipping) {
      setFlipDirection("next");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 2);
        setIsFlipping(false);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection("prev");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 2);
        setIsFlipping(false);
      }, 300);
    }
  };

  const jumpToPageSet = (index: number) => {
    // Ensure index is even
    const target = index % 2 === 0 ? index : index - 1;
    if (target >= 0 && target < catalogPages.length) {
      setFlipDirection(target > currentPage ? "next" : "prev");
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(target);
        setIsFlipping(false);
      }, 300);
    }
  };

  const pageSpreadVariants = {
    initial: (dir: "next" | "prev") => ({
      rotateY: dir === "next" ? 85 : -85,
      transformOrigin: dir === "next" ? "left center" : "right center",
      opacity: 0,
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
    exit: (dir: "next" | "prev") => ({
      rotateY: dir === "next" ? -85 : 85,
      transformOrigin: dir === "next" ? "right center" : "left center",
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" as const }
    })
  };

  const renderPageContent = (page: any, isRight: boolean) => {
    if (!page) {
      // Empty page representing the back cover template or empty page
      return (
        <div className="h-full w-full bg-[#faf4e7] select-none flex flex-col items-center justify-center border-l border-teal-deep/5">
          <BookOpen className="w-8 h-8 text-teal-deep/20 animate-pulse mb-2" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-deep/30">End of Catalogue</span>
        </div>
      );
    }

    return (
      <div 
        onClick={() => setZoomedImage(page.src)}
        className="h-full w-full select-none relative bg-[#faf4e7] flex items-center justify-center overflow-hidden cursor-zoom-in group"
      >
        {/* Full Page image layout */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={page.src} 
          alt={`Catalog Page ${page.pageNumber}`} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
        />

        {/* Hover zoom icon badge */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-teal-deep/75 backdrop-blur-sm p-2 rounded-xl text-white shadow">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>

        {/* Tactile page flip indicator */}
        <div className={`absolute inset-y-0 w-8 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r ${
          isRight 
            ? "right-0 from-transparent to-teal-deep/60" 
            : "left-0 from-teal-deep/60 to-transparent"
        }`} />

        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-teal-deep/40 bg-[#FCFAF2]/80 backdrop-blur-sm border border-teal-deep/5 px-3 py-1 rounded-full shadow-sm">
          Page {page.pageNumber} / 57
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf4e7] text-slate-800 py-12 px-6 flex flex-col justify-between items-center transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Top Navbar Header */}
      <div className="w-full max-w-5xl flex justify-between items-center border-b border-teal-deep/5 pb-4 mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            href="/corporate"
            className="p-2 bg-white hover:bg-teal-deep/5 border border-teal-deep/15 text-teal-deep rounded-full transition-all hover:scale-105 flex items-center justify-center shadow-sm"
            title="Back to Corporate Gifting"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-black text-teal-deep">Digital Catalog Studio</h1>
            <p className="text-[9px] text-teal-deep/50 uppercase tracking-widest font-black flex items-center space-x-1">
              <span>Interactive Canva Edition</span>
              <Sparkles className="w-3 h-3 text-saffron" />
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-sm border transition-all ${
              showThumbnails 
                ? "bg-saffron border-saffron text-white" 
                : "bg-white border-teal-deep/15 text-teal-deep hover:bg-teal-deep/5"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Thumbnails</span>
          </button>
          <button 
            onClick={() => alert("Downloading PDF catalog...")}
            className="flex items-center space-x-1.5 bg-teal-deep hover:bg-teal-deep/95 text-white px-4 py-2 rounded-xl font-bold text-xs shadow transition-all hover:scale-[1.02]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Flipbook Box */}
      <div className="w-full max-w-5xl flex justify-center items-center my-auto perspective-[1800px]">
        {/* Prev Hover edge target */}
        <button 
          onClick={prevPage}
          disabled={currentPage === 0}
          className="hidden md:flex absolute left-4 w-12 h-4/5 items-center justify-center bg-teal-deep/0 hover:bg-teal-deep/5 text-teal-deep/20 hover:text-teal-deep rounded-3xl transition-all z-20 group disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Double Page Binder */}
        <div className="grid grid-cols-1 md:grid-cols-2 bg-[#faf4e7] rounded-[36px] overflow-hidden shadow-2xl border-4 border-gold/30 relative aspect-[14/9] w-full min-h-[480px]">
          
          <AnimatePresence custom={flipDirection} mode="wait">
            {/* Left Page (Even) */}
            <motion.div
              key={`left-${currentPage}`}
              custom={flipDirection}
              variants={pageSpreadVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="border-r border-teal-deep/10 shadow-[inset_-12px_0_24px_rgba(2,36,35,0.03)] h-full overflow-hidden bg-[#faf4e7] relative"
            >
              {renderPageContent(catalogPages[currentPage], false)}
            </motion.div>

            {/* Right Page (Odd) */}
            <motion.div
              key={`right-${currentPage}`}
              custom={flipDirection}
              variants={pageSpreadVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="shadow-[inset_12px_0_24px_rgba(2,36,35,0.03)] h-full overflow-hidden bg-[#faf4e7] relative"
            >
              {renderPageContent(catalogPages[currentPage + 1], true)}
            </motion.div>
          </AnimatePresence>

          {/* Binding Spine shadow overlay */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 bg-gradient-to-r from-teal-deep/5 via-teal-deep/15 to-teal-deep/5 pointer-events-none z-10" />
        </div>

        {/* Next Hover edge target */}
        <button 
          onClick={nextPage}
          disabled={currentPage >= (totalPageSets - 1) * 2}
          className="hidden md:flex absolute right-4 w-12 h-4/5 items-center justify-center bg-teal-deep/0 hover:bg-teal-deep/5 text-teal-deep/20 hover:text-teal-deep rounded-3xl transition-all z-20 group disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Bottom Controls panel */}
      <div className="w-full max-w-lg mt-8 flex flex-col items-center space-y-4">
        <div className="flex justify-between items-center w-full">
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className="flex items-center space-x-1 px-4 py-2.5 bg-white border border-teal-deep/15 hover:border-teal-deep/35 text-teal-deep rounded-xl disabled:opacity-40 font-bold text-xs transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-mono font-bold text-teal-deep bg-teal-deep/5 px-4 py-1.5 rounded-full shadow-sm">
            Spread {Math.floor(currentPage / 2) + 1} / {totalPageSets} (Pages {currentPage + 1}-{Math.min(currentPage + 2, catalogPages.length)})
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage >= (totalPageSets - 1) * 2 || isFlipping}
            className="flex items-center space-x-1 px-4 py-2.5 bg-white border border-teal-deep/15 hover:border-teal-deep/35 text-teal-deep rounded-xl disabled:opacity-40 font-bold text-xs transition-all shadow-sm"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Timeline slider */}
        <div className="w-full h-1.5 bg-teal-deep/5 rounded-full overflow-hidden relative cursor-pointer group">
          <motion.div 
            className="h-full bg-saffron"
            animate={{ width: `${((currentPage + 2) / catalogPages.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-[10px] text-teal-deep/40 font-bold uppercase tracking-wider">Tip: Use Left / Right Keyboard Arrow Keys to flip pages</span>
      </div>

      {/* Interactive Collapsible Thumbnails Drawer */}
      <AnimatePresence>
        {showThumbnails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full max-w-5xl mt-6 border-t border-teal-deep/5 pt-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-teal-deep uppercase tracking-widest">Jump to page layout</span>
              <button 
                onClick={() => setShowThumbnails(false)} 
                className="text-[10px] font-bold text-rani-pink hover:underline"
              >
                Close
              </button>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-teal-deep scrollbar-track-background"
            >
              {catalogPages.map((page, idx) => {
                const isActive = currentPage === idx || currentPage + 1 === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => jumpToPageSet(idx)}
                    className={`flex-shrink-0 w-20 aspect-[1/1.4] rounded-lg overflow-hidden border-2 transition-all relative group ${
                      isActive 
                        ? "border-saffron shadow-md scale-95" 
                        : "border-teal-deep/5 hover:border-teal-deep/20"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={page.src} 
                      alt={`Thumb ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-1 right-1 bg-teal-deep/80 text-[8px] font-mono text-white px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-Resolution Zoom Lightbox overlay */}
      <AnimatePresence>
        {zoomedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedImage(null)}
              className="absolute inset-0 bg-teal-deep/90 backdrop-blur-md"
            />
            {/* Close button */}
            <button 
              onClick={() => setZoomedImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
              title="Close Zoom"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            {/* Zoom Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] z-10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={zoomedImage} 
                alt="Zoomed Catalogue Page" 
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
