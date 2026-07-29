"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2, Award,
  ArrowRight
} from "lucide-react";

export default function PastWorkPage() {
  const caseStudies = [
    {
      company: "CRED",
      title: "Diwali Corporate Hampers",
      context: "Festive appreciation hampers for 500+ premium staff members across India.",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
      items: ["Laser-engraved copper tumblers", "Jaipur wildflower saffron honey", "Artisanal dry fruit laddoos", "Custom card monograms"],
      story: "CRED requested unboxing hampers reflecting their high-contrast, premium aesthetic. We designed custom-dyed black textured rigid boxes housed inside a warm ivory sleeve. Employees redeemed their hampers directly via unique claims passcodes, entering their delivery addresses securely without HR intervention. All 500+ boxes were dispatched and tracked live in under 4 days.",
      outcome: "100% on-time doorstep deliveries with zero address failures.",
      badge: "Festive Bulk",
    },
    {
      company: "Google India",
      title: "Intern Onboarding Welcome Kits",
      context: "Welcome swag kits for software engineering interns & new hires.",
      image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80",
      items: ["Custom organic cotton hoodies", "Mahogany notebook diaries", "Stanley-style vacuum flasks", "Gourmet oat cookies"],
      story: "Google wanted to combine eco-friendly office essentials with custom-branded clothing. The major challenge was clothing size collections. By spinning up a branded micro-portal, interns selected their exact hoodie sizes and logged shipping addresses. Sizing reports synced directly to our apparel production team.",
      outcome: "0% apparel sizing errors, fully automated shipping coordinates.",
      badge: "Onboarding Kits",
    },
    {
      company: "Heritage Wedding, Jaipur",
      title: "Maharaja Favor boxes",
      context: "Luxury welcome favors for 350+ destination wedding invitees.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      items: ["Heavy-cast brass incense bowls", "Mysore sandalwood cone blends", "Organic floral tea canisters", "Custom gold-foiled monograms"],
      story: "A destination wedding at the Rambagh Palace required sensory, heritage favors. We designed boxes wrapped in royal-saffron satin ribbons, custom gold-leaf monograms, and packed them with Jaipur-sourced brassware. Favors were pre-positioned at guest reception desks.",
      outcome: "Instant premium guest unboxing impression at guest check-in.",
      badge: "Royal Wedding",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-800 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-16 text-left">
        
        {/* Breadcrumbs */}
        <div className="text-xs space-x-2 text-slate-400">
          <Link href="/" className="hover:text-teal-deep">Home</Link>
          <span>/</span>
          <Link href="/corporate" className="hover:text-teal-deep">Corporate Gifting</Link>
          <span>/</span>
          <span className="text-slate-650 font-bold">Past Work</span>
        </div>

        {/* Hero Section */}
        <section className="space-y-6">
          <div className="inline-flex items-center space-x-1.5 bg-saffron/10 border border-saffron/20 px-3 py-1 rounded-full text-xs font-bold text-saffron uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Editorial Case Studies</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-teal-deep leading-tight">
            Our Past Work & <br />
            <span className="text-rani-pink">Gifting Case Studies</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-650 leading-relaxed max-w-2xl font-light">
            Explore how we partnered with enterprise tech brands, startup leaders, and royal weddings to design unforgettably premium unboxing experiences.
          </p>
        </section>

        {/* Case Studies Lists */}
        <section className="space-y-16">
          {caseStudies.map((study, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 gap-0"
            >
              {/* Image side */}
              <div className="md:col-span-5 relative min-h-[250px] bg-teal-deep/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={study.image} 
                  alt={study.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-saffron text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                  {study.badge}
                </span>
              </div>

              {/* Text details side */}
              <div className="md:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-rani-pink uppercase tracking-widest block">{study.company}</span>
                    <h3 className="font-heading text-2xl font-black text-teal-deep leading-tight">{study.title}</h3>
                    <p className="text-[11px] text-slate-400 font-semibold italic">{study.context}</p>
                  </div>

                  <p className="text-xs text-slate-650 leading-relaxed">
                    {study.story}
                  </p>

                  {/* Included treats */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9px] font-black text-teal-deep/55 uppercase tracking-wide block">Hamper Box Contents:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {study.items.map((item, i) => (
                        <span key={i} className="bg-teal-deep/5 text-teal-deep text-[10px] font-medium border border-teal-deep/10 px-2.5 py-0.5 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Outcome box */}
                <div className="border-t border-teal-deep/5 pt-4 mt-6 flex items-start space-x-2 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5 text-left">
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block">Project Outcome</span>
                    <span className="text-xs text-emerald-850 font-bold leading-relaxed">{study.outcome}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA Back to corporate Brief */}
        <section className="bg-gradient-to-br from-amber-50 via-background to-rose-50 border border-amber-200 rounded-[40px] p-8 md:p-12 text-center space-y-6">
          <h3 className="font-heading text-2xl font-black text-teal-deep">
            Scale your unboxing journey with us
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Submit your corporate quantities and branding files. Let us outline design mockups and token setups for your upcoming festive season campaign.
          </p>
          <div className="flex justify-center">
            <Link
              href="/corporate#brief-form"
              className="inline-flex items-center space-x-1.5 bg-teal-deep hover:bg-teal-deep/90 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow"
            >
              <span>Submit Project Brief</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
