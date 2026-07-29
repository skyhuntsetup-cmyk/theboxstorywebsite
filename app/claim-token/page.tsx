"use client";

import React, { useState } from "react";
import { Shield, MapPin, Truck, CheckCircle2, ChevronRight, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface KitItem {
  name: string;
  price: number;
  image: string;
}

interface Kit {
  id: string;
  name: string;
  desc: string;
  hasTshirt: boolean;
  items: KitItem[];
}

interface CompanyInfo {
  company: string;
  bgColor: string;
  themeColor: string;
  logo: string;
  welcome: string;
  kits: Kit[];
}

export default function ClaimToken() {
  const [passcode, setPasscode] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [tshirtSize, setTshirtSize] = useState("L");

  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  const mockTokens: { [key: string]: CompanyInfo } = {
    "CRED-LAUNCH-2026": {
      company: "CRED",
      bgColor: "from-slate-50 to-slate-100 border-slate-200",
      themeColor: "#D1126A",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd5735e?w=100&auto=format&fit=crop&q=80",
      welcome: "Welcome to the CRED Team! Select your official onboarding assets.",
      kits: [
        {
          id: "cred-kit-1",
          name: "The CRED Elite Tech Onboarding Set",
          desc: "Premium insulated Stanley-style black tumbler, hardbound leather notebook with metallic pen, and customized CRED crew socks.",
          hasTshirt: true,
          items: [
            { name: "Insulated Black Tumbler", price: 0, image: "/images/imported/Stanley Sets/63d936bc994f71d1655702a1b430608f.jpg" },
            { name: "Leather Debossed Notebook", price: 0, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80" },
            { name: "Branded Crew Socks", price: 0, image: "/images/imported/Drop Shipping STuff/4ac8456b81d5eb98d039dc8cce7a1b77.jpg" }
          ]
        },
        {
          id: "cred-kit-2",
          name: "The CRED Coffee & Wellness Hamper",
          desc: "Single-origin Araku Valley coffee beans with custom ceramic mug, organic lavender soy candle, and gourmet chocolate brittle.",
          hasTshirt: false,
          items: [
            { name: "Araku Valley Coffee beans", price: 0, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80" },
            { name: "Organic Lavender Candle", price: 0, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&auto=format&fit=crop&q=80" },
            { name: "Almond Brittle treats", price: 0, image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=200&auto=format&fit=crop&q=80" }
          ]
        }
      ]
    },
    "TATA-FESTIVE-2026": {
      company: "TATA Consultancy Services",
      bgColor: "from-blue-50 to-blue-100/50 border-blue-200",
      themeColor: "#3B82F6",
      logo: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&auto=format&fit=crop&q=80",
      welcome: "Wishing you a warm festive season. Choose your TATA Diwali Celebration Hamper.",
      kits: [
        {
          id: "tata-kit-1",
          name: "TATA Royal Heritage Diwali Tray",
          desc: "Assortment of dry fruit kaju katli, two handcrafted clay brass diyas, and premium saffron tea.",
          hasTshirt: false,
          items: [
            { name: "Artisanal Kaju Katli (250g)", price: 0, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&auto=format&fit=crop&q=80" },
            { name: "Brass Diyas (Pair)", price: 0, image: "https://images.unsplash.com/photo-1605884768395-5cb5dbfb21be?w=200&auto=format&fit=crop&q=80" }
          ]
        }
      ]
    },
    "GOOGLE-ANNIVERSARY-2026": {
      company: "Google India",
      bgColor: "from-amber-50 to-amber-100/50 border-amber-200",
      themeColor: "#E2BA5F",
      logo: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=100&auto=format&fit=crop&q=80",
      welcome: "Congratulations on your work anniversary! Choose your custom milestones swag.",
      kits: [
        {
          id: "google-kit-1",
          name: "Google Tech Swag & Treats Kit",
          desc: "Google engraved thermal water bottle, wooden desk organizer, and premium dark chocolate truffles.",
          hasTshirt: true,
          items: [
            { name: "Thermal Flask Bottle", price: 0, image: "/images/imported/Drop Shipping STuff/bdcee014bb020d160f6ba54bb74dd638.webp" },
            { name: "Google Swag Cap", price: 0, image: "/images/imported/Drop Shipping STuff/4ac8456b81d5eb98d039dc8cce7a1b77.jpg" }
          ]
        }
      ]
    }
  };

  const validatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      const matched = mockTokens[passcode.trim().toUpperCase()];
      if (matched) {
        setCompanyInfo(matched);
        setSelectedKit(matched.kits[0]);
        setIsValidated(true);
      } else {
        setErrorMsg("Passcode not recognized. E.g. CRED-LAUNCH-2026, TATA-FESTIVE-2026, GOOGLE-ANNIVERSARY-2026.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#D1126A", "#F97316", "#E2BA5F"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#D1126A", "#F97316", "#E2BA5F"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKit || !companyInfo) return;
    setIsSubmitting(true);

    try {
      const payload = {
        deliveryMode: "physical",
        subtotal: 0,
        customerName: addressInfo.name,
        customerPhone: addressInfo.phone,
        customerEmail: addressInfo.email,
        shippingAddress: {
          ...addressInfo,
          tshirtSize: selectedKit.hasTshirt ? tshirtSize : null,
        },
        magicalLinkDetails: {
          corporateToken: true,
          companyName: companyInfo.company,
          passcodeUsed: passcode,
        },
        items: selectedKit.items.map((item: KitItem) => ({
          name: item.name,
          price: 0,
          quantity: 1,
        })),
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsClaimed(true);
        triggerConfetti();
      } else {
        alert("Fulfillment failed: " + (data.error || "Failed to connect."));
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#FAF9F5] text-slate-800 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-[200px] h-[200px] bg-saffron/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-rani-pink/5 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10 text-left">
        <AnimatePresence mode="wait">
          {/* STEP 1: Passcode Authorization Form */}
          {!isValidated && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto bg-white border border-slate-200 p-8 sm:p-12 rounded-[40px] shadow-sm space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-saffron/10 border border-saffron/30 rounded-full flex items-center justify-center mx-auto text-saffron">
                <Shield className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="font-heading text-2xl font-black text-teal-deep">Corporate Claim Portal</h1>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Enter your unique company claim passcode to unlock your customized onboarding or festive corporate kits.
                </p>
              </div>

              <form onSubmit={validatePasscode} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="E.g. CRED-LAUNCH-2026"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-slate-200 focus:border-saffron/40 focus:ring-1 focus:ring-saffron/20 rounded-xl px-4 py-3 text-center font-bold tracking-wider text-xs focus:outline-none placeholder-slate-400 text-slate-800 transition-all uppercase"
                />

                {errorMsg && (
                  <p className="text-[10px] text-rani-pink font-semibold text-center leading-normal">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-saffron text-teal-deep rounded-xl font-bold text-sm shadow hover:bg-gold-light transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin text-teal-deep" />
                  ) : (
                    <>
                      <span>Unwrap Corporate Portal</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: Branded Corporate Onboarding Page */}
          {isValidated && !isClaimed && companyInfo && (
            <motion.div
              key="portal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              {/* Branded welcome banner */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-[32px] flex items-center space-x-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={companyInfo.logo} alt={companyInfo.company} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] bg-saffron/10 border border-saffron/25 text-saffron font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {companyInfo.company} Partner Gifting
                  </span>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed pt-1.5">
                    {companyInfo.welcome}
                  </p>
                </div>
              </div>

              {/* Kit options */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-550">
                  Select Your Swag Onboarding Kit
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {companyInfo.kits.map((kit: Kit) => {
                    const isSelected = selectedKit?.id === kit.id;
                    return (
                      <button
                        key={kit.id}
                        type="button"
                        onClick={() => setSelectedKit(kit)}
                        className={`p-6 rounded-[28px] border text-left flex flex-col justify-between h-48 transition-all ${
                          isSelected
                            ? "border-saffron bg-saffron/5 shadow-sm scale-[1.01]"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-2">
                          <h4 className="font-heading font-bold text-base text-slate-800">{kit.name}</h4>
                          <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">{kit.desc}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full self-start ${
                          isSelected ? "bg-saffron text-teal-deep" : "bg-slate-105 text-slate-600 border border-slate-200"
                        }`}>
                          {isSelected ? "Selected" : "Select Option"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form address coordinates */}
              <form onSubmit={handleClaim} className="bg-white text-teal-deep p-6 sm:p-8 rounded-[32px] border border-slate-200 space-y-6 shadow-md">
                <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-rani-pink" />
                  <h3 className="font-heading text-lg font-bold">Provide Delivery Coordinates</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">Employee Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Tanvi Sharma"
                      value={addressInfo.name}
                      onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">Contact Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="E.g. +91 99999 88888"
                      value={addressInfo.phone}
                      onChange={(e) => setAddressInfo({ ...addressInfo, phone: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">Work Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="E.g. employee@tata.com"
                      value={addressInfo.email}
                      onChange={(e) => setAddressInfo({ ...addressInfo, email: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>
                  {selectedKit?.hasTshirt ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-teal-deep/60">Select T-shirt Size</label>
                      <select
                        value={tshirtSize}
                        onChange={(e) => setTshirtSize(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-teal-deep focus:outline-none focus:border-rani-pink/40"
                      >
                        <option value="S">Small (S)</option>
                        <option value="M">Medium (M)</option>
                        <option value="L">Large (L)</option>
                        <option value="XL">Extra Large (XL)</option>
                        <option value="XXL">Double Extra Large (XXL)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-4 rounded-xl">
                      <span>No clothing size selections required for this specific kit.</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-teal-deep/60">Fulfillment Address</label>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat / Building, Street name"
                    value={addressInfo.address}
                    onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Delhi"
                      value={addressInfo.city}
                      onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">State</label>
                    <input
                      type="text"
                      required
                      placeholder="Delhi"
                      value={addressInfo.state}
                      onChange={(e) => setAddressInfo({ ...addressInfo, state: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">ZIP / PIN Code</label>
                    <input
                      type="text"
                      required
                      placeholder="110001"
                      value={addressInfo.zip}
                      onChange={(e) => setAddressInfo({ ...addressInfo, zip: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-teal-deep hover:bg-teal-deep/95 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <span>Registering corporate details...</span>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Submit Delivery Details</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: Success Corporate Claimed */}
          {isValidated && isClaimed && (
            <motion.div
              key="claimed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white text-teal-deep p-8 rounded-[40px] text-center space-y-6 shadow-md border border-slate-200"
            >
              <div className="w-20 h-20 bg-saffron/10 border border-saffron/20 rounded-full flex items-center justify-center mx-auto text-saffron animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] bg-[#D1126A]/10 border border-rani-pink/20 text-rani-pink font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Fulfillment Registered
                </span>
                <h2 className="font-heading text-3xl font-black">Kit is Registered!</h2>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Excellent! We have logged your shipping parameters. 
                  The **{selectedKit?.name}** will be prepared and delivered directly to your doorstep.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center space-x-2 text-[10px] text-slate-450">
                <Truck className="w-3.5 h-3.5 animate-pulse" />
                <span>Delivery updates and tracking credentials will be sent to your work email.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
