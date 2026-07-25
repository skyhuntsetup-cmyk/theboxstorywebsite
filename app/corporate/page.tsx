"use client";

import React, { useState } from "react";
import { Briefcase, Building, Gift, CheckCircle2, ChevronRight, MessageSquare, Sparkles } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const services = [
    {
      icon: Building,
      title: "Corporate Logo Branding",
      desc: "Customize the rigid box exterior, thank you card, and ribbons with your company logo and brand hex colors.",
    },
    {
      icon: Gift,
      title: "Flexible Hampers Curations",
      desc: "Choose from tech items, wellness kits, gourmet treats, or customized copper drinkware tailored for clients and employees.",
    },
    {
      icon: MessageSquare,
      title: "Direct Doorstep Shipping",
      desc: "Send bulk shipments directly to one warehouse or distribute individual items directly to employees' home addresses.",
    },
  ];

  const clients = [
    "Google", "Microsoft", "Zomato", "Uber", "CRED", "Tata Consultancy Services"
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-24">
      {/* 1. Page Header Hero */}
      <section className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-teal-deep to-[#031d1d] text-[#FFFDF5] p-8 md:p-20 shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rani-pink/5 rounded-full blur-3xl" />
        
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF5]/10 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-saffron uppercase">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Premium B2B Partnerships</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black leading-tight">
            Corporate Gifting, <br />
            Elevated
          </h1>
          <p className="text-sm md:text-base text-[#FFFDF5]/75 leading-relaxed">
            Delight your employees, partners, and high-value clients with our premium customized rigid hamper boxes. Custom branding, premium items, and seamless bulk distribution.
          </p>
        </div>
      </section>

      {/* 2. Client Logo Marquee */}
      <section className="space-y-6">
        <h3 className="text-center text-xs font-bold uppercase tracking-widest text-teal-deep/55">
          Trusted by Industry Leaders
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

      {/* 3. Branding Customization & Services */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-teal-deep/5 p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-saffron/5 rounded-full translate-x-8 -translate-y-8 transition-transform group-hover:scale-110" />
            <div className="w-12 h-12 bg-teal-deep/5 rounded-2xl flex items-center justify-center text-teal-deep group-hover:bg-rani-pink group-hover:text-[#FFFDF5] transition-colors">
              <srv.icon className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-teal-deep">{srv.title}</h3>
            <p className="text-xs text-teal-deep/60 leading-relaxed">{srv.desc}</p>
          </div>
        ))}
      </section>

      {/* 4. Inquiry Form Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white/60 backdrop-blur-sm p-8 md:p-12 rounded-[40px] border border-teal-deep/5 shadow-sm relative overflow-hidden">
        {/* Left Side Info */}
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

        {/* Right Side Form */}
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
    </div>
  );
}
