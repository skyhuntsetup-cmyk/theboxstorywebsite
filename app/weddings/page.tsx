"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Heart, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { revealProps, staggerContainer, staggerItem } from "../../lib/motion";

export default function WeddingGifting() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "Wedding Gifting", 
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
          company: `Wedding: ${formData.company}`, 
        }),
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
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 py-10 px-6 relative overflow-hidden text-left">
      {/* Background floral mandala shadows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-amber-100 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-rose-50 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Banner Section: Royal Maharaja Cream-Gold Theme */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-amber-50 via-background to-rose-50 p-8 md:p-20 shadow-sm border border-amber-200"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-100 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-1.5 bg-background border border-amber-250 px-4 py-2 rounded-full text-xs font-bold tracking-widest text-amber-950 uppercase shadow-sm">
              <Heart className="w-3.5 h-3.5 text-rani-pink fill-rani-pink animate-pulse" />
              <span>Royal Indian Weddings</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-amber-950 leading-tight tracking-tight">
              Heritage Gifting <br />
              <span className="text-rani-pink italic font-normal font-serif">&amp; Custom Favors</span>
            </h1>
            <div className="w-20 h-0.5 bg-amber-950" />
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Unfold royal greetings for your wedding guests. Hand-dyed rigid boxes, customized wax-seal card letters, and dry sweets wrapped in silk.
            </p>
            <div className="pt-2">
              <a
                href="#wedding-form"
                className="inline-flex items-center space-x-2 bg-amber-950 hover:bg-amber-900 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
              >
                <span>Consult Wedding Designers</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* Favors Showcase Grid */}
        <section className="space-y-10">
          <motion.div {...revealProps} className="space-y-3 text-center">
            <h2 className="font-heading text-3xl font-black text-amber-950">Exclusive Ceremonial Favors</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Every package is crafted to honor traditional heritage while delivering modern tactile unboxing sensations.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {favors.map((f, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -5 }}
                className="bg-white border border-slate-205 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full hover:border-amber-300 transition-all"
              >
                <div className="aspect-[16/10] bg-slate-50 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg font-bold text-amber-950">{f.title}</h3>
                    <p className="text-xs text-slate-650 leading-relaxed">{f.desc}</p>
                  </div>
                  <a href="#wedding-form" className="inline-flex items-center space-x-1 text-xs font-bold text-amber-900 hover:underline pt-4 mt-auto">
                    <span>Inquire for this Favor</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Wedding Essentials CTA */}
        <motion.div
          {...revealProps}
          className="bg-amber-950 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Wedding Essentials</span>
            </span>
            <h3 className="font-heading text-2xl font-black text-white">Invites, Stationery &amp; Return Favours</h3>
            <p className="text-xs text-amber-100/70 max-w-md">Browse our ready-to-order collection for every touchpoint of your celebration.</p>
          </div>
          <Link
            href="/store/wedding-essentials"
            className="inline-flex items-center space-x-2 bg-white hover:bg-amber-50 text-amber-950 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex-shrink-0"
          >
            <span>Browse the Collection</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Wedding Brief Form */}
        <motion.section
          {...revealProps}
          id="wedding-form"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white p-8 md:p-12 rounded-[40px] border border-amber-200 shadow-sm relative overflow-hidden"
        >
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-1.5 bg-[#FAF9F5] border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-900 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Gifting Consultants</span>
            </div>
            <h2 className="font-heading text-3xl font-black text-amber-950 leading-tight">
              Brief our Gifting Artisans
            </h2>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              Design a custom visual favor package. Submit your details to unlock customized pricing breaks and box mockups.
            </p>
            <div className="space-y-3 pt-4 text-xs text-slate-600 font-semibold">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                <span>Custom Gold Foil Monograms</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                <span>Kashmiri saffron & dry sweets pairing</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                <span>Direct hotel guest coordinates shipping</span>
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
                      <label className="text-xs font-bold text-slate-600">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Rishabh Arora"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-slate-400 transition-all text-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="hello@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-slate-400 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-slate-400 transition-all text-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Wedding Date / Event Name</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Nov 2026 / Vikram Weds Tanvi"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-slate-400 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Estimated Favor Count</label>
                      <select
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 rounded-xl px-4 py-3 text-xs focus:outline-none text-slate-700 transition-all"
                      >
                        <option value="50-100">50 to 100 boxes</option>
                        <option value="100-300">100 to 300 boxes</option>
                        <option value="300-500">300 to 500 boxes</option>
                        <option value="500+">500+ boxes</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600">Estimated Budget Per Box</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 rounded-xl px-4 py-3 text-xs focus:outline-none text-slate-700 transition-all"
                      >
                        <option value="Under ₹1500">Under ₹1,500</option>
                        <option value="₹1500 - ₹2500">₹1,500 to ₹2,500</option>
                        <option value="₹2500 - ₹4000">₹2,500 to ₹4,000</option>
                        <option value="₹4000+">₹4,000+ per box</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">Favors Customization Details</label>
                    <textarea
                      rows={4}
                      placeholder="Describe wedding colors, packaging shapes, sweet preferences (kaju katli, almond brittle), or guest drop details..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 rounded-2xl px-4 py-3 text-xs focus:outline-none placeholder-slate-400 transition-all resize-none text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 py-4 bg-amber-950 hover:bg-amber-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? "Logging Gifting Project..." : "Submit Wedding Request"}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-950 text-white p-8 rounded-3xl text-center space-y-4 shadow-xl"
                >
                  <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto text-gold">
                    <Heart className="w-8 h-8 fill-current animate-pulse" />
                  </div>
                  <h3 className="font-heading text-2xl font-black">Inquiry Logged!</h3>
                  <p className="text-xs text-slate-350 max-w-sm mx-auto leading-relaxed">
                    Thank you, your wedding favor brief is logged. 
                    A dedicated wedding consultant will reach out via WhatsApp/email within 2 business hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-bold px-6 py-2.5 bg-white text-amber-950 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
