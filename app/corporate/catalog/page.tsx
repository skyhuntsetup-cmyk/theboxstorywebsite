"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Download, Search, FileText, Smartphone, Coffee, Luggage, PenTool, Shirt, Gift, Loader
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import type { CorporateCatalogRow, CorporateCatalogCategory } from "../../../lib/types";

// Components can't be stored in the database, so the icon is derived from
// the (fixed, CHECK-constrained) category at render time instead.
const CATEGORY_ICONS: Record<CorporateCatalogCategory, React.ElementType> = {
  "Tech & Gadgets": Smartphone,
  "Drinkware & Coffee": Coffee,
  "Bags & Leather": Luggage,
  "Stationery & Office": PenTool,
  "Apparel & Clothing": Shirt,
  "Corporate Proposals": Gift,
};

function CatalogReaderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileParam = searchParams.get("file");

  const [catalogs, setCatalogs] = useState<CorporateCatalogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCatalog, setSelectedCatalog] = useState<CorporateCatalogRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from("corporate_catalogs")
          .select("*")
          .eq("is_active", true)
          .order("display_order");
        if (data) {
          setCatalogs(data);
          const initial = fileParam ? data.find((c) => c.file === fileParam) : undefined;
          setSelectedCatalog(initial || data[0] || null);
        }
      } catch (err) {
        console.error("Failed to load catalogs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // Only run once on mount — fileParam is only relevant for the initial selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (item: CorporateCatalogRow) => {
    setSelectedCatalog(item);
    router.replace(`/corporate/catalog?file=${item.file}`);
  };

  const filteredCatalogs = catalogs.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf4e7] text-teal-deep">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!selectedCatalog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf4e7] text-teal-deep space-y-3">
        <FileText className="w-10 h-10 text-teal-deep/30" />
        <p className="text-sm font-semibold">No catalogues published yet.</p>
      </div>
    );
  }

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
            <span>Download{selectedCatalog.size ? ` (${selectedCatalog.size})` : ""}</span>
          </a>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Left Side: Sidebar Selection List */}
        <aside className="hidden md:flex flex-col w-80 bg-white border-r border-teal-deep/5 overflow-y-auto shrink-0 text-left p-6 space-y-6">
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

          <div className="space-y-4 flex-1">
            <span className="text-[12px] font-black text-teal-deep/40 uppercase tracking-widest block">Available Catalogues</span>
            <div className="space-y-2">
              {filteredCatalogs.map((item) => {
                const isSelected = selectedCatalog.file === item.file;
                const IconComponent = CATEGORY_ICONS[item.category] || FileText;
                return (
                  <button
                    key={item.id}
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
                const match = catalogs.find(c => c.file === e.target.value);
                if (match) handleSelect(match);
              }}
              className="w-full bg-white border border-teal-deep/15 rounded-xl px-4 py-3 text-xs font-bold text-teal-deep shadow-sm focus:outline-none"
            >
              {catalogs.map((c) => (
                <option key={c.id} value={c.file}>
                  {c.title}{c.size ? ` (${c.size})` : ""}
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
