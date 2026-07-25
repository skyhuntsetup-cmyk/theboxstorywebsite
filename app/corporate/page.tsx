"use client";

import React, { useState } from "react";
import { 
  Briefcase, Building, Gift, CheckCircle2, ChevronRight, MessageSquare, 
  Sparkles, Users, Award, Percent, ChevronDown, Check, Globe, Laptop 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const stats = [
    { number: "4,95,000+", label: "Experiences Delivered" },
    { number: "500+", label: "Enterprise Brands Served" },
    { number: "100%", label: "On-Time Dispatch Rate" },
    { number: "5,000+", label: "Scale-Ready Products" },
  ];

  const services = [
    {
      icon: Laptop,
      title: "Bespoke Microsites (Micro Gift Shop)",
      desc: "Give recipients the ultimate choice. We build a client-branded private catalog page where your employees select their preferred hamper directly.",
    },
    {
      icon: Gift,
      title: "Swag & Custom Merchandise",
      desc: "From smart tech bottles and leather accessories to branded hoodies and journals, we curate items with high-quality logo print and engraving details.",
    },
    {
      icon: Globe,
      title: "Global Address Distribution",
      desc: "Provide an Excel list, and we distribute individual boxes directly to homes across India and internationally, handling customs and tracking notifications.",
    },
  ];

  const categories = [
    {
      name: "Employee Onboarding Kits",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80",
      desc: "Premium tech bags, notebooks, steel mugs, and welcome cards that tell your brand story from Day 1.",
    },
    {
      name: "Appreciation & Gratitude Kits",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop&q=80",
      desc: "Artisanal cookies, custom green teas, spa candles, and organic wellness treats to say a heartfelt thank you.",
    },
    {
      name: "Festive Hampers (Diwali & New Year)",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80",
      desc: "Traditional brass diyas, dry fruits, premium chocolates, and festive lights in rigid custom boxes.",
    },
  ];

  const faqs = [
    {
      q: "What is the minimum order quantity (MOQ) for corporate branding?",
      a: "Our standard minimum order quantity for fully customized boxes and ribbons with your company logo is 20 hampers. For unbranded premium hampers, there is no MOQ.",
    },
    {
      q: "How does the Bespoke Microsite (Micro Gift Shop) work?",
      a: "We generate a private login page with your company branding. You fund the accounts, and we send unique links to your employees. They select their favorite gift set and type in their shipping address, which compiles into our fulfillment dashboard.",
    },
    {
      q: "Can we include custom branded merchandise in the boxes?",
      a: "Yes! We can manufacture custom diaries, pens, Bluetooth speakers, bottles, hoodies, and powerbanks featuring your laser-engraved corporate branding.",
    },
    {
      q: "What are the shipping delivery times?",
      a: "For bulk orders shipped to a single address, dispatch takes 4-7 business days. For individual doorstep shipments across India, packages usually arrive in 3-5 days after shipping coordinates are finalized.",
    },
  ];

  const clients = ["Google", "Microsoft", "Zomato", "Uber", "CRED", "Tata Consultancy Services"];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-24">
      {/* 1. Page Header Hero */}
      <section className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-teal-deep to-[#031d1d] text-[#FFFDF5] p-8 md:p-20 shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rani-pink/5 rounded-full blur-3xl" />
        
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF5]/10 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-saffron uppercase">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Corporate Custom Partnerships</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black leading-tight">
            Corporate Gifting, <br />
            <span className="text-saffron">Artfully Branded</span>
          </h1>
          <p className="text-sm md:text-base text-[#FFFDF5]/75 leading-relaxed">
            Delight employees, clients, and VIP partners with premium custom boxes. We handle merchandise sourcing, rigid box designs, logo engraving, and domestic/international fulfillment.
          </p>
          <a
            href="#inquiry-form"
            className="inline-flex items-center space-x-2 bg-saffron hover:bg-saffron/95 text-teal-deep px-6 py-3 rounded-full font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <span>Launch Project Brief</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 2. Client Logo Scroll */}
      <section className="space-y-6">
        <h3 className="text-center text-xs font-bold uppercase tracking-widest text-teal-deep/55">
          Powering Gifting for India&apos;s Leading Teams
        </h3>
        <div className="flex overflow-hidden relative w-full border-y border-teal-deep/10 py-6">
          <div className="flex space-x-16 whitespace-nowrap animate-marquee">
            {[...clients, ...clients].map((client, idx) => (
              <span
                key={idx}
                className="text-lg md:text-xl font-heading font-black tracking-wider text-teal-deep/40 hover:text-teal-deep transition-colors"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Statistics Counters (Inspired by Confetti Gifts) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border border-teal-deep/5 p-8 rounded-[32px] shadow-sm text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="font-heading text-3xl md:text-4xl font-black text-rani-pink">
              {stat.number}
            </h4>
            <p className="text-xs font-semibold text-teal-deep/60 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* 4. Gifting Categories Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-saffron uppercase bg-saffron/10 border border-saffron/20 px-3.5 py-1.5 rounded-full">
            Gift Collections
          </span>
          <h2 className="font-heading text-3xl font-black text-teal-deep">
            Gifts for Every Corporate Milestone
          </h2>
          <p className="text-xs text-teal-deep/60 max-w-md mx-auto">
            Explore our ready-made themes or customize items to match your project guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="bg-white border border-teal-deep/5 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full"
            >
              <div className="aspect-[16/10] bg-teal-deep/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-teal-deep">{cat.name}</h3>
                  <p className="text-xs text-teal-deep/65 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="flex items-center space-x-1 text-xs font-bold text-rani-pink hover:underline pt-4 mt-auto">
                  <a href="#inquiry-form">Inquire for this style</a>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Gifting Services List (Micro Gift Shop, Custom Swag) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-teal-deep/5 p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group text-left"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-saffron/5 rounded-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-115" />
            <div className="w-12 h-12 bg-teal-deep/5 rounded-2xl flex items-center justify-center text-teal-deep group-hover:bg-rani-pink group-hover:text-white transition-colors">
              <srv.icon className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-teal-deep">{srv.title}</h3>
            <p className="text-xs text-teal-deep/60 leading-relaxed">{srv.desc}</p>
          </div>
        ))}
      </section>

      {/* 6. Interactive Inquiry Form */}
      <section 
        id="inquiry-form" 
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white/60 backdrop-blur-sm p-8 md:p-12 rounded-[40px] border border-teal-deep/5 shadow-sm relative overflow-hidden text-left"
      >
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-1 bg-saffron/10 border border-saffron/20 px-3 py-1 rounded-full text-xs font-bold text-saffron uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult Our Designers</span>
          </div>
          <h2 className="font-heading text-3xl font-black text-teal-deep leading-tight">
            Tell us about your Gifting Project
          </h2>
          <p className="text-xs md:text-sm text-teal-deep/75 leading-relaxed">
            Fill out our bulk inquiry form, and one of our dedicated corporate design specialists will get back to you within 2 business hours with digital catalogs and custom quotes.
          </p>
          <div className="space-y-3 pt-4">
            <div className="flex items-center space-x-3 text-xs text-teal-deep/75 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-rani-pink" />
              <span>Digital Mockups in 2 Hours</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-teal-deep/75 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-rani-pink" />
              <span>Bulk Order Pricing Breaks</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-teal-deep/75 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-rani-pink" />
              <span>Custom Curations Tailored to Themes</span>
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
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-deep/70">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Rishabh Arora"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-teal-deep/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-deep/70">Company Email</label>
                    <input
                      type="email"
                      required
                      placeholder="E.g. corporate@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-teal-deep/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-deep/70">Corporate Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="E.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-teal-deep/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-deep/70">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Nakshatra AI"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-teal-deep/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-deep/70">Estimated Quantity</label>
                    <select
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none text-teal-deep transition-all"
                    >
                      <option value="10-50">10 to 50 Hampers</option>
                      <option value="50-100">50 to 100 Hampers</option>
                      <option value="100-500">100 to 500 Hampers</option>
                      <option value="500+">500+ Hampers</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-deep/70">Budget Per Hamper</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none text-teal-deep transition-all"
                    >
                      <option value="Under ₹1500">Under ₹1,500</option>
                      <option value="₹1500 - ₹2500">₹1,500 to ₹2,500</option>
                      <option value="₹2500 - ₹4000">₹2,500 to ₹4,000</option>
                      <option value="₹4000+">₹4,000+ per Hamper</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-teal-deep/70">Customization Requirements</label>
                  <textarea
                    rows={4}
                    placeholder="Describe packaging colors, desired items, delivery timelines, or other custom branding needs..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-2xl px-4 py-3 text-xs focus:outline-none placeholder-teal-deep/30 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-teal-deep hover:bg-teal-deep/95 text-[#FFFDF5] rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <span>Submitting Project Details...</span>
                  ) : (
                    <>
                      <span>Submit Corporate Inquiry</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-teal-deep text-[#FFFDF5] p-8 rounded-3xl text-center space-y-4"
              >
                <div className="w-16 h-16 bg-saffron/10 border border-saffron/30 rounded-full flex items-center justify-center mx-auto text-saffron">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-bold">Inquiry Received!</h3>
                <p className="text-xs text-[#FFFDF5]/70 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-saffron">{formData.name}</strong>. We have logged your request for <strong className="text-[#FFFDF5]">{formData.company}</strong>. 
                  A corporate designer will email you catalog options within 2 business hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-semibold px-6 py-2.5 bg-[#FFFDF5] text-teal-deep rounded-full hover:bg-gold-light transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 7. FAQ Section (Accordion) */}
      <section className="max-w-4xl mx-auto space-y-8 text-left">
        <h2 className="font-heading text-3xl font-black text-teal-deep text-center">
          Corporate Gifting FAQs
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isActive = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-teal-deep/5 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isActive ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-sm font-bold text-teal-deep">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-teal-deep/50 transition-transform duration-300 ${
                      isActive ? "transform rotate-180 text-rani-pink" : ""
                    }`}
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-teal-deep/5"
                    >
                      <p className="p-6 text-xs text-teal-deep/70 leading-relaxed bg-[#FFFDF5]/40">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
