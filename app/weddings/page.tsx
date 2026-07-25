"use client";

import React, { useState } from "react";
import { Sparkles, Heart, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-b from-[#380108] via-[#1f0004] to-black text-[#FFFDF5] py-12 px-6 relative overflow-hidden text-left">
      {/* Background floral mandala mandala shadows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl filter animate-pulse -z-10" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-rani-pink/5 rounded-full blur-3xl filter animate-pulse -z-10" />

      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Banner Section: Royal Maharaja Theme */}
        <section className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-[#52020e] via-[#380108] to-[#120002] p-8 md:p-20 shadow-2xl border border-gold/15">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/10 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF5]/10 border border-gold/25 px-4 py-2 rounded-full text-xs font-bold tracking-widest text-gold uppercase">
              <Heart className="w-3.5 h-3.5 text-rani-pink fill-rani-pink animate-pulse" />
              <span>Royal Indian Weddings</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-gold leading-tight tracking-tight">
              Heritage Gifting <br />
              <span className="text-white italic font-normal font-serif">&amp; Custom Favors</span>
            </h1>
            <div className="w-20 h-0.5 bg-gold" />
            <p className="text-xs sm:text-sm text-[#FFFDF5]/75 leading-relaxed">
              Unfold royal greetings for your wedding guests. Hand-dyed rigid boxes, customized wax-seal card letters, and dry sweets wrapped in silk.
            </p>
            <div className="pt-2">
              <a
                href="#wedding-form"
                className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-light text-[#380108] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
              >
                <span>Consult Wedding Designers</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Favors Showcase Grid */}
        <section className="space-y-12">
          <div className="space-y-3 text-center">
            <h2 className="font-heading text-3xl font-black text-gold">Exclusive Ceremonial Favors</h2>
            <p className="text-xs text-[#FFFDF5]/60 max-w-md mx-auto leading-relaxed">
              Every package is crafted to honor traditional heritage while delivering modern tactile unboxing sensations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {favors.map((f, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col h-full hover:border-gold/15 transition-all"
              >
                <div className="aspect-[16/10] bg-white/5 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#380108]/20" />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg font-bold text-gold">{f.title}</h3>
                    <p className="text-xs text-[#FFFDF5]/70 leading-relaxed">{f.desc}</p>
                  </div>
                  <a href="#wedding-form" className="inline-flex items-center space-x-1 text-xs font-bold text-gold hover:underline pt-4 mt-auto">
                    <span>Inquire for this Favor</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wedding Brief Form */}
        <section
          id="wedding-form"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-gradient-to-br from-[#47010a] to-[#240003] p-8 md:p-12 rounded-[40px] border border-gold/15 shadow-2xl relative overflow-hidden"
        >
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-1.5 bg-[#FFFDF5]/5 border border-gold/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-gold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gifting Consultants</span>
            </div>
            <h2 className="font-heading text-3xl font-black text-gold leading-tight">
              Brief our Gifting Artisans
            </h2>
            <p className="text-xs md:text-sm text-[#FFFDF5]/75 leading-relaxed">
              Design a custom visual favor package. Submit your details to unlock customized pricing breaks and box mockups.
            </p>
            <div className="space-y-3 pt-4 text-xs text-[#FFFDF5]/85">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Custom Gold Foil Monograms</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Kashmiri saffron & dry sweets pairing</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-gold" />
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
                      <label className="text-xs font-bold text-gold/80">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Rishabh Arora"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-gold/15 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-white/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gold/80">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="hello@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-gold/15 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-white/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gold/80">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-gold/15 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-white/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gold/80">Wedding Date / Event Name</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Nov 2026 / Vikram Weds Tanvi"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-white/5 border border-gold/15 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-white/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gold/80">Estimated Favor Count</label>
                      <select
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full bg-[#380108] border border-gold/15 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-xs focus:outline-none text-gold transition-all"
                      >
                        <option value="50-100">50 to 100 boxes</option>
                        <option value="100-300">100 to 300 boxes</option>
                        <option value="300-500">300 to 500 boxes</option>
                        <option value="500+">500+ boxes</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gold/80">Estimated Budget Per Box</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-[#380108] border border-gold/15 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-xs focus:outline-none text-gold transition-all"
                      >
                        <option value="Under ₹1500">Under ₹1,500</option>
                        <option value="₹1500 - ₹2500">₹1,500 to ₹2,500</option>
                        <option value="₹2500 - ₹4000">₹2,500 to ₹4,000</option>
                        <option value="₹4000+">₹4,000+ per box</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gold/80">Favors Customization Details</label>
                    <textarea
                      rows={4}
                      placeholder="Describe wedding colors, packaging shapes, sweet preferences (kaju katli, almond brittle), or guest drop details..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full bg-white/5 border border-gold/15 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 rounded-2xl px-4 py-3 text-xs focus:outline-none placeholder-white/30 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 py-4 bg-gold hover:bg-gold-light text-[#380108] rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? "Logging Gifting Project..." : "Submit Wedding Request"}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold text-[#380108] p-8 rounded-3xl text-center space-y-4 shadow-xl"
                >
                  <div className="w-16 h-16 bg-[#380108]/10 border border-[#380108]/20 rounded-full flex items-center justify-center mx-auto text-[#380108]">
                    <Heart className="w-8 h-8 fill-current animate-pulse" />
                  </div>
                  <h3 className="font-heading text-2xl font-black">Inquiry Logged!</h3>
                  <p className="text-xs text-[#380108]/80 max-w-sm mx-auto leading-relaxed">
                    Thank you, your wedding favor brief is logged. 
                    A dedicated wedding consultant will reach out via WhatsApp/email within 2 business hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-bold px-6 py-2.5 bg-[#380108] text-gold rounded-full hover:bg-[#380108]/90 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
