"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, MapPin, Truck, CheckCircle2, ChevronRight, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { CustomFieldDef } from "../../lib/types";

interface CampaignProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface CampaignBranding {
  id: string;
  name: string;
  logo_url: string | null;
  campaign_type: "single" | "choice";
  custom_fields: CustomFieldDef[];
}

function ClaimTokenContent() {
  const searchParams = useSearchParams();
  const prefillCode = searchParams.get("code") || "";

  const [passcode, setPasscode] = useState(prefillCode);
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [campaign, setCampaign] = useState<CampaignBranding | null>(null);
  const [products, setProducts] = useState<CampaignProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [addressInfo, setAddressInfo] = useState({
    name: "", address: "", city: "", state: "", zip: "", phone: "", email: "",
  });
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  const validatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/claim-campaign/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: passcode }),
      });
      const data = await res.json();
      if (data.success) {
        setCampaign(data.campaign);
        setProducts(data.products);
        if (data.campaign.campaign_type === "single" && data.products[0]) {
          setSelectedProductId(data.products[0].id);
        }
        setIsValidated(true);
      } else {
        setErrorMsg(data.error || "Passcode not recognized.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#D1126A", "#F97316", "#E2BA5F"] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#D1126A", "#F97316", "#E2BA5F"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    if (campaign.campaign_type === "choice" && !selectedProductId) {
      alert("Please select a hamper option.");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/claim-campaign/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: passcode,
          selectedProductId,
          recipientName: addressInfo.name,
          recipientPhone: addressInfo.phone,
          recipientEmail: addressInfo.email || undefined,
          shippingAddress: {
            address: addressInfo.address,
            city: addressInfo.city,
            state: addressInfo.state,
            zip: addressInfo.zip,
          },
          customFieldAnswers: customAnswers,
        }),
      });
      const data = await res.json();
      if (data.success) {
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

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-[90vh] bg-[#FAF9F5] text-slate-800 flex items-center justify-center px-6 py-10 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-[200px] h-[200px] bg-saffron/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-rani-pink/5 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10 text-left">
        <AnimatePresence mode="wait">
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
                  Enter your unique claim code to unlock your gifting kit.
                </p>
              </div>

              <form onSubmit={validatePasscode} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="E.g. 7K2P9QXR"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-slate-200 focus:border-saffron/40 focus:ring-1 focus:ring-saffron/20 rounded-xl px-4 py-3 text-center font-bold tracking-wider text-xs focus:outline-none placeholder-slate-400 text-slate-800 transition-all uppercase"
                />

                {errorMsg && (
                  <p className="text-[12px] text-rani-pink font-semibold text-center leading-normal">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-saffron text-teal-deep rounded-xl font-bold text-sm shadow hover:bg-gold-light transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? <Loader className="w-4 h-4 animate-spin text-teal-deep" /> : (
                    <>
                      <span>Unwrap Corporate Portal</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {isValidated && !isClaimed && campaign && (
            <motion.div
              key="portal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-[32px] flex items-center space-x-4 shadow-sm">
                {campaign.logo_url && (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={campaign.logo_url} alt={campaign.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[12px] bg-saffron/10 border border-saffron/25 text-saffron font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {campaign.name}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed pt-1.5">
                    Welcome! Confirm your gift and delivery details below.
                  </p>
                </div>
              </div>

              {campaign.campaign_type === "choice" ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-550">Select Your Hamper</h3>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {products.map((p) => {
                      const isSelected = selectedProductId === p.id;
                      return (
                        <motion.button
                          key={p.id}
                          type="button"
                          variants={{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedProductId(p.id)}
                          className={`p-4 rounded-[28px] border text-left flex flex-col justify-between h-48 transition-colors ${
                            isSelected ? "border-saffron bg-saffron/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          {p.image_url && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={p.image_url} alt={p.name} className="w-full h-20 object-cover rounded-xl mb-2" />
                          )}
                          <div className="space-y-1 flex-1">
                            <h4 className="font-heading font-bold text-sm text-slate-800">{p.name}</h4>
                            {p.description && <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">{p.description}</p>}
                          </div>
                          <motion.span
                            animate={isSelected ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                            className={`text-[12px] font-bold px-3 py-1 rounded-full self-start ${isSelected ? "bg-saffron text-teal-deep" : "bg-slate-105 text-slate-600 border border-slate-200"}`}
                          >
                            {isSelected ? "Selected" : "Select Option"}
                          </motion.span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              ) : selectedProduct && (
                <div className="bg-white border border-slate-200 rounded-[28px] p-6 flex items-center space-x-4">
                  {selectedProduct.image_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-[12px] font-bold text-teal-deep/50 uppercase tracking-wider block">You&apos;re Getting</span>
                    <h4 className="font-heading font-bold text-base text-slate-800">{selectedProduct.name}</h4>
                    {selectedProduct.description && <p className="text-[13px] text-slate-500 mt-1">{selectedProduct.description}</p>}
                  </div>
                </div>
              )}

              <form onSubmit={handleClaim} className="bg-white text-teal-deep p-6 sm:p-8 rounded-[32px] border border-slate-200 space-y-6 shadow-md">
                <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-rani-pink" />
                  <h3 className="font-heading text-lg font-bold">Provide Delivery Coordinates</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Full Name</label>
                    <input type="text" required value={addressInfo.name} onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Contact Number</label>
                    <input type="tel" required value={addressInfo.phone} onChange={(e) => setAddressInfo({ ...addressInfo, phone: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-teal-deep/60">Email (optional)</label>
                  <input type="email" value={addressInfo.email} onChange={(e) => setAddressInfo({ ...addressInfo, email: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40" />
                </div>

                {campaign.custom_fields.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">{field.label}{field.required && " *"}</label>
                    {field.type === "dropdown" ? (
                      <select
                        required={field.required}
                        value={customAnswers[field.key] || ""}
                        onChange={(e) => setCustomAnswers({ ...customAnswers, [field.key]: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-teal-deep focus:outline-none focus:border-rani-pink/40"
                      >
                        <option value="">Select...</option>
                        {(field.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        required={field.required}
                        value={customAnswers[field.key] || ""}
                        onChange={(e) => setCustomAnswers({ ...customAnswers, [field.key]: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                      />
                    )}
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-teal-deep/60">Fulfillment Address</label>
                  <input type="text" required placeholder="House / Flat / Building, Street name" value={addressInfo.address} onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">City</label>
                    <input type="text" required value={addressInfo.city} onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">State</label>
                    <input type="text" required value={addressInfo.state} onChange={(e) => setAddressInfo({ ...addressInfo, state: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">ZIP / PIN Code</label>
                    <input type="text" required value={addressInfo.zip} onChange={(e) => setAddressInfo({ ...addressInfo, zip: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none" />
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

          {isValidated && isClaimed && campaign && (
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
                <span className="text-[12px] bg-[#D1126A]/10 border border-rani-pink/20 text-rani-pink font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Fulfillment Registered
                </span>
                <h2 className="font-heading text-3xl font-black">Kit is Registered!</h2>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Excellent! We have logged your shipping parameters.
                  {selectedProduct && <> The <strong>{selectedProduct.name}</strong> will be prepared and delivered directly to your doorstep.</>}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center space-x-2 text-[12px] text-slate-450">
                <Truck className="w-3.5 h-3.5 animate-pulse" />
                <span>Delivery updates will be sent to your provided contact details.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ClaimToken() {
  return (
    <Suspense fallback={<div className="min-h-[90vh] flex items-center justify-center"><Loader className="w-6 h-6 animate-spin text-teal-deep/40" /></div>}>
      <ClaimTokenContent />
    </Suspense>
  );
}
