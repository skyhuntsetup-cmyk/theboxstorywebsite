"use client";

import React, { useState } from "react";
import { 
  Briefcase, Building, Gift, CheckCircle2, ChevronRight, MessageSquare, 
  Sparkles, Users, Award, Percent, Globe, Laptop, HelpCircle 
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
    } catch (err: any) {
      alert("Network Error: " + err.message);
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
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
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

        {/* Inquiries Form Section */}
        <section id="brief-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm text-left">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wider">
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
                      <label className="text-xs font-bold text-slate-600">Your Name</label>
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
                      <label className="text-xs font-bold text-slate-600">Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="CRED / TATA"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Work Email</label>
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
                      <label className="text-xs font-bold text-slate-600">Contact Phone</label>
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
