"use client";

import React from "react";
import { Heart, Sparkles, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Artisanal Integrity",
      desc: "We partner directly with local clay potters, brass engravers, and organic tea farmers across India, ensuring fair trade and premium quality.",
    },
    {
      icon: Sparkles,
      title: "Sensory Unboxing",
      desc: "From the rigid gold-foiled exterior to the scent of organic lavender candles, our hampers are designed to engage all five senses.",
    },
    {
      icon: ShieldCheck,
      title: "Effortless Gifting",
      desc: "Our customized studio and Magical Links remove shipping coordinates friction, letting you send premium hampers in two clicks.",
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
            Crafting Gifting <br />
            Experiences
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            The Box Story was born out of a desire to replace corporate cardboard boxes and sterile gift hampers with luxurious, sensory unboxing experiences. 
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-heading text-3xl font-black text-teal-deep leading-tight">
            Curated in Jaipur, <br />
            Delivered Worldwide
          </h2>
          <p className="text-sm text-slate-650 leading-relaxed">
            Every hamper starts as a sketch in our Jaipur design studio. We select custom textured papers, order hand-engraved copper and brass relics, and pair them with gourmet sweets prepared by third-generation sweetmakers.
          </p>
          <p className="text-sm text-slate-650 leading-relaxed">
            Our strict 5-item capacity rule ensures that every single box is packed cleanly, wrapped with premium satin ribbons, and padded with decorative paper shreds.
          </p>
        </div>
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-teal-deep/5 border border-slate-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80"
            alt="Artisanal Hamper Packing"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-12">
        <h2 className="font-heading text-3xl font-black text-teal-deep text-center">
          What Guides Our Hands
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
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
