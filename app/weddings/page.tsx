"use client";

import React, { useState } from "react";
import { Sparkles, Heart, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WeddingGifting() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "Wedding Gifting", // default marker for DB
    quantity: "50-100",
    budget: "₹1500 - ₹2500",
    details: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          company: `Wedding: ${formData.company}`, // flag as wedding
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else {
        alert("Submission Failed: " + (data.error || "Please verify database connection."));
      }
    } catch (err: any) {
      alert("Network Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const favors = [
    {
      title: "Bridal Favors & Bridesmaid Boxes",
      desc: "Delight your bridal party with organic face mists, custom silk robes, gourmet macarons, and gold-engraved vanity mirrors.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80",
    },
    {
      title: "Save-The-Date & Invitation Gifts",
      desc: "Set the tone with rigid custom-foiled boxes containing artisanal dry sweets (mithai), organic saffron blends, and brass diyas.",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80",
    },
    {
      title: "Luxury Guest Welcomes",
      desc: "Place customizable copper glass sets, premium cashew tins, and herbal wellness room sprays in their hotel rooms upon check-in.",
      image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-24 text-left">
      {/* Hero Header */}
      <section className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-[#4A0E17] to-black text-[#FFFDF5] p-8 md:p-20 shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rani-pink/10 rounded-full blur-3xl" />
        
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF5]/10 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-saffron uppercase">
            <Heart className="w-3.5 h-3.5 text-rani-pink animate-pulse" />
            <span>Luxury Marriages & Favors</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black leading-tight">
            Exquisite Wedding <br />
            Favor Curation
          </h1>
          <p className="text-sm md:text-base text-[#FFFDF5]/75 leading-relaxed">
            Welcome your guests with warmth and sensory delight. We design custom guest-room drops, customized save-the-date invites, and premium bridesmaid hampers that reflect your heritage and style.
          </p>
        </div>
      </section>

      {/* Favors Grid */}
      <section className="space-y-12">
        <h2 className="font-heading text-3xl font-black text-teal-deep text-center">
          Our Special Wedding Curations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {favors.map((f, idx) => (
            <div
              key={idx}
              className="bg-white border border-teal-deep/5 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full"
            >
              <div className="aspect-[16/10] bg-teal-deep/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-teal-deep">{f.title}</h3>
                  <p className="text-xs text-teal-deep/65 leading-relaxed">{f.desc}</p>
                </div>
                <a href="#wedding-form" className="inline-flex items-center space-x-1 text-xs font-bold text-rani-pink hover:underline pt-4 mt-auto">
                  <span>Inquire for this Favor</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Form */}
      <section
        id="wedding-form"
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white/60 backdrop-blur-sm p-8 md:p-12 rounded-[40px] border border-teal-deep/5 shadow-sm relative overflow-hidden"
      >
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-1 bg-saffron/10 border border-saffron/20 px-3 py-1 rounded-full text-xs font-bold text-saffron uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult Wedding Curators</span>
          </div>
          <h2 className="font-heading text-3xl font-black text-teal-deep leading-tight">
            Design Your Marriage Favors
          </h2>
          <p className="text-xs md:text-sm text-teal-deep/75 leading-relaxed">
            Fill out your details, and a dedicated wedding gifting consultant will coordinate custom mockups, packaging designs, and pricing breaks for your celebrations.
          </p>
          <div className="space-y-3 pt-4">
            <div className="flex items-center space-x-3 text-xs text-teal-deep/75 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-rani-pink" />
              <span>Custom Monogram Engraving</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-teal-deep/75 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-rani-pink" />
              <span>Matching Ribbon Color Themes</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-teal-deep/75 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-rani-pink" />
              <span>Doorstep Hotel Guest Room Delivery</span>
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
                    <label className="text-xs font-bold text-teal-deep/70">Your Name</label>
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
                    <label className="text-xs font-bold text-teal-deep/70">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="E.g. hello@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-teal-deep/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-deep/70">Phone Number</label>
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
                    <label className="text-xs font-bold text-teal-deep/70">Wedding Date / Event Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. November 2026 / Vikram Weds Tanvi"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-teal-deep/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-deep/70">Estimated favor count</label>
                    <select
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none text-teal-deep transition-all"
                    >
                      <option value="50-100">50 to 100 boxes</option>
                      <option value="100-300">100 to 300 boxes</option>
                      <option value="300-500">300 to 500 boxes</option>
                      <option value="500+">500+ boxes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-teal-deep/70">Estimated Budget per box</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-xl px-4 py-3 text-xs focus:outline-none text-teal-deep transition-all"
                    >
                      <option value="Under ₹1500">Under ₹1,500</option>
                      <option value="₹1500 - ₹2500">₹1,500 to ₹2,500</option>
                      <option value="₹2500 - ₹4000">₹2,500 to ₹4,000</option>
                      <option value="₹4000+">₹4,000+ per box</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-teal-deep/70">Favors Customization Details</label>
                  <textarea
                    rows={4}
                    placeholder="Describe packaging themes, ribbon bows, item preferences (mithai, candles, copper tumblers), or shipping logistics..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full bg-[#FFFDF5] border border-teal-deep/15 focus:border-rani-pink/40 focus:ring-1 focus:ring-rani-pink/20 rounded-2xl px-4 py-3 text-xs focus:outline-none placeholder-teal-deep/30 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-teal-deep hover:bg-teal-deep/95 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <span>Submitting Wedding Favors Brief...</span>
                  ) : (
                    <>
                      <span>Submit Gifting Request</span>
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
                className="bg-teal-deep text-white p-8 rounded-3xl text-center space-y-4"
              >
                <div className="w-16 h-16 bg-saffron/10 border border-saffron/30 rounded-full flex items-center justify-center mx-auto text-saffron">
                  <Heart className="w-8 h-8 text-rani-pink fill-rani-pink animate-pulse" />
                </div>
                <h3 className="font-heading text-2xl font-bold">Inquiry Logged!</h3>
                <p className="text-xs text-[#FFFDF5]/70 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-saffron">{formData.name}</strong>. We have logged your wedding favors brief. 
                  A dedicated wedding consultant will reach out via WhatsApp/email within 2 business hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-semibold px-6 py-2.5 bg-[#FFFDF5] text-teal-deep rounded-full hover:bg-gold-light transition-colors"
                >
                  Submit Another Wedding Request
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
