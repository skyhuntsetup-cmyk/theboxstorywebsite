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
    file: "The Box Story - Corporate Gifting Profile.pdf",
    title: "Corporate Gifting Profile",
    category: "Corporate Proposals",
    icon: Gift,
    description: "Overview of The Box Story corporate gifting solutions and client portfolio.",
    size: "23.8 MB"
  },
  {
    file: "1. TBS X XECH - Consumer Electronics.pdf.pdf",
    title: "XECH Consumer Electronics I",
    category: "Tech & Gadgets",
    icon: Smartphone,
    description: "Premium smart lifestyle products, wireless stands, and desk accessories.",
    size: "10.1 MB"
  },
  {
    file: "2. TBS X XECH - Consumer Electronics.pdf.pdf",
    title: "XECH Consumer Electronics II",
    category: "Tech & Gadgets",
    icon: Smartphone,
    description: "Advanced lifestyle electronics, humidifiers, and executive gear.",
    size: "273.8 MB"
  },
  {
    file: "3. TBS X TIMALFI - LAMPS.pdf.pdf",
    title: "TIMALFI Designer Lamps",
    category: "Tech & Gadgets",
    icon: Smartphone,
    description: "Aesthetic design lamps, ambient desk lights, and bedside fixtures.",
    size: "9.9 MB"
  },
  {
    file: "4. TBS X Noise - Consumer Electronics.pdf.pdf",
    title: "Noise Smart Electronics",
    category: "Tech & Gadgets",
    icon: Smartphone,
    description: "Noise smartwatches, fitness trackers, and bluetooth audio devices.",
    size: "9.1 MB"
  },
  {
    file: "5. TBS X Portronics.pdf",
    title: "Portronics Tech Accessories",
    category: "Tech & Gadgets",
    icon: Smartphone,
    description: "Portable bluetooth speakers, wireless power banks, and desk hubs.",
    size: "73.2 MB"
  },
  {
    file: "6. TBS X AQUAMINDER.pdf.pdf",
    title: "Aquaminder Smart Hydration",
    category: "Drinkware & Coffee",
    icon: Coffee,
    description: "Sensor-tracked smart hydration flasks and temperature display mugs.",
    size: "8.3 MB"
  },
  {
    file: "7. TBS X Everyday Organizers.pdf.pdf",
    title: "Everyday Organizers & Planners",
    category: "Stationery & Office",
    icon: PenTool,
    description: "Professional desk organizers, leather planner diaries, and folders.",
    size: "51.9 MB"
  },
  {
    file: "8. TBS X WACACO.pdf.pdf",
    title: "Wacaco Portable Coffee Gear",
    category: "Drinkware & Coffee",
    icon: Coffee,
    description: "Luxury portable espresso makers, Minipresso travel sets, and accessories.",
    size: "23.3 MB"
  },
  {
    file: "9. Non Branded - Solid Polos.pdf",
    title: "Solid Polo Collections",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Premium cotton solid color polos for corporate workspace apparel.",
    size: "11.2 MB"
  },
  {
    file: "10. Non Branded - T-Shirts Solids.pdf",
    title: "Solid T-Shirt Series",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Standard non-branded solid cotton t-shirts for brand printing.",
    size: "3.1 MB"
  },
  {
    file: "11. Non Branded - Striped Polos.pdf",
    title: "Striped Polo Selections",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Smart casual striped pique cotton polos for corporate events.",
    size: "33.3 MB"
  },
  {
    file: "12. Non Branded - Golfer Polos.pdf",
    title: "Golfer Polo Series",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Sporty pique cotton golfer polo shirts for executive outings.",
    size: "9.6 MB"
  },
  {
    file: "13. Pens & Keychains.pdf",
    title: "Writing Instruments & Keyrings",
    category: "Stationery & Office",
    icon: PenTool,
    description: "Engraved metal rollerball pens and customized leather keychains.",
    size: "19.3 MB"
  },
  {
    file: "14. Wallets.pdf",
    title: "Leather Wallets & Sleeves",
    category: "Bags & Leather",
    icon: Luggage,
    description: "RFID-protected genuine leather wallets and slim cardholder sleeves.",
    size: "147.5 MB"
  },
  {
    file: "15. Notebooks.pdf",
    title: "Notebooks & Custom Journals",
    category: "Stationery & Office",
    icon: PenTool,
    description: "Hard-bound custom notebooks with elastic band closures.",
    size: "78.6 MB"
  },
  {
    file: "16. Premium Office Bags.pdf",
    title: "Premium Office Bags",
    category: "Bags & Leather",
    icon: Luggage,
    description: "Genuine leather briefcases, messenger bags, and laptop sleeves.",
    size: "101.4 MB"
  },
  {
    file: "17. Employee Kits.pdf",
    title: "Employee Onboarding Kits",
    category: "Corporate Proposals",
    icon: Gift,
    description: "Bespoke corporate new hire welcome boxes and appreciation crates.",
    size: "89.7 MB"
  },
  {
    file: "18. Executive Bags.pdf",
    title: "Executive Bags & Trolleys",
    category: "Bags & Leather",
    icon: Luggage,
    description: "Nashermiles cabin luggage and high-end executive travel briefcases.",
    size: "89.6 MB"
  },
  {
    file: "19. Bags.pdf",
    title: "Standard Backpacks & Duffels",
    category: "Bags & Leather",
    icon: Luggage,
    description: "Ergonomic work backpacks, gym duffels, and travel messenger packs.",
    size: "61.9 MB"
  },
  {
    file: "20. TBS X Turtle - Branded Apparels.pdf",
    title: "Turtle Branded Apparels",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Branded premium cotton hoodies, jackets, and corporate polos.",
    size: "16.3 MB"
  },
  {
    file: "21. Premium T-Shirts - Non Branded.pdf",
    title: "Premium T-Shirts",
    category: "Apparel & Clothing",
    icon: Shirt,
    description: "Luxury ring-spun combed cotton t-shirts for premium branding.",
    size: "5.5 MB"
  },
  {
    file: "22. Corporate Gifts.pdf",
    title: "Corporate Gifts Catalog",
    category: "Corporate Proposals",
    icon: Gift,
    description: "General client token gifts, desktop accessories, and curated sets.",
    size: "20.3 MB"
  },
  {
    file: "23. Drinkware.pdf",
    title: "Drinkware & Coffee Tumblers",
    category: "Drinkware & Coffee",
    icon: Coffee,
    description: "Insulated water flasks, travel mugs, and steel tea infusers.",
    size: "11.3 MB"
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
            <p className="text-[11px] text-teal-deep/50 uppercase tracking-widest font-black flex items-center space-x-1">
              <span>View Brochures Live on Site</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hidden md:inline-block text-[12px] font-bold text-slate-400 uppercase tracking-widest">
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
            <span className="text-[12px] font-black text-teal-deep/40 uppercase tracking-widest block">Filter Collections</span>
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
            <span className="text-[12px] font-black text-teal-deep/40 uppercase tracking-widest block">Available Catalogues</span>
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
                      <span className={`text-[11px] block leading-relaxed truncate ${isSelected ? "text-white/70" : "text-teal-deep/50"}`}>
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
              src={`/catalogues/${selectedCatalog.file}#view=Fit&toolbar=0&navpanes=0`}
              className="w-full h-full border-0 bg-white"
              title={selectedCatalog.title}
              key={selectedCatalog.file} // Force reload of iframe when selection changes
            />
          </div>

          {/* Desktop/Tablet Footer Status */}
          <div className="hidden sm:flex justify-between items-center text-[12px] text-slate-400 mt-3 px-2 shrink-0">
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
