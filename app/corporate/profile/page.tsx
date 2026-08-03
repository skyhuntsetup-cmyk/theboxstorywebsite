"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, 
  Sparkles, Gift, ShieldCheck, Truck, Percent, 
  Award, Heart, Layers, Laptop, PenTool, ExternalLink, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export default function CorporateProfileDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Right") {
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "Left") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const slides: Slide[] = [
    // Slide 1: Welcome Cover
    {
      id: "cover",
      title: "Corporate Gifting Profile",
      subtitle: "The Box Story",
      content: (
        <div className="flex flex-col items-center justify-center text-center space-y-6 h-full max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-saffron/10 border border-saffron/20 px-4 py-2 rounded-full text-xs font-bold text-saffron uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
            <span>Premium B2B Gifting</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-teal-deep tracking-tight leading-tight">
            Gifts That <br />
            Tell a <span className="text-rani-pink italic font-serif font-normal">Story</span>
          </h2>
          <div className="w-16 h-1.5 bg-gold rounded-full" />
          <p className="text-sm text-slate-650 leading-relaxed font-light">
            Welcome to a world of thoughtful curation, where every detail is meticulously crafted to bring joy and warmth to your corporate relationships.
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Press Right Arrow Key or Click Next to Begin
          </p>
        </div>
      )
    },
    // Slide 2: About Our Brand
    {
      id: "about",
      title: "About Our Brand",
      subtitle: "Diwali Spirit Meets the Art of Gifting",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full max-w-4xl mx-auto text-left">
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-black text-teal-deep">
              Thoughtful Experiences
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              At The Box Story, we understand that gifting is more than just a tradition — it&apos;s an opportunity to express gratitude, build connections, and foster enduring business relationships.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              Our catalogs are a reflection of our commitment to delivering not just gifts, but experiences that resonate with the spirit of the season. We bring together the finest gourmet treats, wellness essentials, and tech accessories wrapped in custom-designed packages.
            </p>
          </div>
          <div className="bg-[#FCFAF2]/80 border border-[#042F2E]/5 rounded-3xl p-6 space-y-4">
            <h4 className="font-heading text-sm font-bold text-teal-deep">Our Core Commitments</h4>
            <ul className="space-y-3">
              {[
                { title: "Meticulous Detail", desc: "Every item is selected for quality, utility, and sensory delight." },
                { title: "Artisanal Collaboration", desc: "We partner directly with traditional potters and premium sweetmakers." },
                { title: "Seamless Fulfillment", desc: "End-to-end management, from custom styling to drop-shipping." }
              ].map((c, i) => (
                <li key={i} className="flex items-start space-x-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{c.title}</h5>
                    <p className="text-[10px] text-slate-500">{c.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    // Slide 3: Benefits of Corporate Gifting
    {
      id: "benefits",
      title: "Strategic Benefits",
      subtitle: "Why Corporate Gifting is an Investment",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          {[
            {
              icon: Heart,
              color: "text-rani-pink bg-rani-pink/5",
              title: "Building Stronger Relationships",
              desc: "Corporate gifts serve as a gesture of goodwill, reinforcing relationships with both clients and employees. By appreciating partnership efforts, you foster loyalty and build a dependable support network."
            },
            {
              icon: Award,
              color: "text-saffron bg-saffron/5",
              title: "Enhanced Brand Visibility",
              desc: "Branded custom gifts act as tools for continuous brand exposure. Every functional item used by a recipient keeps your business top-of-mind in a non-intrusive, organic manner."
            },
            {
              icon: ShieldCheck,
              color: "text-teal-deep bg-teal-deep/5",
              title: "Increased Client Retention",
              desc: "Clients who receive thoughtful tokens of appreciation are far more likely to retain your services. Custom gifting differentiates your brand, elevating satisfaction and driving repeat business."
            },
            {
              icon: Layers,
              color: "text-emerald-800 bg-emerald-50/50",
              title: "Positive Company Image",
              desc: "Highlight your commitment to employee wellness and corporate social responsibility. A positive reputation makes your company highly attractive to top talent and prospective partners."
            }
          ].map((b, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>
                <b.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Slide 4: What We Offer
    {
      id: "offerings",
      title: "Our Core Offerings",
      subtitle: "Versatile Solutions Tailored to Your Brand",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          {[
            {
              icon: Gift,
              title: "Diverse Selection",
              desc: "From premium gourmet treats and artisanal sweets to custom wellness blends and premium tech gadgets (Portronics, Noise)."
            },
            {
              icon: PenTool,
              title: "Customization & Branding",
              desc: "Gold-foil logo prints on boxes, custom sleeves in corporate colors, name engravings, and handwritten calligraphy cards."
            },
            {
              icon: Layers,
              title: "Premium Packaging",
              desc: "Reusable pine wood chest boxes, gold-foiled rigid drawers, leatherette trays, and sustainable eco-friendly wraps."
            },
            {
              icon: Truck,
              title: "Streamlined Logistics",
              desc: "Individual drop-shipping directly to employee home addresses globally, with secure online size/treat claim portals."
            },
            {
              icon: Percent,
              title: "Early Bird Offers",
              desc: "Diwali launch discounts, packaging upgrades, and free volume customization for orders booked before seasonal peaks."
            },
            {
              icon: HelpCircle,
              title: "Dedicated Account Support",
              desc: "Our design experts guide you through box styling, mockup generation, and product coordination step-by-step."
            }
          ].map((o, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2">
              <div className="w-8 h-8 bg-slate-50 text-teal-deep rounded-lg flex items-center justify-center font-bold">
                <o.icon className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">{o.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-light">{o.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    // Slide 5: Gifting Formats
    {
      id: "formats",
      title: "Gifting Formats",
      subtitle: "Curations for Every Style & Budget",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          {[
            {
              title: "Pre-Curated Luxury Hampers",
              desc: "Fully designed and ready-made premium boxes combining high-end utility items, organic foods, and holiday decor. Perfect for quick selection and guaranteed unboxing impact.",
              tags: ["Ready-to-Ship", "Auspicious Accents", "Corporate Elite"]
            },
            {
              title: "Customizable Gift Hampers",
              desc: "Tailored to your specific budget, tastes, and theme. Mix and match corporate swag, dry fruit jars, and custom accessories to create a layout unique to your organization.",
              tags: ["Bespoke Budgeting", "Flexible Items", "Custom Theme"]
            },
            {
              title: "Eco-Friendly Gifts",
              desc: "Commit to corporate social responsibility (CSR) and sustainability with zero-waste items. Includes reusable drinkware, organic teas, and plantable seed-paper logs.",
              tags: ["Sustainable", "Acacia Honey", "Zero-Waste"]
            },
            {
              title: "Tech Gadgets & Accessories",
              desc: "High-end utility accessories designed to enhance productivity and lifestyle. Branded wireless chargers, noise-canceling headphones, and smart thermal flasks.",
              tags: ["Portronics Gear", "Smart Drinkware", "Premium Desk"]
            }
          ].map((f, idx) => (
            <div key={idx} className="bg-[#FAF4E8]/40 border border-slate-200/80 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-900">{f.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">{f.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100/50">
                {f.tags.map((t, i) => (
                  <span key={i} className="text-[9px] bg-teal-deep/5 text-teal-deep/80 px-2 py-0.5 rounded-full font-bold">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Slide 6: Make Your Own Hamper (4 Steps)
    {
      id: "steps",
      title: "Make Your Own Hamper",
      subtitle: "Four Easy Steps to Bespoke Curations",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
          {[
            {
              step: "Step 01",
              title: "Choose Packaging",
              desc: "Select rigid boxes, wooden chests, eco-friendly trays, or open display trays (Delhi NCR only) to set the visual tone."
            },
            {
              step: "Step 02",
              title: "Select Products",
              desc: "Fill the hamper from gourmet sweets, organic coffees, keychains, flasks, desk books, or premium cookies."
            },
            {
              step: "Step 03",
              title: "Add Custom Branding",
              desc: "Place your logo, select coordinate ribbons, and customize message greetings with individual names."
            },
            {
              step: "Step 04",
              title: "Review & Ship",
              desc: "Confirm your quantities, verify mockups, and let our logistics team ship directly to recipients."
            }
          ].map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl relative space-y-3 flex flex-col justify-between">
              <span className="absolute top-4 right-4 text-[24px] font-serif font-bold text-rani-pink/10 tracking-tighter leading-none">{s.step}</span>
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-900 pr-10">{s.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">{s.desc}</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-bold text-[10px] mt-2">➔</div>
            </div>
          ))}
        </div>
      )
    },
    // Slide 7: Customization & Branding Details
    {
      id: "customization",
      title: "Customization & Branding",
      subtitle: "Every Gift is a Representative of Your Brand",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full max-w-4xl mx-auto text-left">
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-black text-teal-deep">
              Branding That Speaks
            </h3>
            <p className="text-xs text-slate-650 leading-relaxed font-light">
              Logo placements on hampers and boxes reinforce brand recognition and elevate perceived value. We transform everyday corporate products into bespoke keepsakes that recipients will treasure.
            </p>
            <p className="text-xs text-slate-650 leading-relaxed font-light">
              Whether gold-foil hot stamping, custom-printed box sleeves, or individual name monogram engraving on flasks and diaries — our customization options ensure complete design alignment with your corporate guidelines.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Box Branding", desc: "Gold foil stamp or screen print on rigid boxes." },
              { title: "Name Engraving", desc: "Laser etch names on metal pens, flasks & tech." },
              { title: "Custom Sleeves", desc: "Full-color paper sleeves matching brand colors." },
              { title: "Bespoke Tags", desc: "Calligraphy printed messages and custom labels." }
            ].map((b, i) => (
              <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                <p className="text-[9px] text-slate-500 leading-normal font-light">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // Slide 8: Brand Collaborations
    {
      id: "collaborations",
      title: "Brand Collaborations",
      subtitle: "Trusted by Top Enterprises & Startups",
      content: (
        <div className="space-y-6 max-w-3xl mx-auto text-center h-full flex flex-col justify-center">
          <div className="space-y-3">
            <h3 className="font-heading text-xl font-bold text-teal-deep">
              Our Legacy of Collaborations
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl mx-auto font-light">
              Over the years, we&apos;ve had the privilege of working with respected names across finance, tech, healthcare, and consumer goods. Each project is an opportunity for us to understand a brand&apos;s vision and deliver gifting solutions that align with their goals.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center justify-center py-4">
            {["Google", "CRED", "TATA", "Razorpay", "Zomato", "Microsoft"].map((b, idx) => (
              <div key={idx} className="bg-[#FAF4E8]/40 border border-slate-200/50 p-4 rounded-xl text-center">
                <span className="font-heading text-sm font-black text-slate-500 block tracking-tight uppercase">{b}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Finance • Tech • Startups • Healthcare • Enterprises
          </p>
        </div>
      )
    },
    // Slide 9: Contact & Get in Touch
    {
      id: "contact",
      title: "Let's Collaborate",
      subtitle: "Start Your Gifting Journey",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full max-w-4xl mx-auto text-left">
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-black text-teal-deep">
              Thank You
            </h3>
            <p className="text-xs text-slate-650 leading-relaxed font-light">
              At The Box Story, we believe every gift tells a story — a story of appreciation, connection, and shared success. We look forward to collaborating with you to make your gifting unforgettable.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <p className="flex items-center space-x-2 text-slate-600">
                <span className="font-bold text-teal-deep">Mail:</span>
                <span>sayhi@theboxstory.co.in</span>
              </p>
              <p className="flex items-center space-x-2 text-slate-600">
                <span className="font-bold text-teal-deep">Phone:</span>
                <span>+91 97179 99223 / +91 85756 75685</span>
              </p>
              <p className="flex items-center space-x-2 text-slate-600">
                <span className="font-bold text-teal-deep">Site:</span>
                <span>www.theboxstory.co.in</span>
              </p>
            </div>
          </div>
          
          <div className="bg-[#FCFAF2]/60 border border-[#042F2E]/10 p-6 rounded-3xl space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-2">
              <h4 className="font-heading text-sm font-bold text-slate-900">Ready to start curation?</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                Fill out our design brief questionnaire and our creative styling specialists will get back to you with custom 3D mockups.
              </p>
            </div>
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                href="/corporate#brief-form"
                className="w-full text-center bg-teal-deep hover:bg-teal-deep/90 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                Brief Our Designers
              </Link>
              <a
                href="/corporate/catalog?file=The%20Box%20Story%20-%20Corporate%20Gifting%20Profile.pdf"
                target="_blank"
                className="w-full text-center bg-white border border-slate-200 text-teal-deep py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Download PDF Deck</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background text-slate-800 flex flex-col py-6 px-4 md:px-8">
      {/* Top Header Row */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-200/60 mb-6">
        <Link href="/corporate" className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-teal-deep transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Corporate</span>
        </Link>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Interactive Deck • Slide {currentSlide + 1} of {slides.length}
        </span>
      </div>

      {/* Main Slide Card Container */}
      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* Left Side: Table of Contents Index Panel */}
        <div className="w-full md:w-60 bg-white border border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <h4 className="font-heading text-xs font-black text-slate-400 uppercase tracking-widest">
              Slide Contents
            </h4>
            <div className="space-y-1.5 flex flex-col">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`text-left px-3 py-2 rounded-xl text-xs transition-all duration-200 flex items-center space-x-2 ${
                    currentSlide === idx
                      ? "bg-teal-deep text-white font-bold shadow-sm"
                      : "text-slate-650 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] opacity-50 font-mono">0{idx + 1}</span>
                  <span className="truncate">{slide.title}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 hidden md:block">
            <div className="bg-[#FCFAF2] border border-[#E2BA5F]/20 rounded-xl p-3 text-left">
              <span className="text-[9px] font-bold text-saffron uppercase tracking-wider block">Pro Tip</span>
              <p className="text-[10px] text-slate-500 leading-normal">
                Use your keyboard left & right arrow keys to navigate pages.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: The Active Slide Display */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 md:p-10 flex flex-col justify-between relative overflow-hidden min-h-[480px]">
          {/* Subtle gold decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
          
          {/* Slide Header */}
          <div className="space-y-1 border-b border-slate-100 pb-4 text-left">
            <span className="text-[9px] font-black uppercase text-saffron tracking-widest">{activeSlide.subtitle || "The Box Story"}</span>
            <h2 className="font-heading text-2xl font-black text-teal-deep leading-tight">{activeSlide.title}</h2>
          </div>

          {/* Slide Content Body */}
          <div className="flex-1 py-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                {activeSlide.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Footer Navigation */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex items-center space-x-1.5 text-xs font-bold py-2 px-4 rounded-xl border transition-all ${
                currentSlide === 0
                  ? "opacity-30 border-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className={`flex items-center space-x-1.5 text-xs font-bold py-2 px-4 rounded-xl border transition-all ${
                currentSlide === slides.length - 1
                  ? "opacity-30 border-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800 text-white border-slate-950 shadow-sm"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
