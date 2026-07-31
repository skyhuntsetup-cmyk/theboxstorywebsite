"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building, Gift, CheckCircle2, ChevronRight,
  Globe, Laptop, Star, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CorporateGifting() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "50-100",
    budget: "₹1500 - ₹2500",
    details: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else {
        alert("Submission Failed: " + (data.error || "Please verify database connection."));
      }
    } catch (err) {
      alert("Network Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { number: "4,95,000+", label: "Hampers Shipped" },
    { number: "500+", label: "Enterprise Brands" },
    { number: "100%", label: "On-time Dispatch Rate" },
  ];

  const clientLogos = [
    "Google", "CRED", "TATA", "Razorpay", "Zomato", "Microsoft"
  ];

  const features = [
    {
      icon: Laptop,
      title: "Micro Gift Shops",
      desc: "We generate custom branded login links where your employees select their preferred treats & clothing sizes directly.",
    },
    {
      icon: Globe,
      title: "Address Collection Portals",
      desc: "Remove HR delivery logistics. Send claim links to employees and let them input their addresses securely.",
    },
    {
      icon: Gift,
      title: "Bespoke Engraving & Swag",
      desc: "Laser-etch company logos on premium copper flasks, mahogany notebooks, leather bags, or wooden boxes.",
    },
  ];

  const testimonials = [
    {
      quote: "The Box Story's automated claiming portal made our annual employee appreciation campaign completely painless. Employees selected their own diwali diya styles, and tracking was transparent.",
      author: "Sneha Reddy",
      role: "VP of People, CRED",
      rating: 5
    },
    {
      quote: "Excellent customization options! They laser-engraved our brand logo on insulated Stanley cups and shipped them to 200+ clients across India on time. Outstanding support.",
      author: "Rohan Das",
      role: "Operations Director, Razorpay",
      rating: 5
    },
    {
      quote: "Outstanding unboxing experience! Our new hires loved the custom diaries, hoodies, and saffron sweets. The Box Story is our default onboarding kit partner.",
      author: "Aditi Iyer",
      role: "HR Lead, Google India",
      rating: 5
    }
  ];

  const faqs = [
    {
      q: "What is the Minimum Order Quantity (MOQ) for corporate orders?",
      a: "Our MOQ for custom-branded rigid boxes and bulk corporate orders is 20 units. For smaller counts, you can design individual hampers directly inside our Build-a-Box Studio.",
    },
    {
      q: "How does address collection work?",
      a: "We provide your HR team with unique Claim Tokens (passcodes) or Magical Links. Employees visit our claim portals, input their details and sizes, and we ship the gifts directly to their doorsteps.",
    },
    {
      q: "Can we customize the box styling with corporate colors?",
      a: "Yes! For bulk runs above 100 units, we offer custom-dyed papers, screen-printed logos, and corporate ribbon bows matching your exact brand guidelines.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-800 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Banner Section: Sleek B2B Layout (Light Theme) */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 via-background to-rose-50 text-slate-800 p-8 md:p-20 shadow-sm border border-slate-200 text-left">
          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 bg-background border border-slate-200 px-3 py-1.5 rounded-full inline-block">
              Corporate Bulk Services
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black leading-tight tracking-tight text-teal-deep">
              Corporate Gifting <br />
              <span className="text-rani-pink">Reimagined.</span>
            </h1>
            <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
              Automated address collection, custom swag sourcing, and high-quality rigid hampers built to leave a lasting B2B impression.
            </p>
            <div className="pt-2">
              <a
                href="#brief-form"
                className="inline-flex items-center space-x-2 bg-teal-deep text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-teal-deep/90 shadow transition-all"
              >
                <span>Brief our Designers</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Client Logos ticker */}
        <section className="space-y-4 text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Trusted by fast-growing startups & enterprises</span>
          <div className="flex flex-wrap gap-8 justify-center items-center py-4 opacity-55">
            {clientLogos.map((logo, idx) => (
              <span key={idx} className="font-heading text-xl font-extrabold tracking-tight text-slate-600 uppercase">
                {logo}
              </span>
            ))}
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-left space-y-2">
              <span className="text-3xl font-black text-slate-900 block tracking-tight">{s.number}</span>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Corporate Gifting Profile & Why Choose Us */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#FCFAF2]/65 p-8 md:p-12 rounded-[40px] border border-teal-deep/5 text-left animate-fade-in">
          {/* Left Column: Corporate Gifting Profile */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-saffron bg-saffron/10 px-3 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Corporate Profile
            </span>
            <h2 className="font-heading text-3xl font-black text-teal-deep leading-tight">
              Thoughtful Gifting, Crafted with Precision
            </h2>
            <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-light">
              At The Box Story, we believe corporate gifting is a strategic investment in relationships. Whether celebrating a major milestone, welcoming new hires, or thanking valuable clients, we curate hampers that are designed to be opened slowly.
            </p>
            <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-light">
              Every hamper starts as a sketch in our Jaipur studio, combining premium products with artisanal craft pieces like clay potters&apos; diyas, Mysore sandalwood, and sweets from third-generation sweetmakers.
            </p>
            <div className="border-t border-teal-deep/10 pt-4 flex items-center space-x-4">
              <span className="font-heading text-xs font-bold text-teal-deep">Legacy of Collaborations:</span>
              <span className="text-[10px] text-slate-500 font-bold bg-[#FAF4E8] px-2.5 py-1 rounded-md border border-slate-200">Startups & Enterprises</span>
              <span className="text-[10px] text-slate-500 font-bold bg-[#FAF4E8] px-2.5 py-1 rounded-md border border-slate-200">Destinations</span>
            </div>
          </div>

          {/* Right Column: Why Choose Us (4 Cards Grid) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-heading text-xl font-black text-teal-deep">
              Why Partner with The Box Story?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-saffron/15 text-saffron rounded-lg flex items-center justify-center font-bold">
                  ✨
                </div>
                <h4 className="font-heading text-sm font-bold text-teal-deep">Sensory & Artisanal Curation</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Direct partnerships with clay potters, brass engravers, and organic tea farmers ensure authentic, hand-cast heritage pieces in every box.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 bg-rani-pink/15 text-rani-pink rounded-lg flex items-center justify-center font-bold">
                  🖋️
                </div>
                <h4 className="font-heading text-sm font-bold text-teal-deep">Full Logo & Name Personalization</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Screen-printed logo boxes, engraved thermal flasks, laser-etched pens/notebooks, and handwritten-style greeting cards.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 bg-teal-deep/15 text-teal-deep rounded-lg flex items-center justify-center font-bold">
                  🔗
                </div>
                <h4 className="font-heading text-sm font-bold text-teal-deep">Magical Claims Portal</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  No spreadsheets or size-chasing. Recipient receives a secure link, selects their custom treats or apparel size, and confirms address.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 bg-[#8F9489]/15 text-emerald-800 rounded-lg flex items-center justify-center font-bold">
                  🌱
                </div>
                <h4 className="font-heading text-sm font-bold text-teal-deep">Premium Sustainable Formats</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Durable gold-foiled rigid boxes, reusable pine wood chests, leatherette boxes, and eco-friendly wellness blends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exploratory Subpages: Client Panel & Past Work */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-left space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group">
            <span className="text-[10px] font-bold text-rani-pink uppercase tracking-widest bg-rani-pink/5 border border-rani-pink/15 px-2.5 py-1 rounded-full inline-block">
              Client Portal
            </span>
            <h3 className="font-heading text-xl font-black text-slate-900 group-hover:text-rani-pink transition-colors">
              Employee Claim Panel
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discover how we build custom unboxing hubs where your team members can enter voucher codes, select sizes, and claim packages.
            </p>
            <Link
              href="/corporate/client-panel"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-deep hover:text-saffron transition-colors"
            >
              <span>Explore Portal Solutions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-left space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group">
            <span className="text-[10px] font-bold text-saffron uppercase tracking-widest bg-saffron/5 border border-saffron/15 px-2.5 py-1 rounded-full inline-block">
              Portfolio
            </span>
            <h3 className="font-heading text-xl font-black text-slate-900 group-hover:text-rani-pink transition-colors">
              Our Past Work & Case Studies
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Read the case studies behind Google&rsquo;s tech welcome kits, CRED&apos;s Diwali gold-foiled boxes, and heritage weddings favors.
            </p>
            <Link
              href="/corporate/past-work"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-deep hover:text-saffron transition-colors"
            >
              <span>View Past Work</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Services & Capabilities */}
        <section className="space-y-12">
          <div className="space-y-3 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-black text-slate-900">Custom Corporate Solutions</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We leverage modern technology platforms to make shipping swag and kits completely painless for HR & admin managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-650 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Products We Deal In / Catalogues Download */}
        <section className="space-y-12 animate-fade-in">
          <div className="space-y-3 text-center">
            <span className="text-[10px] font-bold text-rani-pink uppercase tracking-widest bg-rani-pink/5 border border-rani-pink/15 px-2.5 py-1 rounded-full inline-block">
              Corporate Catalogues
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-black text-slate-900">Products We Deal In</h2>
            <p className="text-xs text-slate-555 max-w-md mx-auto">
              Download our signature brochures and curated catalogs for detailed specifications, bulk pricing levels, and branding guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Bags & Backpacks */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-4 hover:shadow-md transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-saffron/10 text-saffron rounded-xl flex items-center justify-center font-bold text-lg">
                  💼
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-teal-deep transition-colors">
                  Bags & Executive Backpacks
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Premium laptop sleeves, leather bags, smart business packs, and luggage sets.
                </p>
              </div>
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-100">
                <a
                  href="/catalogues/BAG CATALOGUE 2025-26.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-between text-[11px] font-bold text-teal-deep hover:text-saffron transition-colors"
                >
                  <span>Standard Bag Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/catalogues/EXECUTIVE BAG CATALOGUE 2025-26.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-between text-[11px] font-bold text-teal-deep hover:text-saffron transition-colors"
                >
                  <span>Executive Bag Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. Executive Notebooks & Diaries */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-4 hover:shadow-md transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-rani-pink/10 text-rani-pink rounded-xl flex items-center justify-center font-bold text-lg">
                  📓
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-teal-deep transition-colors">
                  Notebooks & Organizers
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Genuine leather diaries, pocket memo pads, custom planners, and gold-trimmed conference notebooks.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <a
                  href="/catalogues/NOTEBOOK CATALOGUE 2025-26.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-between w-full text-[11px] font-bold text-teal-deep hover:text-saffron transition-colors"
                >
                  <span>Download Notebook Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 3. Luxury Pens & Keychains */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-4 hover:shadow-md transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-teal-deep/10 text-teal-deep rounded-xl flex items-center justify-center font-bold text-lg">
                  🖋️
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-teal-deep transition-colors">
                  Writing Instruments & Keys
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Engraved metal rollerballs, premium pen sets, custom leather keychains, and laser-marked steel key rings.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <a
                  href="/catalogues/PEN & KEYCHAIN CATALOGUE 2025-26.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-between w-full text-[11px] font-bold text-teal-deep hover:text-saffron transition-colors"
                >
                  <span>Download Pens & Keychains Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 4. Leather Wallets & Cardholders */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-4 hover:shadow-md transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-emerald-700/10 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-lg">
                  👛
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-teal-deep transition-colors">
                  Wallets & Leather Accessories
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  RFID-protected bifold wallets, card sleeves, travel passport folders, and premium utility cases.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <a
                  href="/catalogues/WALLET CATALOGUE 2025-26.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-between w-full text-[11px] font-bold text-teal-deep hover:text-saffron transition-colors"
                >
                  <span>Download Wallets Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 5. Meyvin Collection & Drinkware */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-4 hover:shadow-md transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-amber-700/10 text-amber-800 rounded-xl flex items-center justify-center font-bold text-lg">
                  ☕
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-teal-deep transition-colors">
                  Meyvin Premium Flasks & Drinkware
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vacuum-insulated thermal bottles, travel mugs, matching coasters, and gift boxes.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <a
                  href="/catalogues/MEYVIN CATALOGUE 2025-26.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-between w-full text-[11px] font-bold text-teal-deep hover:text-saffron transition-colors"
                >
                  <span>Download Meyvin Flasks Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 6. Smart Lifestyle & Electronics */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-4 hover:shadow-md transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-[#8F9489]/10 text-emerald-950 rounded-xl flex items-center justify-center font-bold text-lg">
                  🔌
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-teal-deep transition-colors">
                  Smart Lifestyle Products
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Smart mugs, tech accessories, ambient desk humidifiers, and organizers from our lifestyle selection.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <a
                  href="/catalogues/LIFESTYLE PRODUCT CATALOGUE 2025-26.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-between w-full text-[11px] font-bold text-teal-deep hover:text-saffron transition-colors"
                >
                  <span>Download Lifestyle Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 7. Premium Apparel & Polos */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-4 hover:shadow-md transition-all group flex flex-col justify-between sm:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-[#5A6E85]/10 text-[#2B3A4A] rounded-xl flex items-center justify-center font-bold text-lg">
                    👕
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-teal-deep transition-colors">
                    Premium Apparel & Polo T-shirts
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Custom logo polo shirts, Flynn tee series, cotton workspace hoodies, and activewear for corporate events.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 md:pt-0 pl-0 md:pl-6 border-l border-slate-100">
                  <a
                    href="/catalogues/Flynn Premium Tee Catalogue-1.pdf"
                    target="_blank"
                    className="flex items-center justify-between text-[11px] text-teal-deep font-bold hover:text-saffron transition-colors"
                  >
                    <span>Flynn Tees</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href="/catalogues/golfer premium polo.pdf"
                    target="_blank"
                    className="flex items-center justify-between text-[11px] text-teal-deep font-bold hover:text-saffron transition-colors"
                  >
                    <span>Golfer Polos</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href="/catalogues/solid polo.pdf"
                    target="_blank"
                    className="flex items-center justify-between text-[11px] text-teal-deep font-bold hover:text-saffron transition-colors"
                  >
                    <span>Solid Polos</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href="/catalogues/green polo.pdf"
                    target="_blank"
                    className="flex items-center justify-between text-[11px] text-teal-deep font-bold hover:text-saffron transition-colors"
                  >
                    <span>Green Polos</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Inquiries Form Section */}
        <section id="brief-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm text-left">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-saffron bg-saffron/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Project Brief
            </span>
            <h2 className="font-heading text-3xl font-black text-slate-900 leading-tight">
              Tell us about your Gifting Project
            </h2>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              Provide your details, and a dedicated corporate gifting specialist will get in touch with pricing breaks, custom catalogs, and mockups.
            </p>
            <div className="space-y-2 text-xs text-slate-500 font-semibold pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Custom Corporate Logo Ribbons</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Single address bulk shipping or address links</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Rishabh Arora"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Google India"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="hello@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 99999 88888"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Quantity Needed</label>
                      <select
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none"
                      >
                        <option value="20-50">20 to 50 boxes</option>
                        <option value="50-100">50 to 100 boxes</option>
                        <option value="100-300">100 to 300 boxes</option>
                        <option value="300+">300+ boxes</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Estimated Budget Per Box</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none"
                      >
                        <option value="Under ₹1500">Under ₹1,500</option>
                        <option value="₹1500 - ₹2500">₹1,500 to ₹2,500</option>
                        <option value="₹2500 - ₹4000">₹2,500 to ₹4,000</option>
                        <option value="₹4000+">₹4,000+ per box</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Custom Brief & Branding Instructions</label>
                    <textarea
                      rows={4}
                      placeholder="Brief details about custom card notes, laser engraving, packaging choice, etc..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-slate-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow"
                  >
                    {isSubmitting ? "Logging Project Brief..." : "Submit Project Brief"}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-background border border-slate-200 text-slate-800 p-8 rounded-2xl text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-teal-deep">Brief Logged!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, your brief has been submitted. A corporate gifting consultant will reach out via email/phone in under 12 business hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-bold px-6 py-2.5 bg-teal-deep text-white rounded-lg hover:bg-teal-deep/90 transition-colors"
                  >
                    Submit Another Brief
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Testimonials Segment: What Our Corporate Clients Say */}
        <section className="space-y-10 text-center">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-saffron bg-saffron/10 px-3 py-1 rounded-full uppercase">
              Reviews & Validation
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-black text-slate-900">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-8 rounded-3xl text-left flex flex-col justify-between h-72 shadow-sm">
                <div className="space-y-4">
                  <div className="flex space-x-1 text-saffron">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-saffron" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">{t.author}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{t.role}</span>
                  </div>
                  <Building className="w-4 h-4 text-teal-deep/30" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto space-y-8 text-left">
          <h2 className="font-heading text-2xl md:text-3xl font-black text-slate-900 text-center">Frequently Answered Queries</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isFaqActive = activeFaq === idx;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setActiveFaq(isFaqActive ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-slate-900 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isFaqActive ? "transform rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isFaqActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 bg-slate-50/50 p-5 text-xs text-slate-650 leading-relaxed"
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
