"use client";

import React from "react";
import Link from "next/link";
import { 
  Gift, Sparkles, Building2, Heart, Award, ShieldCheck, Leaf, Compass, ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";
import { useSiteContent } from "../../lib/siteContent";
import { revealProps, staggerContainer, staggerItem } from "../../lib/motion";

export default function About() {
  const { getContent } = useSiteContent();
  const heroBadge = getContent("about.hero.badge", "OUR MISSION & VALUES");
  const heroBody = getContent(
    "about.hero.body",
    "The Box Story was founded to transform gifting from a simple transaction into a meaningful, curated experience."
  );
  const storyImage = getContent(
    "about.story.image",
    "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80"
  );
  const services = [
    {
      icon: Gift,
      title: "Build-a-Box Studio",
      desc: "Our interactive builder lets you select rigid boxes, premium treats, and personalized calligraphy cards to design a completely custom gift.",
      link: "/build"
    },
    {
      icon: Sparkles,
      title: "Pre-Curated Collections",
      desc: "Ready-to-ship themed gift boxes meticulously curated by our designers for Diwali, Weddings, Anniversaries, and Birthdays.",
      link: "/collections"
    },
    {
      icon: Building2,
      title: "Corporate Swag & Gifting",
      desc: "Custom branded swag kits, employee welcome boxes, and high-end client appreciation hampers personalized with your corporate logo.",
      link: "/corporate"
    },
    {
      icon: Heart,
      title: "Luxury Wedding Invitations",
      desc: "Exquisite wedding invite boxes containing traditional sweets, custom dry fruit jars, and hand-painted keepsakes that leave a lasting first impression.",
      link: "/weddings"
    }
  ];

  const pillars = [
    {
      icon: Compass,
      title: "Deep Personalization",
      desc: "We believe in deep customization over generic solutions. From custom-engraved wooden box lids and monogrammed leather accessories to hand-written calligraphed cards, every detail is tailored."
    },
    {
      icon: Award,
      title: "Artisanal Craftsmanship",
      desc: "By partnering with local Rajasthan artists, woodcarvers, potters, and candle makers, we ensure each hamper contains unique items made with a human touch."
    },
    {
      icon: Leaf,
      title: "Eco-Conscious Luxury",
      desc: "Luxury doesn't have to cost the planet. We use reusable pinewood slider boxes, biodegradable papers, organic ingredients, and zero-plastic packaging options."
    },
    {
      icon: ShieldCheck,
      title: "Curation Quality",
      desc: "No fillers. We taste-test every confectionery, test the burn-time of every candle, and select premium items so that your gift represents the highest standard of craftsmanship."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-slate-800 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Editorial Hero Header */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative rounded-[40px] overflow-hidden bg-white border border-slate-200 p-8 md:p-20 shadow-sm text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-100/50 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FAF4E8]/60 rounded-full blur-3xl -z-10" />

          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="text-[12px] tracking-widest font-black uppercase text-saffron bg-saffron/10 border border-saffron/15 px-3 py-1.5 rounded-full inline-block">
              {heroBadge}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-light text-slate-900 leading-tight">
              Gifts are not remembered for <br />
              Their price, but for the way they <br />
              <span className="font-black italic text-slate-700">make someone feel</span>.
            </h1>
            <p className="text-xs sm:text-sm text-slate-650 leading-relaxed max-w-lg">
              {heroBody}
            </p>
          </div>
        </motion.section>

        {/* What We Are / Our Story */}
        <motion.section {...revealProps} className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6 text-left">
            <span className="text-[12px] font-bold text-rani-pink uppercase tracking-widest bg-rani-pink/5 px-2.5 py-1 rounded-full inline-block border border-rani-pink/10">
              The Box Story Genesis
            </span>
            <h2 className="font-heading text-3xl font-black text-slate-900 leading-tight">
              Rooted in Heritage, <br />
              Designed for Celebrations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Based in the cultural hub of **New Delhi** and Jaipur, **The Box Story** emerged from a desire to blend traditional Indian craftsmanship with clean, modern aesthetics. We watched people struggle to find high-end gifts that didn&apos;t feel generic, mass-produced, or cheap.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We set out to partner with Rajasthan&apos;s finest woodcarvers, potters, organic farmers, and artisanal candle makers. Today, we deliver custom hand-crafted hampers across India, providing one-day express delivery in Jaipur for moments that can&apos;t wait.
            </p>
          </div>
          <div className="md:col-span-5 relative aspect-square rounded-[36px] overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={storyImage}
              alt="Curated gift packaging details"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.section>

        {/* Core Pillars / What We Believe In */}
        <section className="space-y-10">
          <motion.div {...revealProps} className="text-center space-y-3">
            <span className="text-[12px] font-bold text-teal-deep uppercase tracking-widest bg-teal-deep/5 px-2.5 py-1 rounded-full inline-block">
              OUR PILLARS
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-black text-slate-900">How We Do Gifting Differently</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our philosophy is anchored in four core values that ensure every box leaves a lasting impression.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
          >
            {pillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="w-12 h-12 bg-slate-50 text-slate-700 border border-slate-200/60 rounded-2xl flex items-center justify-center group-hover:bg-teal-deep group-hover:text-white group-hover:border-teal-deep transition-all">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Our Services / What We Offer */}
        <section className="space-y-10 bg-white border border-slate-250/50 rounded-[40px] p-8 md:p-14 shadow-sm">
          <motion.div {...revealProps} className="text-center space-y-3">
            <span className="text-[12px] font-bold text-rani-pink uppercase tracking-widest bg-rani-pink/5 px-2.5 py-1 rounded-full inline-block">
              SERVICES
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-black text-slate-900">Our Curated Services</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Whether you are planning a corporate campaign, a wedding invite, or a personal birthday gesture, we have you covered.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                className="border-b border-slate-100 last:border-b-0 md:border-b-0 pb-6 md:pb-0 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center text-slate-700">
                    <service.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900">{service.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{service.desc}</p>
                </div>
                <div className="pt-2">
                  <Link
                    href={service.link}
                    className="inline-flex items-center text-xs font-bold text-teal-deep hover:text-saffron transition-colors group"
                  >
                    <span>Explore service</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* High-end CTA Section */}
        <motion.section {...revealProps} className="rounded-[40px] bg-teal-deep text-white p-8 md:p-16 text-center space-y-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/10 rounded-full blur-3xl -z-10" />
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-[12px] tracking-widest font-black uppercase text-saffron bg-saffron/10 px-3.5 py-1.5 rounded-full inline-block border border-saffron/20">
              CREATE A MEMORY
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-light leading-tight">
              Ready to send a gift that <br />
              <span className="font-black italic text-saffron">tells your story?</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-md mx-auto">
              Choose from our pre-curated sets or enter our custom studio to pick custom wood trays, greeting tags, and gourmet dry fruits.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/build"
                className="bg-saffron hover:bg-saffron/95 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow"
              >
                Build custom box
              </Link>
              <Link
                href="/collections"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-white/20"
              >
                Browse catalog
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
