"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gift, CheckCircle2, ChevronRight,
  Globe, Laptop, ArrowRight, ExternalLink,
  Download, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { revealProps, staggerContainer, staggerItem } from "../../lib/motion";

const corporateCatalogs = [
  {
    file: "The Box Story - Corporate Gifting Profile.pdf",
    title: "Corporate Gifting Profile",
    category: "Corporate Proposals",
    description: "Overview of The Box Story corporate gifting solutions and client portfolio.",
    img: "/images/categories/4. Corporate Gifts/watermarked_img_12051686267136327533.jpg",
    size: "23.8 MB"
  },
  {
    file: "1. TBS X XECH - Consumer Electronics.pdf.pdf",
    title: "XECH Consumer Electronics I",
    category: "Tech & Gadgets",
    description: "Premium smart lifestyle products, wireless stands, and desk accessories.",
    img: "/images/categories/9. Noise Consumer Electronics/watermarked_img_12071728457325787041.jpg",
    size: "10.1 MB"
  },
  {
    file: "2. TBS X XECH - Consumer Electronics.pdf.pdf",
    title: "XECH Consumer Electronics II",
    category: "Tech & Gadgets",
    description: "Advanced lifestyle electronics, humidifiers, and executive gear.",
    img: "/images/categories/9. Noise Consumer Electronics/watermarked_img_11474945919467215748.jpg",
    size: "273.8 MB"
  },
  {
    file: "3. TBS X TIMALFI - LAMPS.pdf.pdf",
    title: "TIMALFI Designer Lamps",
    category: "Tech & Gadgets",
    description: "Aesthetic design lamps, ambient desk lights, and bedside fixtures.",
    img: "/images/categories/9. Desk Lamps/watermarked_img_12171658573486743729.jpg",
    size: "9.9 MB"
  },
  {
    file: "4. TBS X Noise - Consumer Electronics.pdf.pdf",
    title: "Noise Smart Electronics",
    category: "Tech & Gadgets",
    description: "Noise smartwatches, fitness trackers, and bluetooth audio devices.",
    img: "/images/categories/9. Noise Consumer Electronics/watermarked_img_13368173261474923732.jpg",
    size: "9.1 MB"
  },
  {
    file: "5. TBS X Portronics.pdf",
    title: "Portronics Tech Accessories",
    category: "Tech & Gadgets",
    description: "Portable bluetooth speakers, wireless power banks, and desk hubs.",
    img: "/images/categories/15. Portronics Consumer Products/watermarked_img_14478076630029269723.jpg",
    size: "73.2 MB"
  },
  {
    file: "6. TBS X AQUAMINDER.pdf.pdf",
    title: "Aquaminder Smart Hydration",
    category: "Drinkware & Coffee",
    description: "Sensor-tracked smart hydration flasks and temperature display mugs.",
    img: "/images/categories/14. Reminder Water Bottles/watermarked_img_11775971033268889749.jpg",
    size: "8.3 MB"
  },
  {
    file: "7. TBS X Everyday Organizers.pdf.pdf",
    title: "Everyday Organizers & Planners",
    category: "Stationery & Office",
    description: "Professional desk organizers, leather planner diaries, and folders.",
    img: "/images/categories/8. Desk Organizers/watermarked_img_14433706821600378337.jpg",
    size: "51.9 MB"
  },
  {
    file: "8. TBS X WACACO.pdf.pdf",
    title: "Wacaco Portable Coffee Gear",
    category: "Drinkware & Coffee",
    description: "Luxury portable espresso makers, Minipresso travel sets, and accessories.",
    img: "/images/categories/3. Drinkware/watermarked_img_13563193197810308771.jpg",
    size: "23.3 MB"
  },
  {
    file: "9. Non Branded - Solid Polos.pdf",
    title: "Solid Polo Collections",
    category: "Apparel & Clothing",
    description: "Premium cotton solid color polos for corporate workspace apparel.",
    img: "/images/categories/11. Polos/Gemini_Generated_Image_cddt2xcddt2xcddt.png",
    size: "11.2 MB"
  },
  {
    file: "10. Non Branded - T-Shirts Solids.pdf",
    title: "Solid T-Shirt Series",
    category: "Apparel & Clothing",
    description: "Standard non-branded solid cotton t-shirts for brand printing.",
    img: "/images/categories/12. T-Shirts/645e187d-58ba-4209-9956-60c77de76bc5.jpeg",
    size: "3.1 MB"
  },
  {
    file: "11. Non Branded - Striped Polos.pdf",
    title: "Striped Polo Selections",
    category: "Apparel & Clothing",
    description: "Smart casual striped pique cotton polos for corporate events.",
    img: "/images/categories/11. Polos/Gemini_Generated_Image_t4jo6dt4jo6dt4jo.png",
    size: "33.3 MB"
  },
  {
    file: "12. Non Branded - Golfer Polos.pdf",
    title: "Golfer Polo Series",
    category: "Apparel & Clothing",
    description: "Sporty pique cotton golfer polo shirts for executive outings.",
    img: "/images/categories/11. Polos/Gemini_Generated_Image_ghxhitghxhitghxh.png",
    size: "9.6 MB"
  },
  {
    file: "13. Pens & Keychains.pdf",
    title: "Writing Instruments & Keyrings",
    category: "Stationery & Office",
    description: "Engraved metal rollerball pens and customized leather keychains.",
    img: "/images/categories/5. Pens/Gemini_Generated_Image_27qhdd27qhdd27qh.png",
    size: "19.3 MB"
  },
  {
    file: "14. Wallets.pdf",
    title: "Leather Wallets & Sleeves",
    category: "Bags & Leather",
    description: "RFID-protected genuine leather wallets and slim cardholder sleeves.",
    img: "/images/categories/7. Wallets/Gemini_Generated_Image_zfngz4zfngz4zfng.png",
    size: "147.5 MB"
  },
  {
    file: "15. Notebooks.pdf",
    title: "Notebooks & Custom Journals",
    category: "Stationery & Office",
    description: "Hard-bound custom notebooks with elastic band closures.",
    img: "/images/categories/2. Diaries/watermarked_img_14715734161756954805.jpg",
    size: "78.6 MB"
  },
  {
    file: "16. Premium Office Bags.pdf",
    title: "Premium Office Bags",
    category: "Bags & Leather",
    description: "Genuine leather briefcases, messenger bags, and laptop sleeves.",
    img: "/images/categories/13. Premium Office Bags/2948e6c4-991b-48aa-bbe6-078bd39e4791.jpeg",
    size: "101.4 MB"
  },
  {
    file: "17. Employee Kits.pdf",
    title: "Employee Onboarding Kits",
    category: "Corporate Proposals",
    description: "Bespoke corporate new hire welcome boxes and appreciation crates.",
    img: "/images/categories/1. Employee Onboarding Kits/Gemini_Generated_Image_ent7q2ent7q2ent7.png",
    size: "89.7 MB"
  },
  {
    file: "18. Executive Bags.pdf",
    title: "Executive Bags & Trolleys",
    category: "Bags & Leather",
    description: "Nashermiles cabin luggage and high-end executive travel briefcases.",
    img: "/images/categories/10. Luggage Trolleys - Nashermiles/watermarked_img_4992227648424952132.jpg",
    size: "89.6 MB"
  },
  {
    file: "19. Bags.pdf",
    title: "Standard Backpacks & Duffels",
    category: "Bags & Leather",
    description: "Ergonomic work backpacks, gym duffels, and travel messenger packs.",
    img: "/images/categories/13. Premium Office Bags/watermarked_img_11706627081056960211.jpg",
    size: "61.9 MB"
  },
  {
    file: "20. TBS X Turtle - Branded Apparels.pdf",
    title: "Turtle Branded Apparels",
    category: "Apparel & Clothing",
    description: "Branded premium cotton hoodies, jackets, and corporate polos.",
    img: "/images/categories/HOODIES/watermarked_img_11185030333774733631.jpg",
    size: "16.3 MB"
  },
  {
    file: "21. Premium T-Shirts - Non Branded.pdf",
    title: "Premium T-Shirts",
    category: "Apparel & Clothing",
    description: "Luxury ring-spun combed cotton t-shirts for premium branding.",
    img: "/images/categories/12. T-Shirts/877b5e14-5e94-4bf9-be59-ee8b23649c30.jpeg",
    size: "5.5 MB"
  },
  {
    file: "22. Corporate Gifts.pdf",
    title: "Corporate Gifts Catalog",
    category: "Corporate Proposals",
    description: "General client token gifts, desktop accessories, and curated sets.",
    img: "/images/categories/4. Corporate Gifts/watermarked_img_12051686267136327533.jpg",
    size: "20.3 MB"
  },
  {
    file: "23. Drinkware.pdf",
    title: "Drinkware & Coffee Tumblers",
    category: "Drinkware & Coffee",
    description: "Insulated water flasks, travel mugs, and steel tea infusers.",
    img: "/images/categories/3. Drinkware/watermarked_img_8332171379844688208.jpg",
    size: "11.3 MB"
  }
];

export default function CorporateGifting() {
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>("All");
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
  const [activeProfileTab, setActiveProfileTab] = useState<"offerings" | "branding" | "benefits" | "steps">("offerings");

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
    } catch (err) {
      alert("Network Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { number: "10,000+", label: "Hampers Shipped" },
    { number: "30+", label: "Enterprise Brands" },
    { number: "100%", label: "On-time Dispatch Rate" },
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
    <div className="min-h-screen bg-background text-slate-800 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Banner Section: Sleek B2B Layout (Light Theme) */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 via-background to-rose-50 text-slate-800 p-8 md:p-20 shadow-sm border border-slate-200 text-left"
        >
          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 bg-background border border-slate-200 px-3 py-1.5 rounded-full inline-block">
              Corporate Bulk Services
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black leading-tight tracking-tight text-teal-deep">
              Corporate Gifting <br />
              <span className="text-rani-pink">Reimagined.</span>
            </h1>
            <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
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
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((s, idx) => (
            <motion.div key={idx} variants={staggerItem} whileHover={{ y: -4 }} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-left space-y-2">
              <span className="text-3xl font-black text-slate-900 block tracking-tight">{s.number}</span>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{s.label}</span>
            </motion.div>
          ))}
        </motion.section>

        {/* Corporate Gifting Profile & Why Choose Us */}
        <motion.section {...revealProps} className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-slate-200 p-8 md:p-12 rounded-[40px] shadow-sm text-left">
          {/* Left Column: Corporate Gifting Profile Summary */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-[12px] tracking-widest font-black uppercase text-saffron bg-saffron/10 border border-saffron/15 px-3 py-1.5 rounded-full inline-block">
                Corporate Gifting Partner
              </span>
              <h2 className="font-heading text-3xl font-black text-slate-900 leading-tight">
                Strengthening Relationships, One Thoughtful Gift at a Time
              </h2>
              <p className="text-xs text-slate-650 leading-relaxed font-light">
                At The Box Story, we view corporate gifting as a strategic investment in connections. We curate bespoke corporate hampers designed to communicate gratitude, foster trust, and enhance brand loyalty across all stakeholder groups.
              </p>
              <p className="text-xs text-slate-650 leading-relaxed font-light">
                Whether welcome hampers for remote hires, premium executive appreciation cases, or traditional auspicious Diwali baskets—our curations blend heritage craftsmanship (Jaipur studio design, hand-cast clay diyas, and Mysore sandalwood) with smart logistics.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="bg-[#FAF4E8]/50 border border-[#E2BA5F]/20 rounded-2xl p-4 space-y-3">
                <span className="text-[11px] font-bold text-saffron uppercase tracking-widest block">Corporate Deck & Profile</span>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  Access our 37-page corporate profile detailing bulk catalogs, collaborations, and past works.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                  <Link
                    href="/corporate/profile"
                    className="inline-flex items-center space-x-1.5 text-xs font-black text-teal-deep hover:text-rani-pink transition-colors"
                  >
                    <span>Open Digital Deck</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="hidden sm:inline text-slate-300 text-xs">|</span>
                  <a
                    href="/corporate/catalog?file=The%20Box%20Story%20-%20Corporate%20Gifting%20Profile.pdf"
                    target="_blank"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-teal-deep transition-colors"
                  >
                    <span>Download PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Profile Tabs Showcase */}
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-black text-slate-900">
                Explore Our Gifting Blueprint
              </h3>
              <p className="text-[13px] text-slate-550 leading-normal">
                Click on the tabs below to read about our capabilities, branding details, and strategic B2B advantages.
              </p>
            </div>

            {/* Tabs Selector Navigation Row */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
              {[
                { id: "offerings", label: "Capabilities", icon: "✨" },
                { id: "branding", label: "Branding", icon: "🖋️" },
                { id: "benefits", label: "Benefits", icon: "📈" },
                { id: "steps", label: "4-Step Guide", icon: "🎁" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id as any)}
                  className={`text-[12px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
                    activeProfileTab === tab.id
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                      : "bg-[#FCFAF2]/30 border-slate-150 text-slate-650 hover:bg-slate-100"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content displays */}
            <div className="flex-1 min-h-[300px] flex items-stretch">
              <AnimatePresence mode="wait">
                {activeProfileTab === "offerings" && (
                  <motion.div
                    key="offerings"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left"
                  >
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Diverse Product Selection</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        We source premium gourmet treats, custom chocolate brittles, luxury home decor, and cutting-edge tech gadgets from trusted brands like Portronics and Noise.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Premium Packaging Formats</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Packaging options are as important as the gift. Select reusable pine wood sliding chests, rigid gold-foiled dresser boxes, or customizable eco-friendly trays.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Streamlined Distribution</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Leave logistics to us. We support bulk single-point shipping as well as individual home drop-shipping to remote employees across multiple global addresses.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Diwali & Festive Specialities</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Add traditional auspicious additions like hand-painted clay diyas, brass urli bowls, dry fruits jars, and heritage Pichwai floral sleeves.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeProfileTab === "branding" && (
                  <motion.div
                    key="branding"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left"
                  >
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Logo Embossing & Foiling</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Print your company logo on the exterior of the box with gold foil stamping or screen-printing to elevate the perceived brand value.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Laser Monogram Engraving</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Personalize premium metal pens, vacuum-insulated bottles, and wood notebook covers with individual employee/client names.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Color-Coordinated Design</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Match tissue paper fills, satin ribbons, custom sleeves, and packaging designs directly with your corporate brand guidelines.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Calligraphed Message Cards</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Ditch generic cards. Provide customized cursive hand-written calligraphy greeting tags or premium custom-printed brand cards.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeProfileTab === "benefits" && (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left"
                  >
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Relationship Strengthening</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Acts as a gesture of goodwill, building stronger connections and encouraging long-term loyalty with partners and team members.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Enhanced Brand Exposure</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Branded utility keepsakes keep your company name on recipients&apos; desks and in their thoughts daily in a non-intrusive way.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Increased Client Retention</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Thoughtful thank-you gestures differentiate your service, elevating B2B client satisfaction and reducing churn.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Positive Corporate Image</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Highlights your commitment to employee appreciation and corporate social responsibility (CSR) with sustainable gift options.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeProfileTab === "steps" && (
                  <motion.div
                    key="steps"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left"
                  >
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Step 1: Choose Your Base Box</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Select a box matching your styling budget—wooden sliding chests, sleek rigid drawers, or open display baskets.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Step 2: Curate Product Inclusions</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Select from gourmet treats, dry fruits jars, desktop office supplies, tech charging pads, or coffee accessories.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Step 3: Personalize and Brand</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Add your brand logo, name monograms, custom tissue fillers, and coordinate color palettes with ribbon selections.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900">Step 4: Confirm and Deliver</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-light">
                        Confirm quantities and upload destination addresses. Our logistics team handles assembly and timely shipment.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* Exploratory Subpages: Client Panel & Past Work */}
        <motion.section {...revealProps} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-left space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group">
            <span className="text-[12px] font-bold text-rani-pink uppercase tracking-widest bg-rani-pink/5 border border-rani-pink/15 px-2.5 py-1 rounded-full inline-block">
              Client Portal
            </span>
            <h3 className="font-heading text-xl font-black text-slate-900 group-hover:text-rani-pink transition-colors">
              Employee Claim Panel
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discover how we build custom unboxing hubs where your team members can enter voucher codes, select sizes, and claim packages.
            </p>
            <Link
              href="/corporate/client-panel"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-deep hover:text-saffron transition-colors"
            >
              <span>Explore Portal Solutions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-left space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group">
            <span className="text-[12px] font-bold text-saffron uppercase tracking-widest bg-saffron/5 border border-saffron/15 px-2.5 py-1 rounded-full inline-block">
              Portfolio
            </span>
            <h3 className="font-heading text-xl font-black text-slate-900 group-hover:text-rani-pink transition-colors">
              Our Past Work & Case Studies
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Read the case studies behind Google&rsquo;s tech welcome kits, CRED&apos;s Diwali gold-foiled boxes, and heritage weddings favors.
            </p>
            <Link
              href="/corporate/past-work"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-deep hover:text-saffron transition-colors"
            >
              <span>View Past Work</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.section>

        {/* Services & Capabilities */}
        <section className="space-y-10">
          <motion.div {...revealProps} className="space-y-3 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-black text-slate-900">Custom Corporate Solutions</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We leverage modern technology platforms to make shipping swag and kits completely painless for HR & admin managers.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((f, idx) => (
              <motion.div key={idx} variants={staggerItem} whileHover={{ y: -4 }} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-650 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Products We Deal In / Catalogues Download */}
        <motion.section {...revealProps} className="space-y-12">
          <div className="space-y-3 text-center">
            <span className="text-[12px] font-bold text-rani-pink uppercase tracking-widest bg-rani-pink/5 border border-rani-pink/15 px-2.5 py-1 rounded-full inline-block">
              Corporate Catalogues
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-black text-slate-900">Products We Deal In</h2>
            <p className="text-xs text-slate-555 max-w-md mx-auto">
              Browse our brand proposals and product catalogs live on site, or download standard copies for your team offline.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {["All", "Corporate Proposals", "Tech & Gadgets", "Drinkware & Coffee", "Bags & Leather", "Stationery & Office", "Apparel & Clothing"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCatalogCategory(cat)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all border ${
                  selectedCatalogCategory === cat
                    ? "bg-[#042F2E] text-white border-[#042F2E] shadow-sm"
                    : "bg-[#FCFAF2] hover:bg-[#FAF4E8] text-teal-deep border-teal-deep/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalogues Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {corporateCatalogs
              .filter(c => selectedCatalogCategory === "All" || c.category === selectedCatalogCategory)
              .map((catalog, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#FCFAF2]/65 border border-slate-200 rounded-[32px] overflow-hidden text-left space-y-4 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Catalog Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 border-b border-slate-100 shrink-0">
                      <img
                        src={catalog.img}
                        alt={catalog.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-teal-deep/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md">
                        {catalog.category}
                      </span>
                    </div>

                    <div className="px-6 space-y-2">
                      <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-rani-pink transition-colors leading-snug">
                        {catalog.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">
                        {catalog.description}
                      </p>
                      <span className="inline-block text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        Size: {catalog.size}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                    {/* View Online Button */}
                    <Link
                      href={`/corporate/catalog?file=${encodeURIComponent(catalog.file)}`}
                      className="flex-1 flex items-center justify-center space-x-1.5 border border-teal-deep/20 hover:border-teal-deep hover:bg-teal-deep/5 text-teal-deep py-2.5 rounded-xl font-bold text-xs transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Online</span>
                    </Link>
                    {/* Download Button */}
                    <a
                      href={`/catalogues/${catalog.file}`}
                      download
                      className="flex-1 flex items-center justify-center space-x-1.5 bg-teal-deep hover:bg-[#032322] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </motion.section>

        {/* Corporate Quote Builder CTA */}
        <motion.div
          {...revealProps}
          className="bg-teal-deep rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-saffron">Prefer to browse first?</span>
            <h3 className="font-heading text-2xl font-black text-white">Build a Tentative Selection</h3>
            <p className="text-xs text-white/70 max-w-md">Skip the form — browse our catalogue and mark what you&apos;d want for your team, and we&apos;ll follow up with pricing.</p>
          </div>
          <Link
            href="/corporate-quote"
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-teal-deep px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex-shrink-0"
          >
            <span>Start Building</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Inquiries Form Section */}
        <motion.section {...revealProps} id="brief-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm text-left">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-saffron bg-saffron/10 px-3 py-1 rounded-full uppercase tracking-wider">
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
                      <label className="text-xs font-bold text-slate-600">Your Name *</label>
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
                      <label className="text-xs font-bold text-slate-600">Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Google India"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Work Email *</label>
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
                      <label className="text-xs font-bold text-slate-600">Contact Phone *</label>
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
        </motion.section>

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
