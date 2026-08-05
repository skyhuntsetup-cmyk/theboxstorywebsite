"use client";

import React from "react";
import Link from "next/link";
import {
  Laptop, CheckCircle2,
  ArrowRight, Sparkles, Send, Database, BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { revealProps, staggerContainer, staggerItem } from "../../../lib/motion";

export default function ClientPanelPage() {
  const steps = [
    {
      icon: Database,
      title: "1. Generate Voucher Tokens",
      desc: "HR managers generate unique claims passcodes (e.g., CRED-DIWALI-500) inside our admin dashboard or upload an employee roster.",
    },
    {
      icon: Laptop,
      title: "2. Custom Branded Hubs",
      desc: "We spin up a custom claimant page with your logo, corporate colors, and curated unboxing greetings (e.g., google.theboxstory.in).",
    },
    {
      icon: Sparkles,
      title: "3. Choose Favors & Sizing",
      desc: "Recipient enters their token, plays the virtual unboxing animation, and selects preferred treats, clothing sizes, or color presets.",
    },
    {
      icon: Send,
      title: "4. Direct Doorstep Delivery",
      desc: "Address credentials write directly to our courier integration. Gifts ship directly to employees, eliminating local storage overhead.",
    },
  ];

  const dashboardFeatures = [
    "Real-time token redemption tracking",
    "Employee shipping address exports (Excel/CSV)",
    "Size distribution reports for apparel kits",
    "Budget allocation and spending margins console",
    "Post-delivery rating metrics and feedbacks",
  ];

  return (
    <div className="min-h-screen bg-background text-slate-800 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12 text-left">
        
        {/* Breadcrumbs */}
        <div className="text-xs space-x-2 text-slate-400">
          <Link href="/" className="hover:text-teal-deep">Home</Link>
          <span>/</span>
          <Link href="/corporate" className="hover:text-teal-deep">Corporate Gifting</Link>
          <span>/</span>
          <span className="text-slate-650 font-bold">Client Panel</span>
        </div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-1.5 bg-saffron/10 border border-saffron/20 px-3 py-1 rounded-full text-xs font-bold text-saffron uppercase">
            <Laptop className="w-3.5 h-3.5" />
            <span>Digital Claiming Solutions</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-teal-deep leading-tight">
            Client Portal & <br />
            <span className="text-rani-pink">Employee Claim Panels</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-650 leading-relaxed max-w-2xl font-light">
            Remove the logistical headache from B2B gifting. Our client panels allow employee claiming, address validations, and sizing collections without spreadsheets.
          </p>
        </motion.section>

        {/* How It Works Step Grid */}
        <section className="space-y-8">
          <motion.h2 {...revealProps} className="font-heading text-2xl font-black text-teal-deep">The Portal Workflow</motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            {steps.map((step, idx) => (
              <motion.div key={idx} variants={staggerItem} whileHover={{ y: -4 }} className="bg-white border border-slate-200 p-8 rounded-3xl space-y-4 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-deep/5 rounded-xl flex items-center justify-center text-teal-deep">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-teal-deep">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Branded Features Visual Block */}
        <motion.section {...revealProps} className="bg-white border border-slate-200 p-8 md:p-12 rounded-[40px] shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <h2 className="font-heading text-2xl font-black text-teal-deep leading-tight">
              Branded Claims Simulator
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              When employees visit your panel, they experience a customized unboxing simulation complete with confetti explosions, custom messages from the CEO, and interactive visual cards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Upload Brand Logos</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Corporate Hex Colors</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Virtual Confetti Blowouts</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Cursive greeting note cards</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 bg-background border border-slate-200 p-6 rounded-3xl space-y-4">
            <span className="text-[11px] font-bold text-teal-deep/45 uppercase tracking-widest block border-b border-teal-deep/5 pb-2">Panel Preview</span>
            <div className="space-y-2 text-xs">
              <div className="h-6 w-24 bg-teal-deep/10 rounded" />
              <div className="h-8 w-full bg-teal-deep/5 rounded" />
              <div className="h-20 w-full border border-dashed border-teal-deep/15 rounded flex items-center justify-center text-[12px] text-teal-deep/40 font-semibold">
                [ CEO Message Greeting ]
              </div>
              <div className="h-8 w-full bg-rani-pink rounded-xl text-white font-bold flex items-center justify-center text-[12px] uppercase shadow-sm">
                Unbox Custom Hamper
              </div>
            </div>
          </div>
        </motion.section>

        {/* Admin Dashboard / Analytics section */}
        <motion.section {...revealProps} className="space-y-6">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-saffron/10 rounded-xl text-saffron">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-2xl font-black text-teal-deep">HR & Admin Management Console</h2>
          </div>
          <p className="text-xs text-slate-650 leading-relaxed">
            Your human resources and administration team gets direct credentials to monitor the onboarding or festive gifts campaigns live:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboardFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 bg-saffron rounded-full mt-1.5 flex-shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* CTA section */}
        <motion.section {...revealProps} className="bg-gradient-to-br from-amber-50 via-background to-rose-50 border border-amber-200 rounded-[40px] p-8 md:p-12 text-center space-y-6">
          <h3 className="font-heading text-2xl font-black text-teal-deep">
            Ready to set up your Claimant Portal?
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            We configure corporate claiming panels in under 24 hours. Contact our accounts desk to log your project requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/corporate#brief-form"
              className="inline-flex items-center justify-center space-x-1.5 bg-teal-deep hover:bg-teal-deep/90 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow"
            >
              <span>Request Portal Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/claim-token"
              className="inline-flex items-center justify-center border border-teal-deep hover:bg-teal-deep/5 text-teal-deep px-6 py-3 rounded-xl font-bold text-xs uppercase transition-colors"
            >
              <span>Test claim-token Flow</span>
            </Link>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
