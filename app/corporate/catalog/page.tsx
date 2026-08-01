"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Download, Search, ChevronRight, FileText, Smartphone, Coffee, Luggage, PenTool, Shirt, Gift 
} from "lucide-react";

interface CatalogItem {
  file: string;
  title: string;
  category: "Tech & Gadgets" | "Drinkware & Coffee" | "Bags & Leather" | "Stationery & Office" | "Apparel & Clothing" | "Corporate Proposals";
  icon: any;
  description: string;
  size: string;
}

const catalogsList: CatalogItem[] = [
  {
    file: "1.Portronics_PPT_July.pdf",
    title: "Portronics Tech Accessories",
    category: "Tech & Gadgets",
    icon: Smartphone,
    description: "Wireless chargers, portable speakers, and smart B2B gadgets.",
    size: "24.3 MB"
  },
  {
    file: "NOISE ELECTRONICS.pdf",
    title: "Noise Smart Electronics",
    category: "Tech & Gadgets",
    icon: Smartphone,
    description: "Smartwatches, fitness bands, and premium audio accessories.",
    size: "8.3 MB"
  },
  {
    file: "13.Wacaco Presentation 2023.pdf",
    title: "Wacaco Portable Coffee Gear",
    category: "Drinkware & Coffee",
    icon: Coffee,
    description: "Luxury portable espresso makers and travel brewer sets.",
    size: "8.8 MB"
  },
  {
    file: "7.Aquaminder July 2026.pdf",
    title: "Aquaminder Smart Hydration",
    category: "Drinkware & Coffee",
    icon: Coffee,
    description: "Sensor-tracked smart flasks and temperature-display drinkware.",
    size: "4.8 MB"
  },
  {
    file: "MEYVIN CATALOGUE 2025-26.pdf",
    title: "Meyvin Premium Flasks & Drinkware",
    category: "Drinkware & Coffee",
    icon: Coffee,
    description: "Vacuum-insulated thermal bottles and matching coasters sets.",
    size: "66.1 MB"
  },
  {
    file: "DRINKWARE.pdf",
    title: "Premium Drinkware & Tumblers",
    category: "Drinkware & Coffee",
    icon: Coffee,
    description: "Double-walled travel mugs and thermal sports bottles.",
    size: "21.6 MB"
  },
  {
    file: "BAG CATALOGUE 2025-26.pdf",
    title: "Bags & Executive Backpacks",
    category: "Bags & Leather",
    icon: Luggage,
    description: "Premium laptop sleeves, leather bags, and business packs.",
    size: "32.7 MB"
  },
  {
    file: "EXECUTIVE BAG CATALOGUE 2025-26.pdf",
    title: "Executive Bags & Travel Packs",
    category: "Bags & Leather",
    icon: Luggage,
    description: "High-end corporate luggage sets and travel backpacks.",
    size: "36.7 MB"
  },
  {
    file: "WALLET CATALOGUE 2025-26.pdf",
    title: "Wallets & Leather Accessories",
    category: "Bags & Leather",
    icon: Luggage,
    description: "RFID-protected bifold wallets and travel passport folders.",
    size: "27.7 MB"
  },
  {
    file: "NOTEBOOK CATALOGUE 2025-26.pdf",
    title: "Notebooks & Planners",
    category: "Stationery & Office",
    icon: PenTool,
    description: "Genuine leather diaries, custom planners, and notebooks.",
    size: "45.1 MB"
  },
  {
    file: "PEN & KEYCHAIN CATALOGUE 2025-26.pdf",
    title: "Writing Instruments & Keys",
    category: "Stationery & Office",
    icon: PenTool,
    description: "Engraved metal rollerballs and custom leather keychains.",
    size: "21.4 MB"
  },
  {
    file: "CORPORATE GIFTS.pdf",
    title: "Corporate Gift Proposals",
    category: "Corporate Proposals",
    icon: Gift,
    description: "Pre-curated corporate gift sets and onboarding boxes.",
    size: "25.1 MB"
  },
  {
    file: "Flynn Premium Tee Catalogue-1.pdf",
    title: "Flynn Premium Tees",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Premium cotton Flynn tee collections for branding.",
    size: "2.0 MB"
  },
  {
    file: "golfer premium polo.pdf",
    title: "Golfer Premium Polos",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Custom logo polo shirts for corporate workspace wear.",
    size: "9.4 MB"
  },
  {
    file: "solid polo.pdf",
    title: "Solid Polo Collections",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Classic solid color polos for workspace apparel.",
    size: "2.5 MB"
  },
  {
    file: "green polo.pdf",
    title: "Green Polo Series",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Eco-friendly green series corporate polos.",
    size: "15.1 MB"
  }
];

function CatalogReaderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileParam = searchParams.get("file");

  const [selectedCatalog, setSelectedCatalog] = useState<CatalogItem>(catalogsList[0]);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle URL param selection
  useEffect(() => {
    if (fileParam) {
      const match = catalogsList.find(c => c.file === fileParam);
      if (match) {
        setSelectedCatalog(match);
      }
    }
  }, [fileParam]);

  const handleSelect = (item: CatalogItem) => {
    setSelectedCatalog(item);
    // Update URL query param quietly
    router.replace(`/corporate/catalog?file=${item.file}`);
  };

  const filteredCatalogs = catalogsList.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#faf4e7] text-slate-800 flex flex-col h-[calc(100vh-96px)] overflow-hidden">
      
      {/* Top Bar Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-teal-deep/5 px-6 py-4 mt-6 flex items-center justify-between z-10 shrink-0 shadow-sm animate-fade-in">
        <div className="flex items-center space-x-4">
          <Link 
            href="/corporate"
            className="p-2 bg-[#FCFAF2] hover:bg-teal-deep/5 border border-teal-deep/15 text-teal-deep rounded-full transition-all flex items-center justify-center shadow-sm"
            title="Back to Corporate"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="text-left">
            <h1 className="font-heading text-base sm:text-lg font-black text-teal-deep">Digital Catalog Showcase</h1>
            <p className="text-[9px] text-teal-deep/50 uppercase tracking-widest font-black flex items-center space-x-1">
              <span>View Brochures Live on Site</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hidden md:inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Active: {selectedCatalog.category}
          </span>
          <a 
            href={`/catalogues/${selectedCatalog.file}`}
            download
            className="flex items-center space-x-1.5 bg-teal-deep hover:bg-teal-deep/95 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ({selectedCatalog.size})</span>
          </a>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Sidebar Selection List */}
        <aside className="hidden md:flex flex-col w-80 bg-white border-r border-teal-deep/5 overflow-y-auto shrink-0 text-left p-6 space-y-6">
          {/* Sidebar Search */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-teal-deep/40 uppercase tracking-widest block">Filter Collections</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-teal-deep/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search catalogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FCFAF2] border border-teal-deep/10 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-teal-deep/35 text-teal-deep text-left"
              />
            </div>
          </div>

          {/* Catalog Selection List */}
          <div className="space-y-4 flex-1">
            <span className="text-[10px] font-black text-teal-deep/40 uppercase tracking-widest block">Available Catalogues</span>
            <div className="space-y-2">
              {filteredCatalogs.map((item, idx) => {
                const isSelected = selectedCatalog.file === item.file;
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start space-x-3 ${
                      isSelected 
                        ? "bg-teal-deep text-white border-teal-deep shadow-md font-bold" 
                        : "bg-[#FCFAF2]/40 hover:bg-[#FCFAF2] border-teal-deep/5 text-teal-deep"
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-white/10 text-white" : "bg-teal-deep/5 text-teal-deep"}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs block font-bold leading-snug truncate">{item.title}</span>
                      <span className={`text-[9px] block leading-relaxed truncate ${isSelected ? "text-white/70" : "text-teal-deep/50"}`}>
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
              {filteredCatalogs.length === 0 && (
                <div className="text-center py-8 text-teal-deep/40 text-xs font-medium">
                  No brochures match query.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Panel: Full Screen Embedded PDF iframe */}
        <main className="flex-1 bg-slate-100/50 p-6 flex flex-col overflow-hidden relative">
          
          {/* Mobile Selector Dropdown */}
          <div className="md:hidden w-full mb-4">
            <select
              value={selectedCatalog.file}
              onChange={(e) => {
                const match = catalogsList.find(c => c.file === e.target.value);
                if (match) handleSelect(match);
              }}
              className="w-full bg-white border border-teal-deep/15 rounded-xl px-4 py-3 text-xs font-bold text-teal-deep shadow-sm focus:outline-none"
            >
              {catalogsList.map((c) => (
                <option key={c.file} value={c.file}>
                  {c.title} ({c.size})
                </option>
              ))}
            </select>
          </div>

          {/* Embedded PDF iframe */}
          <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden relative">
            <iframe
              src={`/catalogues/${selectedCatalog.file}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0 bg-white"
              title={selectedCatalog.title}
              key={selectedCatalog.file} // Force reload of iframe when selection changes
            />
          </div>

          {/* Desktop/Tablet Footer Status */}
          <div className="hidden sm:flex justify-between items-center text-[10px] text-slate-400 mt-3 px-2 shrink-0">
            <span>You are viewing: <strong>{selectedCatalog.title}</strong></span>
            <span>Pre-curated collections are updated seasonal.</span>
          </div>
        </main>
      </div>

    </div>
  );
}

export default function CleanCatalogReader() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#faf4e7] text-teal-deep font-bold">
        Loading Catalog Showcase...
      </div>
    }>
      <CatalogReaderContent />
    </Suspense>
  );
}
