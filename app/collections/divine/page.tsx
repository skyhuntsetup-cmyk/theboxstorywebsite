"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, ArrowLeft, ArrowRight, X, CheckCircle2, 
  ChevronRight, Award, Heart, ShieldCheck, Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface ProductVariant {
  name: string;
  price: number;
}

interface DivineProduct {
  id: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  image: string;
  inclusions: string[];
  variants: ProductVariant[];
}

export default function DivineCollection() {
  const [selectedProduct, setSelectedProduct] = useState<DivineProduct | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
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

  const divineProducts: DivineProduct[] = [
    {
      id: "divine-1",
      name: "Dhyana Ganesha Idol",
      price: 1450,
      tagline: "A serene depiction of Ganesha in deep meditative poise.",
      description: "Handcrafted from premium resin and marble dust, the Dhyana Ganesha represents spiritual focus, intellect, and the removal of obstacles. Its smooth white marble-like finish and soft gold highlight accents fit perfectly on modern study desks, offices, and home altars.",
      image: "/images/divine/moorti_4.png",
      inclusions: [
        "1 Meditative Ganesha marble-resin idol",
        "Gold foiled velvet-lined presentation case",
        "Handcrafted terracotta incense holder",
        "Festive greeting card"
      ],
      variants: [
        { name: "White Marble Finish", price: 1450 },
        { name: "Gold-Leaf Detailing", price: 1650 }
      ]
    },
    {
      id: "divine-2",
      name: "Vighnaharta Ganesha in Brass-Patina",
      price: 1850,
      tagline: "Traditional brass finish reflecting cultural heritage.",
      description: "Adorned with traditional crown details and sitting on a lotus pedestal, the Vighnaharta Ganesha features an antique brass patina. A classic spiritual gift that brings blessings, wealth, and prosperity to new homes.",
      image: "/images/divine/moorti_5.png",
      inclusions: [
        "1 Brass-patina Ganesha pedestal idol",
        "Sandalwood dhoop incense sticks pack",
        "Premium rigid gift box",
        "Blessing card"
      ],
      variants: [
        { name: "Antique Patina", price: 1850 },
        { name: "Polished Gold Brass", price: 2100 }
      ]
    },
    {
      id: "divine-3",
      name: "Laxmi & Ganesha Jugalbandi",
      price: 2800,
      tagline: "The sacred union of wealth and wisdom.",
      description: "A coordinated pair of Ganesha and Laxmi idols, cast in premium marble-resin with meticulous hand-painted details. This set represents auspicious beginnings and prosperity, making it the ultimate housewarming and Diwali gift.",
      image: "/images/divine/moorti_6.png",
      inclusions: [
        "1 Laxmi idol (marble-dust)",
        "1 Ganesha idol (marble-dust)",
        "Velvet storage sleeve",
        "Premium golden presentation box",
        "Personalized greeting note"
      ],
      variants: [
        { name: "Classic White Set", price: 2800 },
        { name: "Gilded Gold Set", price: 3200 }
      ]
    },
    {
      id: "divine-4",
      name: "Bal Gopal Krishna Idol",
      price: 1250,
      tagline: "Divine innocence captured in marble dust.",
      description: "The Bal Gopal Krishna features the infant deity sitting playfully with his butter pot. A symbol of pure joy, simplicity, and love, this sculpture is cast in marble-resin and is a beautiful addition to kids' rooms or main altars.",
      image: "/images/divine/moorti_7.png",
      inclusions: [
        "1 Bal Gopal Krishna idol",
        "Hand-painted clay butter pot prop",
        "Premium gift box packaging"
      ],
      variants: [
        { name: "Standard Matte White", price: 1250 }
      ]
    },
    {
      id: "divine-5",
      name: "Venugopal Krishna in Brass",
      price: 2200,
      tagline: "The eternal flute player in antiqued brass.",
      description: "Standing under a sacred Kadamba tree and playing the flute, the Venugopal Krishna idol features an antiqued brass finish. It brings peace, music, and divine harmony to any living space.",
      image: "/images/divine/moorti_8.png",
      inclusions: [
        "1 Standing Krishna flute idol",
        "Handcrafted brass peacock feather bookmark",
        "Premium linen wrap box"
      ],
      variants: [
        { name: "Antique Patina", price: 2200 }
      ]
    },
    {
      id: "divine-6",
      name: "Auspicious Ganesha on Leaf",
      price: 950,
      tagline: "A minimal, modern spiritual keepsake.",
      description: "Featuring Ganesha resting gracefully on a sacred banyan leaf, this design blends minimal modern aesthetics with deep spiritual meaning. Ideal for corporate desks or car dashboards.",
      image: "/images/divine/moorti_9.png",
      inclusions: [
        "1 Ganesha leaf-pedestal idol",
        "Sticky pad dashboard mounting base",
        "Luxury gift box casing"
      ],
      variants: [
        { name: "Dashboard Size", price: 950 },
        { name: "Altar Display Size", price: 1400 }
      ]
    },
    {
      id: "divine-7",
      name: "Traditional Terracotta Ganesha",
      price: 650,
      tagline: "Earth-friendly heritage clay craft.",
      description: "Handmade by local Jaipur potters using organic clay, this eco-friendly Ganesha idol is painted with natural colors. Dissolves fully and safely in water for Visarjan.",
      image: "/images/divine/moorti_1.jpg",
      inclusions: [
        "1 Clay Ganesha idol",
        "Hand-painted clay diya",
        "Recycled paper box package"
      ],
      variants: [
        { name: "Jaipur Ochre Clay", price: 650 }
      ]
    },
    {
      id: "divine-8",
      name: "Pure Brass Mini Ganesha",
      price: 850,
      tagline: "Solid pocket-sized blessing keepsake.",
      description: "Solid brass pocket Ganesha, hand-polished. A perfect companion for travel, work desks, or car dashboard installations.",
      image: "/images/divine/moorti_2.jpg",
      inclusions: [
        "1 Mini brass Ganesha",
        "Velvet carry pouch"
      ],
      variants: [
        { name: "Polished Brass", price: 850 }
      ]
    },
    {
      id: "divine-9",
      name: "Premium Marble Dust Laxmi",
      price: 1600,
      tagline: "The goddess of light and wealth in pure white.",
      description: "Carved in white marble-resin, the Laxmi idol sits on a pink lotus pedestal, bestowing blessings and grace. Perfect for home altars.",
      image: "/images/divine/moorti_3.jpg",
      inclusions: [
        "1 Laxmi marble-dust idol",
        "Hand-wrapped luxury red box casing"
      ],
      variants: [
        { name: "White Marble", price: 1600 }
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
          details: `Divine Collection Inquiry - Product: ${selectedProduct?.name}. Details: ${formData.details}`
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 60,
          colors: ["#042F2E", "#D1126A", "#E2BA5F"],
        });
      } else {
        alert("Failed: " + (data.error || "Please verify database."));
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Are the brass Moortis made of solid brass?",
      a: "Yes, our brass Moortis are cast in high-grade solid brass with protective lacquer coating to prevent tarnishing over time."
    },
    {
      q: "Can we request bulk customization for corporate gifting?",
      a: "Absolutely. For orders above 50 units, we offer custom-engraved wooden bases, custom packaging box styling, and personalized message scrolls."
    },
    {
      q: "Is the terracotta Ganesha biodegradable?",
      a: "Yes! Our terracotta series is handmade using local river clay and organic paint pigments, allowing them to dissolve fully and safely in water for Visarjan."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF4E8] text-slate-800 pb-20">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FAF4E8] via-[#FCFAF2] to-[#FAF4E8] py-20 px-6 md:px-12 border-b border-[#042F2E]/10 text-left">
        <div className="max-w-6xl mx-auto space-y-6">
          <Link href="/collections" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-teal-deep transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collections</span>
          </Link>
          <div className="inline-flex items-center space-x-2 bg-saffron/10 border border-saffron/25 px-4 py-2 rounded-full text-xs font-bold text-saffron uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Auspicious Keepsakes</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black text-teal-deep leading-[1.05] tracking-tight">
            The Divine <br />
            <span className="text-rani-pink italic font-serif font-normal">Moorti Collection</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-650 leading-relaxed max-w-xl font-light">
            Sacred idols of Ganesha, Laxmi, and Krishna handcrafted from premium marble-dust, organic terracotta clay, and polished solid brass. Perfect keepsakes for home altars, housewarmings, and festive bulk gifting.
          </p>
        </div>
      </section>

      {/* 2. PRODUCT GRID */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {divineProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FCFAF2]/80 border border-[#042F2E]/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-teal-deep text-[#FAF4E8] text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md">
                  Handcrafted
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-1">
                  <h3 className="font-heading text-lg font-bold text-teal-deep leading-tight group-hover:text-rani-pink transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
                    {product.tagline}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#042F2E]/10 flex items-center justify-between mt-4">
                  <span className="font-bold text-teal-deep text-sm">₹{product.price}</span>
                  <button
                    onClick={() => { setSelectedProduct(product); setIsSubmitted(false); }}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-rani-pink hover:text-teal-deep transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. QUALITY PILLARS */}
      <section className="bg-teal-deep text-[#FAF4E8] py-24 px-6 border-y border-[#042F2E]/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Award,
              title: "Jaipur Artistry",
              desc: "Collaborations with traditional potters and sculptors to preserve organic clay and brass craftsmanship."
            },
            {
              icon: Heart,
              title: "Sacred Integrity",
              desc: "Every idol is handled with care and packed in secure, velvet-lined gift boxes to ensure zero damage."
            },
            {
              icon: ShieldCheck,
              title: "Tarnish Protection",
              desc: "Our solid brass series is sealed with a lacquer finish to retain gold polishing and resist air oxidation."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#032322] border border-white/5 p-8 rounded-2xl text-left space-y-4 shadow-sm">
              <div className="w-10 h-10 bg-[#FAF4E8]/10 text-saffron rounded-xl flex items-center justify-center font-bold">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-[#FAF4E8]/70 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAQS */}
      <section className="max-w-4xl mx-auto px-6 py-24 space-y-12">
        <h2 className="font-heading text-2xl md:text-3xl font-black text-teal-deep text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#FCFAF2]/80 border border-[#042F2E]/5 rounded-2xl overflow-hidden text-left shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 focus:outline-none"
              >
                <span className="font-heading text-sm font-bold text-teal-deep pr-6">{faq.q}</span>
                <span className="text-saffron font-bold text-lg">{activeFaq === idx ? "−" : "+"}</span>
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 pt-1 text-xs text-slate-500 leading-relaxed font-light border-t border-[#042F2E]/5">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DYNAMIC DETAILS MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FCFAF2] border border-[#042F2E]/10 rounded-[32px] w-full max-w-4xl overflow-hidden shadow-2xl relative text-left grid grid-cols-1 md:grid-cols-12"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Side: Product Image */}
              <div className="md:col-span-5 bg-slate-100 relative min-h-[300px] md:h-full">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Side: Details & Inquiry Form */}
              <div className="md:col-span-7 p-6 md:p-10 space-y-6 max-h-[85vh] overflow-y-auto">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-saffron uppercase tracking-widest bg-saffron/10 px-2.5 py-1 rounded-md border border-saffron/20">Divine Item</span>
                  <h2 className="font-heading text-2xl font-black text-teal-deep">{selectedProduct.name}</h2>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#042F2E]/5">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inclusions</span>
                    <ul className="space-y-1.5">
                      {selectedProduct.inclusions.map((inc, i) => (
                        <li key={i} className="text-[10px] text-slate-650 flex items-start">
                          <span className="text-saffron mr-1.5">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Tiers</span>
                    <ul className="space-y-1.5">
                      {selectedProduct.variants.map((v, i) => (
                        <li key={i} className="text-[10px] text-slate-650 flex justify-between items-center bg-[#FAF4E8]/50 px-2 py-1.5 rounded-lg border border-[#042F2E]/5">
                          <span className="font-semibold">{v.name}</span>
                          <span className="text-teal-deep">₹{v.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Inquiry Form inside Modal */}
                <div className="pt-6 border-t border-[#042F2E]/5 space-y-4">
                  {isSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center space-x-2 text-xs">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Thank you! Your bulk Moorti inquiry has been received. Our account manager will call you back shortly.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bulk Inquiry (MOQ 20)</span>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          required
                          type="text"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full text-xs border border-[#042F2E]/10 px-3 py-2 bg-[#FAF4E8]/50 rounded-xl focus:outline-none focus:border-teal-deep"
                        />
                        <input
                          required
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full text-xs border border-[#042F2E]/10 px-3 py-2 bg-[#FAF4E8]/50 rounded-xl focus:outline-none focus:border-teal-deep"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          required
                          type="tel"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full text-xs border border-[#042F2E]/10 px-3 py-2 bg-[#FAF4E8]/50 rounded-xl focus:outline-none focus:border-teal-deep"
                        />
                        <select
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="w-full text-xs border border-[#042F2E]/10 px-3 py-2 bg-[#FAF4E8]/50 rounded-xl focus:outline-none focus:border-teal-deep"
                        >
                          <option>20-50 units</option>
                          <option>50-100 units</option>
                          <option>100-200 units</option>
                          <option>200+ units</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-rani-pink hover:bg-rani-pink/95 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                      >
                        {isSubmitting ? "Sending Request..." : "Request Call Back"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
