"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Sparkles, Download, Search,
  ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import catalogConfig from "../../../data/catalog-config.json";

export default function CleanCatalogReader() {
  const [activePage, setActivePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const totalPages = catalogConfig.totalPages;
  const sections = catalogConfig.sections;

  // Track page in viewport to update active page highlight in sidebar
  useEffect(() => {
    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: "-20% 0px -60% 0px", // Trigger when page occupies main view area
      threshold: 0.1
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNum = parseInt(entry.target.getAttribute("data-page") || "1");
          setActivePage(pageNum);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all page elements
    Object.values(pageRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToPage = (pageNum: number) => {
    const targetElement = pageRefs.current[pageNum];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setActivePage(pageNum);
    }
  };

  // Keyboard navigation for jumping pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoomedImage) {
        if (e.key === "Escape") setZoomedImage(null);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const next = Math.min(activePage + 1, totalPages);
        scrollToPage(next);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const prev = Math.max(activePage - 1, 1);
        scrollToPage(prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePage, zoomedImage, totalPages]);

  // Filtered sections based on query
  const filteredSections = sections.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sec.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#faf4e7] text-slate-800 flex flex-col h-[calc(100vh-96px)] overflow-hidden">
      
      {/* Top Bar Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-teal-deep/5 px-6 py-4 mt-6 flex items-center justify-between z-10 shrink-0 shadow-sm animate-fade-in">
        <div className="flex items-center space-x-4">
          <Link 
            href="/corporate"
            className="p-2 bg-[#FCFAF2] hover:bg-teal-deep/5 border border-teal-deep/15 text-teal-deep rounded-full transition-all flex items-center justify-center shadow-sm"
            title="Back to Corporate Gifting"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-base sm:text-lg font-black text-teal-deep">Lifestyle Catalog Reader</h1>
            <p className="text-[9px] text-teal-deep/50 uppercase tracking-widest font-black flex items-center space-x-1">
              <span>Clean Vertical Navigation</span>
              <Sparkles className="w-2.5 h-2.5 text-saffron" />
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs font-mono font-bold text-teal-deep bg-teal-deep/5 px-3 py-1.5 rounded-full border border-teal-deep/5">
            Page {activePage} of {totalPages}
          </span>
          <button 
            onClick={() => alert("Downloading PDF catalog...")}
            className="flex items-center space-x-1.5 bg-teal-deep hover:bg-teal-deep/95 text-white px-4 py-2 rounded-xl font-bold text-xs shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </header>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Index & Search Sidebar */}
        <aside className="hidden md:flex flex-col w-80 bg-white border-r border-teal-deep/5 overflow-y-auto shrink-0 text-left p-6 space-y-6">
          
          {/* Index Search Bar */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-teal-deep/40 uppercase tracking-widest block">Search Catalog</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-teal-deep/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Find section..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FCFAF2] border border-teal-deep/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-teal-deep/30 text-teal-deep"
              />
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-4 flex-1">
            <span className="text-[10px] font-black text-teal-deep/40 uppercase tracking-widest block">Sections & Index</span>
            <div className="space-y-1">
              {filteredSections.map((sec, idx) => {
                const isCurrentSec = activePage >= sec.startPage && activePage <= sec.endPage;
                return (
                  <button
                    key={idx}
                    onClick={() => scrollToPage(sec.startPage)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex justify-between items-start space-x-2 ${
                      isCurrentSec 
                        ? "bg-teal-deep text-white border-teal-deep shadow-md font-bold" 
                        : "bg-[#FCFAF2]/40 hover:bg-[#FCFAF2] border-teal-deep/5 text-teal-deep hover:text-rani-pink"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs block font-bold leading-tight">{sec.title}</span>
                      <span className={`text-[9px] block leading-relaxed ${isCurrentSec ? "text-white/70" : "text-teal-deep/50"}`}>
                        {sec.description}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold shrink-0 ${isCurrentSec ? "text-white" : "text-saffron"}`}>
                      P.{sec.startPage}
                    </span>
                  </button>
                );
              })}
              {filteredSections.length === 0 && (
                <div className="text-center py-8 text-teal-deep/40 text-xs font-medium">
                  No sections match query.
                </div>
              )}
            </div>
          </div>

          {/* Gifting Shortcut */}
          <div className="bg-[#faf4e7] border border-teal-deep/5 p-4 rounded-2xl text-left space-y-2">
            <span className="text-[9px] font-bold text-rani-pink uppercase tracking-widest block">Need Assistance?</span>
            <p className="text-[10px] text-teal-deep/75 leading-relaxed">
              Book a free consultation with our Jaipur catalog designers.
            </p>
            <Link 
              href="/contact"
              className="text-[9px] font-black text-teal-deep hover:underline uppercase tracking-wider flex items-center space-x-1"
            >
              <span>Talk to curator</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </aside>

        {/* Right/Center Column: Pure Vertical Stack Scroll Pane */}
        <main 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 py-8 md:px-12 flex flex-col items-center space-y-8 scroll-smooth"
        >
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <div
                key={pageNum}
                ref={(el) => { pageRefs.current[pageNum] = el; }}
                data-page={pageNum}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-300 max-w-2xl w-full shadow-sm ${
                  activePage === pageNum ? "border-saffron shadow-md scale-[1.01]" : "border-teal-deep/5"
                }`}
              >
                {/* Image Page block */}
                <div 
                  onClick={() => setZoomedImage(`/images/catalog/page_${pageNum}.png`)}
                  className="w-full aspect-[1/1.4] bg-[#faf4e7] relative cursor-zoom-in group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`/images/catalog/page_${pageNum}.png`} 
                    alt={`Catalog Page ${pageNum}`} 
                    loading="lazy"
                    className="w-full h-full object-contain block"
                  />
                  <div className="absolute inset-0 bg-teal-deep/0 group-hover:bg-teal-deep/5 transition-colors" />
                  
                  {/* Floating Page Badge */}
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-teal-deep/50 bg-[#FCFAF2]/80 backdrop-blur-sm border border-teal-deep/5 px-3 py-1 rounded-full shadow-sm">
                    Page {pageNum}
                  </span>

                  {/* Zoom hint icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-teal-deep/75 backdrop-blur-sm p-2 rounded-xl text-white shadow">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </main>
      </div>

      {/* High-Resolution Zoom Lightbox Overlay */}
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
            
            {/* Control Bar */}
            <div className="absolute top-6 right-6 flex items-center space-x-2 z-20">
              <button 
                onClick={() => setZoomScale(prev => Math.max(prev - 0.25, 0.75))}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setZoomScale(prev => Math.min(prev + 0.25, 2))}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { setZoomedImage(null); setZoomScale(1); }}
                className="p-2 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors ml-2"
                title="Close Zoom"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Image container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] z-10 overflow-auto"
            >
              <motion.div
                animate={{ scale: zoomScale }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={zoomedImage} 
                  alt="Zoomed Catalog Page" 
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl bg-white"
                />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
