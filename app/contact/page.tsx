"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Customer Support",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "Customer Support", message: "" });
    }, 1200);
  };

  const contactOptions = [
    {
      icon: Mail,
      label: "Support Email",
      value: "sayhi@theboxstory.co.in",
      desc: "For orders, custom builds, or claim links.",
    },
    {
      icon: Phone,
      label: "Call or WhatsApp",
      value: "+91 78387 83488 / +91 97179 99223",
      desc: "Mon-Sat, 10:00 AM - 7:00 PM IST.",
    },
    {
      icon: MapPin,
      label: "Based In",
      value: "New Delhi, India",
      desc: "One-day delivery available in Jaipur.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-16 text-left">
      {/* Page Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-1.5 bg-saffron/10 border border-saffron/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-saffron uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Connect with Us</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-teal-deep">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-teal-deep/75 leading-relaxed">
          Need support with a claim link, bulk ordering for weddings, or custom corporate branding? Our design specialist team is here to assist.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          {contactOptions.map((opt, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex space-x-4 items-start"
            >
              <div className="p-3 bg-teal-deep/5 rounded-xl text-teal-deep">
                <opt.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-teal-deep/50 uppercase tracking-wide">
                  {opt.label}
                </h4>
                <p className="text-sm font-bold text-teal-deep">{opt.value}</p>
                <p className="text-xs text-teal-deep/60">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Message Form */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-sm">
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
                    <label className="text-xs font-bold text-teal-deep/70">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Rishabh Arora"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-background border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-deep/70">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="E.g. hello@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-background border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-deep/70">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none text-teal-deep focus:border-rani-pink/40"
                  >
                    <option value="Customer Support">Customer Support / Order Help</option>
                    <option value="Wedding Query">Wedding Gifting Inquiry</option>
                    <option value="Corporate Bulk">Corporate Bulk Order Inquiry</option>
                    <option value="Artisan Pitch">Artisan Partnership Proposal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-deep/70">Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your query or custom request here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-teal-deep hover:bg-teal-deep/95 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4 text-teal-deep"
              >
                <div className="w-16 h-16 bg-saffron/10 border border-saffron/30 rounded-full flex items-center justify-center mx-auto text-saffron">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-bold">Message Sent!</h3>
                <p className="text-xs text-teal-deep/70 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. We have logged your query and our support team will reply within 12 business hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-semibold px-6 py-2.5 bg-teal-deep text-[#FAF4E8] rounded-full hover:bg-teal-deep/90 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
