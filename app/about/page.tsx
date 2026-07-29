"use client";

import React from "react";
import { Gift, Sparkles, Users, Building2, Heart } from "lucide-react";

export default function About() {
  const services = [
    {
      icon: Gift,
      title: "Personalized Gift Hampers",
      desc: "Hampers built around the person you're gifting to, for birthdays, anniversaries, Valentine's Day, Rakhi, weddings, and new moms.",
    },
    {
      icon: Sparkles,
      title: "Pre-Curated Gift Hampers",
      desc: "Ready-to-send collections for when you want something thoughtful without starting from scratch.",
    },
    {
      icon: Building2,
      title: "Corporate Gifting Hampers",
      desc: "Bulk and branded gifting for teams, clients, and employee milestones.",
    },
    {
      icon: Heart,
      title: "Wedding Invitation Hampers",
      desc: "Hampers designed to accompany wedding invitations and make the first impression count.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-24 text-left">
      {/* Hero Header: Seamless Warm Light Gradient */}
      <section className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-amber-50 via-background to-rose-50 text-slate-800 p-8 md:p-20 shadow-sm border border-amber-200">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rani-pink/5 rounded-full blur-3xl" />

        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-background border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-saffron uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>Our Story</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-teal-deep leading-tight">
            To Help You Create <br />
            Wonderful Stories
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Looking for the perfect gift for a loved one, family member, or colleague? Explore our collections to discover hampers that are sure to bring a smile to their face. If you can&apos;t find exactly what you need, reach out and we&apos;ll help you craft the ideal gift.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-heading text-3xl font-black text-teal-deep leading-tight">
            Something for <br />
            Every Occasion
          </h2>
          <p className="text-sm text-slate-650 leading-relaxed">
            From birthdays and anniversaries to Valentine&apos;s Day, Rakhi, weddings, new moms, and housewarmings — we build personalized hampers around the occasion and the person, not the other way around.
          </p>
          <p className="text-sm text-slate-650 leading-relaxed">
            We&apos;re based in New Delhi, with one-day delivery available in Jaipur, and we ship gifts across India for the moments that matter.
          </p>
        </div>
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-teal-deep/5 border border-slate-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80"
            alt="Curated gift hamper"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Vision */}
      <section className="rounded-[32px] bg-teal-deep text-[#FAF4E8] p-8 md:p-14 text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-saffron">Our Vision</p>
        <p className="font-heading text-xl md:text-2xl font-bold leading-snug max-w-3xl mx-auto">
          To revolutionize the art of gifting by creating personalized and memorable experiences that celebrate life&apos;s special moments.
        </p>
      </section>

      {/* Services */}
      <section className="space-y-12">
        <h2 className="font-heading text-3xl font-black text-teal-deep text-center">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((val, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="w-12 h-12 bg-teal-deep/5 rounded-2xl flex items-center justify-center text-teal-deep group-hover:bg-rani-pink group-hover:text-[#FAF4E8] transition-colors">
                <val.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-teal-deep">{val.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
