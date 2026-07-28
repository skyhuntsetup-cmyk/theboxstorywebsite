"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Sparkles, Gift, ArrowRight, X, ArrowLeft, BookOpen, 
  MapPin, Clock, Star, Calendar, CheckCircle2, ChevronRight, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function DiwaliCollection() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Bulk Gifting Form states inside detail modal
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "50-100",
    details: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const diwaliProducts = [
    {
      id: "diwali-1",
      name: "Swarna Kalash",
      price: 535,
      tagline: "A tray of prosperity that glows beyond Diwali.",
      detailPage: 5,
      photoPage: 6,
      inclusions: [
        "Ornamental brass tray with intricate jaali work",
        "Designer dry fruit jar with golden bird-top lid",
        "250gm Premium Dry Fruits (Almonds, Cashews, Raisins, or Mixed Nuts)",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "250gm of Chocodips", price: 535 },
        { name: "250gm of Raisins", price: 535 },
        { name: "250gm of Seeds, Nuts & Berries Mix", price: 560 },
        { name: "250gm of Cashew", price: 635 },
        { name: "250gm of Almond", price: 660 },
        { name: "250gm of Hazelnuts", price: 735 }
      ]
    },
    {
      id: "diwali-2",
      name: "Yugam",
      price: 680,
      tagline: "Two jars, one thoughtful gesture.",
      detailPage: 8,
      photoPage: 9,
      inclusions: [
        "Reusable MDF Decorative Box with golden handle",
        "2 Premium Jars of 200gm Dry Fruits each",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "200gm Seeds Nuts & Berries + 200gm Raisins", price: 680 },
        { name: "200gm Almonds + 200gm Cashew", price: 850 }
      ]
    },
    {
      id: "diwali-3",
      name: "Patra Shobha",
      price: 760,
      tagline: "Gift wrapped in nature's grace.",
      detailPage: 10,
      photoPage: 11,
      inclusions: [
        "Reusable MDF Decorative Box with golden handle & gold foiled detailing",
        "2 Premium Jars of 200gm Dry Fruits",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "200gm Almonds + 200gm Raisins", price: 760 },
        { name: "200gm Almonds + 200gm Cashew", price: 850 }
      ]
    },
    {
      id: "diwali-4",
      name: "Swarna Jugalbandi",
      price: 830,
      tagline: "A golden pairing of elegance and taste.",
      detailPage: 12,
      photoPage: 13,
      inclusions: [
        "Reusable Brass-finish Serving Tray with intricate cutwork design",
        "2 Premium Ceramic Jars with Golden Floral Lids",
        "2 X 200gm Assorted Dry Fruits",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "200gm each of Chocodips + Seeds Nuts & Berries Mix", price: 860 },
        { name: "200gm each of Cashews + Almonds", price: 1030 },
        { name: "200gm each of Pistachios + Hazelnut Choco-dips", price: 1180 }
      ]
    },
    {
      id: "diwali-5",
      name: "Rajsi",
      price: 960,
      tagline: "Minimal. Elegant. Royal.",
      detailPage: 15,
      photoPage: 16,
      inclusions: [
        "Reusable Luxurious textured leatherette box with metallic clasp closure",
        "2 Premium Jars of 200gm Dry Fruits each",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "200gm Almonds + 200gm Cashew", price: 960 },
        { name: "200gm Chocodips Hazelnuts + 200gm Panchrattan Dry Fruit Mix", price: 1040 }
      ]
    },
    {
      id: "diwali-6",
      name: "Rajwada",
      price: 900,
      tagline: "A royal ensemble of taste and tradition.",
      detailPage: 33,
      photoPage: 34,
      inclusions: [
        "Diwali themed Premium Paper reusable hamper box",
        "2 Crunchy Chocolate Brittle Packs",
        "2 X 100gm Dry Fruit Jars in luxurious Potli",
        "Laxmi Ganesh Moorti in potli for auspicious beginnings",
        "Eat Better - Millet Snacks Pack",
        "Brass Urli",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "Standard Set", price: 900 }
      ]
    },
    {
      id: "diwali-7",
      name: "Gau Sanidhya",
      price: 1100,
      tagline: "Sacred blessings wrapped in elegance.",
      detailPage: 17,
      photoPage: 18,
      inclusions: [
        "Golden finish tray with intricate cutwork, elegant for serving",
        "Pichwai Print Jar",
        "1 X 200gm Dry Fruit Jar (Almonds/Cashew/Seeds Mix)",
        "Incense Cone Box",
        "2 X Brass Diya",
        "Festive Potli wrap and Shredded Paper Base",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1100 }
      ]
    },
    {
      id: "diwali-8",
      name: "Annapurna",
      price: 1165,
      tagline: "A wholesome gift of taste, health, and festivity.",
      detailPage: 37,
      photoPage: 38,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "50gm Daily Nut Co.'s Almond Box in luxurious Potli",
        "Cracker-themed chocolate box (10 chocolates)",
        "Floranile Dhoop Cone Box",
        "Shubh Labh Hanging",
        "Eat Better Millet Snack",
        "Lotus Akhand Jyot Diya (3inch)",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1165 }
      ]
    },
    {
      id: "diwali-9",
      name: "Trishakti Uphaar",
      price: 1185,
      tagline: "A sacred blend of taste, tradition, and spirituality.",
      detailPage: 40,
      photoPage: 41,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 Crunchy Chocolate Brittle Packs",
        "50gm Daily Nut Co.'s Almond Box in luxurious Potli",
        "Honey Twigs Pack – Natural Honey",
        "HUG Dhoop Cone Box",
        "Shiva Trishul Idol – symbol of strength and blessings",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1185 }
      ]
    },
    {
      id: "diwali-10",
      name: "Shubh Deep",
      price: 1355,
      tagline: "A festive box that brings together light, tradition, and taste.",
      detailPage: 49,
      photoPage: 50,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 X 100gm Dry Fruit Jars in luxurious Potli",
        "OM Sweets Dhoda Box",
        "OM Sweets Chana Burfi Box",
        "Shubh Labh Pair",
        "HUG Dhoop Cone Box",
        "2 X Ladoo Candles",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1355 }
      ]
    },
    {
      id: "diwali-11",
      name: "Shri Ram Uphaar",
      price: 1430,
      tagline: "A divine gift box that carries blessings of Lord Ram.",
      detailPage: 51,
      photoPage: 52,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "शुभ लाभ (Shubh Labh) Pair",
        "Ram Lalla Moorti – A divine idol bringing blessings",
        "Cracker-themed chocolate box (10 chocolates)",
        "Urli Candle",
        "Floranile Dhoop Cone Box",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1430 }
      ]
    },
    {
      id: "diwali-12",
      name: "Hiranyam",
      price: 1530,
      tagline: "Where sweetness meets light this Diwali.",
      detailPage: 54,
      photoPage: 55,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 Crunchy Chocolate Brittle Packs",
        "Honey Twigs Pack – Cinnamon",
        "HUG Agarbatti Box",
        "Lotus Akhand Jyot Diya",
        "1 X 200gm Almond Jar in luxurious Potli",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1530 }
      ]
    },
    {
      id: "diwali-13",
      name: "Hawa Mahal",
      price: 1565,
      tagline: "A royal blend of devotion, sweetness, and light.",
      detailPage: 57,
      photoPage: 58,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 X 100gm Dry Fruit Jars in luxurious Potli",
        "HUG Agarbatti Box",
        "OM Sweets Dhoda Box",
        "OM Sweets Chana Burfi Box",
        "Shubh Labh Hanging Pair",
        "Brass Lotus Akhand Jyot (6 inch)",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1565 }
      ]
    },
    {
      id: "diwali-14",
      name: "Sampoorna Shubh",
      price: 1670,
      tagline: "A festive blend of taste, tradition, and tranquility.",
      detailPage: 59,
      photoPage: 60,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 X Eat Better Dry Fruit Packs (Almonds & Cashew)",
        "Premium Green Tea",
        "2 Dhoop Cone Boxes",
        "Shubh Labh Pair",
        "Cracker-themed chocolate box (10 chocolates)",
        "Urli Candle",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1670 }
      ]
    },
    {
      id: "diwali-15",
      name: "Gyaan Deep",
      price: 1670,
      tagline: "Illuminate hearts with wisdom, sweetness, and light.",
      detailPage: 62,
      photoPage: 63,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "Geeta Saar – A spiritual touch for mindful living",
        "Eat Better - Ladoo Pack",
        "Rosier Natural Honey Jar",
        "Fairy Lights wrapped in festive potli",
        "HUG Agarbatti Box",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1670 }
      ]
    },
    {
      id: "diwali-16",
      name: "Anand Kalash",
      price: 1930,
      tagline: "A complete festive gift of sweetness, light, and tradition.",
      detailPage: 66,
      photoPage: 67,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 X 50gm Daily Nut Co.’s Dry Fruit Boxes",
        "Fairy Lights in luxurious Potli",
        "Honey Twigs Pack – Natural Honey",
        "Cracker-themed chocolate box (10 chocolates)",
        "Shubh Labh Hanging",
        "Water Bottle",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1930 }
      ]
    },
    {
      id: "diwali-17",
      name: "Lakshmi",
      price: 2000,
      tagline: "Invoke blessings of wealth, health, and happiness.",
      detailPage: 70,
      photoPage: 71,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "Gold Plated Lakshmi Ji Charan Paduka Box",
        "Charles & Robert Green Tea",
        "HUG Incense Stick Box",
        "Handcrafted Terracotta Diyas",
        "Jar of Seeds, Nuts & Berries Trail in traditional potli",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 2000 }
      ]
    },
    {
      id: "diwali-18",
      name: "Sunehri Jhalak",
      price: 2250,
      tagline: "A golden glow of festivities in every bite.",
      detailPage: 72,
      photoPage: 73,
      inclusions: [
        "Golden wired basket, reusable for decor",
        "Fairy Lights in festive potlis",
        "2 X 200gm Dry Fruit Jars in luxurious Potli",
        "Cookie box & Honey Twigs Pack",
        "HUG Agarbatti box & Moroccan lamp",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 2250 }
      ]
    },
    {
      id: "diwali-19",
      name: "Aaradhana Peti",
      price: 2500,
      tagline: "A divine hamper to celebrate light, taste, and tradition.",
      detailPage: 75,
      photoPage: 76,
      inclusions: [
        "Premium Pine-wood reusable hamper box",
        "3 X 100gms Premium Dry Fruit Jars in festive potlis",
        "10pcs Assorted handcrafted chocolates in festive potli",
        "Laxmi–Ganesh / Ram Lala Moorti in festive potli",
        "C & R Green Tea & Lotus Akhand Jyot Diya",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 2500 }
      ]
    }
  ];

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          details: `Diwali Box Request: "${selectedProduct?.name}" - ` + formData.details
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsSubmitted(true);
        confetti({
          particleCount: 50,
          spread: 40,
          colors: ["#B45309", "#9D174D", "#E2BA5F"],
        });
      } else {
        alert("Failed to submit inquiry: " + (data.error || "Please try again."));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Can we add custom laser-engraved corporate branding on these Diwali boxes?",
      a: "Yes! For all orders above 30 units, we offer custom gold foil logo stamping, engraved wooden lid plates, and matching branded satin ribbons."
    },
    {
      q: "What is the average shipping timeframe for Diwali bulk orders?",
      a: "Standard bulk processing takes 5-7 business days. Courier dispatch across tier-1 cities in India delivers in 2-4 days. We recommend booking early for the rush Diwali week."
    },
    {
      q: "Are the dry fruits and ceramic jars premium quality?",
      a: "Yes. All dry fruits are vacuum-sealed Grade A quality. Jars are double-glazed ceramic hand-painted by local Rajasthani artisans."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf4e7] py-16 px-6 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Banner Section */}
        <section className="relative rounded-[40px] overflow-hidden bg-white border border-teal-deep/5 p-8 md:p-16 shadow-lg text-left">
          <div className="absolute top-0 right-0 w-72 h-72 bg-saffron/5 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-2xl space-y-6">
            <span className="text-[10px] tracking-widest font-black uppercase text-saffron bg-saffron/10 px-3.5 py-1.5 rounded-full inline-block border border-saffron/20">
              Seasonal Releases 2026
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-teal-deep leading-tight">
              The Diwali <br />
              <span className="text-rani-pink font-serif italic font-normal">Celebration Catalog</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">
              Explore our new releases. Click any catalog product card below to view its exact details page, inclusions list, variants, and product photos extracted directly from our 2025 Diwali Brochure.
            </p>
            <div className="pt-2">
              <Link
                href="/corporate/catalog"
                className="inline-flex items-center space-x-2 bg-teal-deep hover:bg-teal-deep/95 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Digital Lookbook</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-black text-teal-deep text-left border-b border-teal-deep/5 pb-2">Diwali Box Catalogue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {diwaliProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setIsSubmitted(false);
                  setFormData({ name: "", email: "", phone: "", company: "", quantity: "50-100", details: "" });
                }}
                className="group bg-white border border-teal-deep/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-[450px]"
              >
                {/* Photo Page thumbnail */}
                <div className="relative h-60 bg-teal-deep/5 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`/images/diwali-catalog/page_${p.photoPage}.png`} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-teal-deep/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/95 text-teal-deep font-bold text-xs px-4 py-2 rounded-full shadow-md flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View Specifications</span>
                    </span>
                  </div>
                </div>

                {/* Details info */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-saffron uppercase tracking-widest">Starts at</span>
                    <div className="flex justify-between items-center">
                      <h3 className="font-heading text-lg font-black text-teal-deep group-hover:text-rani-pink transition-colors">
                        {p.name}
                      </h3>
                      <span className="font-heading font-black text-teal-deep">₹{p.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic font-light line-clamp-2">
                      {p.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-teal-deep/5 mt-auto">
                    <span className="text-[9px] font-bold text-teal-deep/40 uppercase">Catalogue Page {p.detailPage}</span>
                    <ChevronRight className="w-4 h-4 text-teal-deep/40 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Catalog Modal Overlay */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute inset-0 bg-teal-deep/80 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="bg-[#faf4e7] border border-teal-deep/15 w-full max-w-5xl rounded-[36px] overflow-hidden shadow-2xl relative z-10 grid grid-cols-1 lg:grid-cols-12 max-h-[92vh]"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-teal-deep rounded-full transition-colors z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left Side: Double-Spread Pages from Catalog PDF */}
                <div className="lg:col-span-7 bg-[#FCFAF2] p-6 sm:p-8 flex flex-col justify-between border-r border-teal-deep/10 overflow-y-auto max-h-[92vh]">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-saffron uppercase tracking-widest block">Original Catalogue Pages</span>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Details Page (Left) */}
                      <div className="border border-teal-deep/15 rounded-2xl overflow-hidden shadow-sm aspect-[1/1.4] bg-white relative group cursor-zoom-in">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`/images/diwali-catalog/page_${selectedProduct.detailPage}.png`} 
                          alt="Inclusions Page"
                          className="w-full h-full object-contain"
                          onClick={() => window.open(`/images/diwali-catalog/page_${selectedProduct.detailPage}.png`)}
                        />
                        <span className="absolute bottom-2 left-3 text-[8px] font-mono text-teal-deep/40 bg-white/80 px-2 py-0.5 rounded">Page {selectedProduct.detailPage} (Details)</span>
                      </div>
                      
                      {/* Photo Page (Right) */}
                      <div className="border border-teal-deep/15 rounded-2xl overflow-hidden shadow-sm aspect-[1/1.4] bg-white relative group cursor-zoom-in">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`/images/diwali-catalog/page_${selectedProduct.photoPage}.png`} 
                          alt="Photo Page"
                          className="w-full h-full object-contain"
                          onClick={() => window.open(`/images/diwali-catalog/page_${selectedProduct.photoPage}.png`)}
                        />
                        <span className="absolute bottom-2 left-3 text-[8px] font-mono text-teal-deep/40 bg-white/80 px-2 py-0.5 rounded">Page {selectedProduct.photoPage} (Photos)</span>
                      </div>
                    </div>
                  </div>

                  {/* Text Description / Inclusions fallback */}
                  <div className="space-y-4 text-left pt-6 mt-6 border-t border-teal-deep/5">
                    <h3 className="font-heading text-lg font-black text-teal-deep">Inclusions list:</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProduct.inclusions.map((inc: string, i: number) => (
                        <li key={i} className="flex items-start space-x-1.5 text-xs text-teal-deep/75 font-medium">
                          <span className="w-1.5 h-1.5 bg-saffron rounded-full mt-1.5 flex-shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Side: Price Variants, Details and Gifting Form */}
                <div className="lg:col-span-5 p-6 sm:p-10 overflow-y-auto max-h-[92vh] flex flex-col justify-between text-left">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-rani-pink uppercase tracking-widest">Premium Hamper</span>
                      <h2 className="font-heading text-3xl font-black text-teal-deep leading-none">{selectedProduct.name}</h2>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">{selectedProduct.tagline}</p>
                    </div>

                    {/* Pricing Inclusions & Variants list */}
                    <div className="space-y-3 bg-[#FCFAF2]/60 border border-teal-deep/5 p-5 rounded-2xl">
                      <span className="text-[9px] font-black text-teal-deep/55 uppercase tracking-widest block">Available Tiers & Variants</span>
                      <div className="space-y-2">
                        {selectedProduct.variants.map((v: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs border-b border-teal-deep/5 pb-1.5 last:border-b-0 last:pb-0">
                            <span className="font-bold text-teal-deep/80">{v.name}</span>
                            <span className="font-heading font-black text-saffron">₹{v.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Inquiry Form */}
                    <div className="border-t border-teal-deep/5 pt-6 space-y-4">
                      <span className="text-[10px] font-black text-saffron uppercase tracking-widest block">Quick Bulk Inquiry</span>
                      
                      <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                          <form onSubmit={handleInquirySubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="text"
                                required
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
                              />
                              <input 
                                type="text"
                                required
                                placeholder="Company / Family"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="email"
                                required
                                placeholder="Work Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
                              />
                              <input 
                                type="tel"
                                required
                                placeholder="Phone (WhatsApp)"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3 items-center">
                              <label className="text-[10px] font-bold text-teal-deep/60">Estimated Qty:</label>
                              <select 
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-2 py-1.5 text-xs focus:outline-none text-teal-deep"
                              >
                                <option value="30-50">30 to 50 boxes</option>
                                <option value="50-100">50 to 100 boxes</option>
                                <option value="100-300">100 to 300 boxes</option>
                                <option value="300+">300+ boxes</option>
                              </select>
                            </div>
                            <textarea 
                              rows={2}
                              placeholder="Any custom instructions or modifications..."
                              value={formData.details}
                              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                              className="w-full bg-white border border-teal-deep/15 rounded-2xl px-3 py-2 text-xs focus:outline-none resize-none"
                            />
                            <button 
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3 bg-teal-deep hover:bg-teal-deep/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow"
                            >
                              {isSubmitting ? "Logging Inquiry..." : "Log Diwali Box Inquiry"}
                            </button>
                          </form>
                        ) : (
                          <div className="text-center py-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                            <span className="font-bold text-xs text-emerald-800 block">Inquiry Submitted!</span>
                            <span className="text-[10px] text-emerald-700 leading-relaxed block max-w-xs mx-auto px-4">
                              We have registered your request for "{selectedProduct.name}". Our Diwali consultant will WhatsApp you shortly!
                            </span>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-teal-deep/5 flex justify-between items-center text-[10px] text-teal-deep/45">
                    <span>GST & Shipping extra</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedProduct(null)} 
                      className="text-rani-pink font-bold hover:underline"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* FAQs accordion */}
        <section className="max-w-4xl mx-auto space-y-8 text-left pt-12 border-t border-teal-deep/5">
          <h2 className="font-heading text-2xl md:text-3xl font-black text-teal-deep text-center">Diwali Gifting Queries</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isFaqActive = activeFaq === idx;
              return (
                <div key={idx} className="bg-white border border-teal-deep/5 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setActiveFaq(isFaqActive ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-teal-deep focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-teal-deep/30 transition-transform duration-300 ${isFaqActive ? "transform rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isFaqActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-teal-deep/5 bg-[#FCFAF2]/50 p-5 text-xs text-slate-600 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
