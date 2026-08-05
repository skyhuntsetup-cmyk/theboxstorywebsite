"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Sparkles, Gift, ShieldCheck, 
  Truck, Award, Heart, Layers, Laptop, PenTool, 
  ExternalLink, CheckCircle2, ChevronRight, HelpCircle, Users
} from "lucide-react";
import { motion } from "framer-motion";

export default function CorporateProfilePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF4E8] text-slate-800">
      
      {/* 1. HERO SECTION: Editorial & Luxury Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FAF4E8] via-[#FCFAF2] to-[#FAF4E8] py-14 px-6 md:px-12 border-b border-[#042F2E]/10 text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <Link href="/corporate" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-teal-deep transition-colors mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Corporate Home</span>
            </Link>
            <div className="inline-flex items-center space-x-2 bg-saffron/10 border border-saffron/25 px-4 py-2 rounded-full text-xs font-bold text-saffron uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Official B2B Profile</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black text-teal-deep leading-[1.05] tracking-tight">
              Thoughtful Curation <br />
              For Your <span className="text-rani-pink italic font-serif font-normal">Business Relations</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-650 leading-relaxed max-w-xl font-light">
              We translate appreciation into tangible sensory unboxing experiences. High-end customized hampers, sustainable boxes, and bespoke branding crafted to leave a lasting professional impression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#brief-form"
                className="inline-flex items-center justify-center space-x-2 bg-teal-deep hover:bg-teal-deep/95 text-[#FAF4E8] px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Brief our Styling team</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="/corporate/catalog?file=The%20Box%20Story%20-%20Corporate%20Gifting%20Profile.pdf"
                target="_blank"
                className="inline-flex items-center justify-center space-x-2 bg-[#FCFAF2] hover:bg-[#FAF4E8] text-teal-deep border border-[#042F2E]/10 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Download PDF Deck</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl -z-10" />
            <div className="relative border border-[#042F2E]/10 bg-[#FCFAF2]/80 p-6 md:p-8 rounded-[36px] shadow-[0_8px_30px_rgba(4,47,46,0.02)] space-y-6">
              <div className="flex justify-between items-center border-b border-[#042F2E]/10 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">The Box Story Legacy</span>
                <span className="text-xs font-bold text-saffron bg-saffron/10 px-2.5 py-1 rounded-md border border-saffron/20">EST. 2020</span>
              </div>
              <div className="space-y-4 text-xs leading-relaxed text-slate-600 font-light">
                <p>
                  Corporate gifting is a strategic investment. Standard catalog pens and plastic folders get tossed aside — we design items that are placed prominently on desks and opened slowly.
                </p>
                <p>
                  Combining gourmet tastes, functional tech utility, and artisanal products, our design team builds layouts that fit your brand guidelines perfectly.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#042F2E]/10">
                <div>
                  <span className="text-2xl font-black text-slate-900 block">10k+</span>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Kits Shipped</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block">30+</span>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Top Brands</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block">100%</span>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">On-time dispatch</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE BRAND STORY: Curation Philosophy */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="py-16 px-6 max-w-6xl mx-auto"
      >
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[12px] font-black uppercase tracking-widest text-saffron bg-saffron/10 px-3 py-1.5 rounded-full inline-block">
              Our Vision
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Crafting Sensory <br />
              Unboxing Experiences
            </h2>
            <div className="w-12 h-1 bg-gold rounded-full" />
          </div>
          <div className="lg:col-span-7 text-slate-650 space-y-4 text-sm leading-relaxed font-light">
            <p>
              At The Box Story, we believe corporate gifting is a powerful tool to strengthen bonds, express appreciation, and build lasting relationships with your clients, partners, and employees.
            </p>
            <p>
              Every hamper starts as a creative sketch in our studio, combining premium products with high-end customized packaging solutions. We provide a seamless, stress-free process for selecting, personalizing, and delivering your corporate gifts at scale.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* 3. STRATEGIC BENEFITS: Why it matters (Premium Dark Section) */}
      <section className="bg-teal-deep text-[#FAF4E8] py-16 px-6 border-y border-[#042F2E]/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-3 text-center">
            <span className="text-[12px] font-bold text-saffron uppercase tracking-widest bg-saffron/10 border border-saffron/15 px-2.5 py-1 rounded-full inline-block">
              Strategic Advantages
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-black text-white">Why Invest in Premium Gifting?</h2>
            <p className="text-xs text-[#FAF4E8]/80 max-w-md mx-auto">
              Corporate gifts are a direct representation of your brand values. Here is how premium curation yields real B2B returns.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Heart,
                color: "bg-rani-pink/20 text-rani-pink",
                title: "Build Stronger Relationships",
                desc: "Acts as a gesture of goodwill, reinforcing mutual respect with clients, employees, and board members to secure long-term loyalty."
              },
              {
                icon: Award,
                color: "bg-saffron/20 text-saffron",
                title: "Enhanced Brand Exposure",
                desc: "Useful, premium office keepsakes keep your company logo prominently displayed on desks and in daily use, driving constant recall."
              },
              {
                icon: ShieldCheck,
                color: "bg-[#FAF4E8]/20 text-[#FAF4E8]",
                title: "Increased Client Retention",
                desc: "Differentiates your brand from standard competitors. Thoughtful appreciation cards and gifts build emotional client lock-in."
              },
              {
                icon: Users,
                color: "bg-emerald-800/30 text-emerald-300",
                title: "Create Positive Brand Image",
                desc: "Projects your organization as caring, detail-oriented, and employee-focused, attracting premium partners and top industry talent."
              }
            ].map((benefit, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-[#032322] border border-white/5 p-6 rounded-2xl text-left space-y-4 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${benefit.color}`}>
                  <benefit.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-white">{benefit.title}</h3>
                <p className="text-[13px] text-[#FAF4E8]/70 leading-relaxed font-light">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. CAPABILITIES: What we offer */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="space-y-3 text-center">
          <span className="text-[12px] font-bold text-teal-deep uppercase tracking-widest bg-teal-deep/5 border border-teal-deep/15 px-2.5 py-1 rounded-full inline-block">
            Our Capabilities
          </span>
          <h2 className="font-heading text-2xl md:text-4xl font-black text-slate-900">What We Offer</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We provide a complete, comprehensive corporate gifting package, handling everything from product selection to individual home deliveries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Gift,
              title: "Diverse Selection",
              desc: "Premium gourmet treats, wellness essentials, custom lifestyle decor, and advanced technology gadgets sourced from premium manufacturers."
            },
            {
              icon: PenTool,
              title: "Extensive Customization",
              desc: "Gold-foil logo prints on boxes, corporate ribbon matching, custom-dyed papers, name monogram engraving, and custom message cards."
            },
            {
              icon: Layers,
              title: "Premium Packaging",
              desc: "Gold-foiled rigid drawers, reusable sliding pine wood boxes, leatherette trays, and eco-friendly zero-waste wrap layouts."
            },
            {
              icon: Truck,
              title: "Global Address Delivery",
              desc: "No spreadsheet headaches. We support bulk shipping to corporate offices as well as drop-shipping to individual home addresses globally."
            },
            {
              icon: Laptop,
              title: "Secure Claims Portals",
              desc: "Branded unboxing claim links. Recipients visit a secure portal, input their address and apparel size, and claim their curated gift."
            },
            {
              icon: HelpCircle,
              title: "Volume Optimization",
              desc: "Special early bird proposals, volume discount levels, and dedicated corporate stylists to design mockups and draft timelines."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#FCFAF2]/80 border border-[#042F2E]/5 p-8 rounded-2xl shadow-[0_8px_30px_rgba(4,47,46,0.01)] text-left space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#FAF4E8] text-teal-deep rounded-xl flex items-center justify-center font-bold">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GIFTING FORMATS & CATEGORIES */}
      <section className="bg-[#FCFAF2]/50 py-16 px-6 border-y border-[#042F2E]/10 text-left">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-3 text-center">
            <span className="text-[12px] font-bold text-saffron uppercase tracking-widest bg-saffron/5 border border-saffron/15 px-2.5 py-1 rounded-full inline-block">
              Corporate Formats
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-black text-slate-900 text-center">Custom Formats for Every Occasion</h2>
            <p className="text-xs text-slate-555 max-w-md mx-auto text-center">
              We design specific gifting formats tailored to employee onboarding, client appreciation, milestone rewards, and seasonal festivals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FCFAF2]/90 border border-[#042F2E]/5 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all">
              <div className="space-y-3">
                <span className="text-[12px] font-bold text-rani-pink uppercase tracking-widest bg-rani-pink/5 px-2.5 py-1 rounded-full inline-block">
                  Onboarding & HR Kits
                </span>
                <h3 className="font-heading text-xl font-bold text-slate-900">New Hire Welcome Kits</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Align new hires immediately with custom-branded swag. Incorporate laser-engraved notebooks, vacuum flasks, cotton hoodies, and premium cookies inside custom box sleeves.
                </p>
              </div>
              <div className="border-t border-[#042F2E]/10 pt-4 flex space-x-3 text-[12px] text-slate-500 font-bold">
                <span>✓ Logo Swag</span>
                <span>•</span>
                <span>✓ Onboarding</span>
                <span>•</span>
                <span>✓ Welcome Kits</span>
              </div>
            </div>

            <div className="bg-[#FCFAF2]/90 border border-[#042F2E]/5 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all">
              <div className="space-y-3">
                <span className="text-[12px] font-bold text-saffron uppercase tracking-widest bg-saffron/10 px-2.5 py-1 rounded-md inline-block">
                  B2B Milestone Rewards
                </span>
                <h3 className="font-heading text-xl font-bold text-slate-900">Executive & Client Appreciation</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Build loyalty among VIP accounts and long-term business partners. Luxury copper pitchers, organic loose tea leaf blends, and premium almond brittles arranged in reusable pine wood boxes.
                </p>
              </div>
              <div className="border-t border-[#042F2E]/10 pt-4 flex space-x-3 text-[12px] text-slate-500 font-bold">
                <span>✓ Pine Wood Slider</span>
                <span>•</span>
                <span>✓ Gourmet Foods</span>
                <span>•</span>
                <span>✓ Client VIP</span>
              </div>
            </div>

            <div className="bg-[#FCFAF2]/90 border border-[#042F2E]/5 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all">
              <div className="space-y-3">
                <span className="text-[12px] font-bold text-teal-deep uppercase tracking-widest bg-teal-deep/5 px-2.5 py-1 rounded-full inline-block">
                  Eco-Friendly Curation
                </span>
                <h3 className="font-heading text-xl font-bold text-slate-900">Sustainable & Wellness Hampers</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Demonstrate environmental values. Plantable seeds stationery logs, reusable cork-wrapped glass tumblers, organic acacia honeys, and soy wax candles packed in bio-friendly trays.
                </p>
              </div>
              <div className="border-t border-[#042F2E]/10 pt-4 flex space-x-3 text-[12px] text-slate-500 font-bold">
                <span>✓ Zero-Waste</span>
                <span>•</span>
                <span>✓ Wellness Blends</span>
                <span>•</span>
                <span>✓ Acacia Honey</span>
              </div>
            </div>

            <div className="bg-[#FCFAF2]/90 border border-[#042F2E]/5 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all">
              <div className="space-y-3">
                <span className="text-[12px] font-bold text-emerald-850 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                  High-Utility Gear
                </span>
                <h3 className="font-heading text-xl font-bold text-slate-900 font-black">Modern Tech & Desk Swag</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Gifts that stay on the desk. Smart thermal flasks, wireless multi-port power banks, desk humidifiers, and customized mugs from premium brands like Portronics.
                </p>
              </div>
              <div className="border-t border-[#042F2E]/10 pt-4 flex space-x-3 text-[12px] text-slate-500 font-bold">
                <span>✓ Portronics Flasks</span>
                <span>•</span>
                <span>✓ Multi-Port Charger</span>
                <span>•</span>
                <span>✓ Desk Swag</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOUR EASY STEPS TIMELINE */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="space-y-3 text-center">
          <span className="text-[12px] font-bold text-teal-deep uppercase tracking-widest bg-teal-deep/5 border border-teal-deep/15 px-2.5 py-1 rounded-full inline-block">
            Curation Process
          </span>
          <h2 className="font-heading text-2xl md:text-4xl font-black text-slate-900">Make Your Own Gift Hamper</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto text-center">
            Our streamlined process makes custom bulk box curation simple, quick, and fully transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Choose Packaging",
              desc: "Select the base box to match your budget and branding. Options include gold-foiled rigid drawer boxes, pine wood sliding boxes, and open display trays (Delhi NCR only)."
            },
            {
              step: "02",
              title: "Select Products",
              desc: "Mix and match items from our extensive categories of premium sweets, organic wellness teas, gourmet almond brittles, keychains, metal flasks, or smart technology items."
            },
            {
              step: "03",
              title: "Add Custom Branding",
              desc: "Integrate your corporate guidelines. Add logo hot-stamps, coordinate color ribbons, laser-engrave names on flasks, and draft personalized message card calligraphy."
            },
            {
              step: "04",
              title: "Confirm & Ship",
              desc: "Verify quantities, sign off on 3D box mockups, and upload destination address files. Our logistics team handles assembly, packaging, and timely dispatch."
            }
          ].map((s, idx) => (
            <div key={idx} className="bg-[#FCFAF2]/80 border border-[#042F2E]/5 p-6 rounded-2xl relative space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-305 shadow-[0_8px_30px_rgba(4,47,46,0.01)]">
              <span className="text-4xl font-serif font-black text-saffron/15 block text-right">{s.step}</span>
              <div className="space-y-2 text-left">
                <h3 className="font-heading text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-[13px] text-slate-550 leading-relaxed font-light">{s.desc}</p>
              </div>
              <div className="pt-2 border-t border-[#042F2E]/10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">The Box Story</span>
                <span className="w-5 h-5 rounded-full bg-saffron/10 text-saffron flex items-center justify-center text-xs">➔</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CUSTOMIZATION DETAIL PANEL */}
      <section className="bg-[#FCFAF2]/30 py-16 px-6 border-t border-[#042F2E]/10 text-left">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[12px] font-bold text-saffron uppercase tracking-widest bg-saffron/10 px-2.5 py-1 rounded-md inline-block">
                Corporate Branding
              </span>
              <h2 className="font-heading text-3xl font-black text-slate-900 leading-tight">
                Bespoke Identity on Every Curation
              </h2>
              <p className="text-xs text-slate-650 leading-relaxed font-light">
                Gifts are a representative of your brand&apos;s commitment to quality. We ensure extensive customization options to align every element of the box directly with your corporate branding guidelines.
              </p>
              <p className="text-xs text-slate-650 leading-relaxed font-light">
                From gold-foil hot-stamps and screen prints on rigid boxes to monogram name laser engraving on flasks and tech items, we make every recipient feel uniquely valued.
              </p>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Customized Boxes",
                  desc: "Screen-print or gold foil stamp your brand logo directly onto the lid of rigid boxes. For ready-made boxes, add a full-color custom paper wrap sleeve.",
                  img: "/images/corporate-profile/page_13_img_1.png"
                },
                {
                  title: "Customized Cards",
                  desc: "Complete the box with custom-printed corporate cards or cursive handwritten-style calligraphy tags to convey personal sentiments.",
                  img: "/images/corporate-profile/page_14_img_1.png"
                },
                {
                  title: "Customized Labels",
                  desc: "Coordinated ribbon selections, customized product jars labels, and tissue fills matching your exact brand guidelines.",
                  img: "/images/corporate-profile/page_15_img_1.png"
                },
                {
                  title: "Customized Tags",
                  desc: "Individual tags etched on acrylic or wood, and screen-printed ribbons in corporate colors for a luxurious finishing touch.",
                  img: "/images/corporate-profile/page_16_img_1.png"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#FCFAF2]/90 border border-[#042F2E]/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-[#042F2E]/10">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-1.5 text-left">
                    <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                    <p className="text-[12px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. SIGNATURE CURATIONS GALLERY */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12 text-left">
        <div className="space-y-3 text-center">
          <span className="text-[12px] font-bold text-rani-pink uppercase tracking-widest bg-rani-pink/5 border border-rani-pink/15 px-2.5 py-1 rounded-full inline-block">
            Curated Showcase
          </span>
          <h2 className="font-heading text-2xl md:text-4xl font-black text-slate-900 text-center">Signature Hampers Curation Gallery</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto text-center">
            A selection of actual premium corporate hampers and swag kits curated for employee welcomes, milestone celebrations, and B2B VIP gifting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "The Coffee Connoisseur Hamper",
              desc: "Araku Valley single-origin coffee beans, a customized name-engraved ceramic mug, and handcrafted oats cookies in a matte rigid sliding box.",
              img: "/images/corporate-profile/page_19_img_1.png",
              tag: "Premium Executive"
            },
            {
              title: "Saffron Tea & Honey Wellness",
              desc: "Kashmiri organic saffron tea leaves, a decorative brass infuser spoon, wild acacia forest honey, and decorative dry fruit jars.",
              img: "/images/corporate-profile/page_21_img_1.png",
              tag: "Artisanal Wellness"
            },
            {
              title: "Modern Tech & Desk Swag Kit",
              desc: "Custom-engraved thermal insulated flask, smart charging pad desk organizer, leather key ring, and executive notebooks.",
              img: "/images/corporate-profile/page_23_img_1.png",
              tag: "New Hire Onboarding"
            },
            {
              title: "Sustainable Cork & Glass Case",
              desc: "Reusable cork-wrapped glass tumblers with glass straws, plantable stationery pencil logs, and organic seed cards.",
              img: "/images/corporate-profile/page_25_img_1.png",
              tag: "Zero-Waste CSR"
            },
            {
              title: "Auspicious Traditional Tray",
              desc: "Pure Mysore sandalwood incense cones, handcrafted clay-brass diyas, and premium salted cashews arranged in a reusable gold-wrapped tray.",
              img: "/images/corporate-profile/page_27_img_1.png",
              tag: "Milestone Celebration"
            },
            {
              title: "Premium Oak Wooden Gift Box",
              desc: "Gourmet hazelnut chocolate brittles, customized leather cardholders, and vacuum-insulated travel tumblers in a reusable pine wood slide chest.",
              img: "/images/corporate-profile/page_31_img_1.png",
              tag: "VIP Partner Gift"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#FCFAF2]/90 border border-[#042F2E]/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-305 flex flex-col justify-between">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-teal-deep text-[#FCFAF2] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md">
                  {item.tag}
                </span>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-heading text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#042F2E]/10 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                  <span>The Box Story</span>
                  <span>Curation</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CLIENT COLLABORATIONS TICKER */}
      <section className="bg-[#FCFAF2]/50 py-16 px-6 border-y border-[#042F2E]/10 space-y-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-3 text-center">
            <span className="text-[12px] font-bold text-rani-pink uppercase tracking-widest bg-rani-pink/5 border border-rani-pink/15 px-2.5 py-1 rounded-full inline-block">
              Collaborations
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-black text-slate-900 text-center">Our Legacy of Collaborations</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto text-center">
              We partner with startups, premium wedding destinations, and large enterprise brands to execute custom gifting campaigns.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
            {[
              { name: "Google", img: "/images/corporate-profile/page_18_img_1.png" },
              { name: "CRED", img: "/images/corporate-profile/page_18_img_2.png" },
              { name: "TATA", img: "/images/corporate-profile/page_18_img_3.png" },
              { name: "Razorpay", img: "/images/corporate-profile/page_18_img_4.png" },
              { name: "Zomato", img: "/images/corporate-profile/page_18_img_5.png" },
              { name: "Microsoft", img: "/images/corporate-profile/page_18_img_6.png" }
            ].map((logo, idx) => (
              <div key={idx} className="bg-[#FCFAF2]/90 border border-[#042F2E]/5 p-4 h-20 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
                <img
                  src={logo.img}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain mx-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. BRIEF FORM CONTAINER / CALL TO ACTION */}
      <section id="brief-form" className="bg-teal-deep text-[#FAF4E8] py-16 px-6 md:px-12 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[12px] font-bold text-saffron uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md inline-block">
              Start Curation
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Crate <br />
              Your Custom Box?
            </h2>
            <p className="text-xs text-[#FAF4E8]/80 leading-relaxed font-light">
              Send us details about your corporate occasion, expected quantities, and budget preferences. Our styling specialists will get back to you with custom 3D mockups.
            </p>
            <div className="space-y-2 text-xs">
              <p className="flex items-center space-x-2 text-[#FAF4E8]/80">
                <span className="font-bold">Email:</span>
                <span>sayhi@theboxstory.co.in</span>
              </p>
              <p className="flex items-center space-x-2 text-[#FAF4E8]/80">
                <span className="font-bold">Phone:</span>
                <span>+91 97179 99223 / +91 85756 75685</span>
              </p>
            </div>
          </div>
          
          <div className="bg-[#FCFAF2]/95 text-slate-800 p-8 rounded-3xl shadow-xl space-y-4 border border-[#042F2E]/5">
            <h3 className="font-heading text-base font-bold text-teal-deep">Inquire for Bulk Orders</h3>
            <p className="text-[12px] text-slate-500 font-light">
              Enter your details below and our corporate client managers will reach out to you within 24 hours.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry Sent! Our B2B managers will call you back shortly.'); }} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input required type="text" placeholder="Your Name" className="w-full text-xs border border-[#042F2E]/10 px-3 py-2.5 rounded-xl bg-[#FAF4E8]/50 focus:outline-none focus:border-teal-deep" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-400 uppercase mb-1">Company Email</label>
                <input required type="email" placeholder="name@company.com" className="w-full text-xs border border-[#042F2E]/10 px-3 py-2.5 rounded-xl bg-[#FAF4E8]/50 focus:outline-none focus:border-teal-deep" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-400 uppercase mb-1">Occasion Type</label>
                  <select className="w-full text-xs border border-[#042F2E]/10 px-3 py-2.5 rounded-xl bg-[#FAF4E8]/50 focus:outline-none focus:border-teal-deep">
                    <option>Onboarding</option>
                    <option>Client Appreciation</option>
                    <option>Milestone Reward</option>
                    <option>Festival / Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-400 uppercase mb-1">Est. Quantity</label>
                  <input type="number" placeholder="MOQ 20" min="20" className="w-full text-xs border border-[#042F2E]/10 px-3 py-2.5 rounded-xl bg-[#FAF4E8]/50 focus:outline-none focus:border-teal-deep" />
                </div>
              </div>
              <button type="submit" className="w-full bg-rani-pink hover:bg-rani-pink/95 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all">
                Submit Design Request
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
