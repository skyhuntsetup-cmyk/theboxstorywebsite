"use client";

import React, { useState } from "react";
import { Sparkles, Gift, MapPin, CheckCircle, Truck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function ClaimGift() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  // Mock hamper details sent in the link
  const mockSender = "Rishabh Arora";
  const mockNote = "Wishing you a wonderful festival filled with warmth, sweets, and happiness! Enjoy this little hamper of treats.";
  const mockItems = [
    { name: "Artisanal Kaju Katli (250g)", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&auto=format&fit=crop&q=80" },
    { name: "Handcrafted Brass Diya (Pair)", image: "https://images.unsplash.com/photo-1605884768395-5cb5dbfb21be?w=200&auto=format&fit=crop&q=80" },
    { name: "Organic Lavender Soy Candle", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&auto=format&fit=crop&q=80" },
  ];

  const triggerConfetti = () => {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleOpenBox = () => {
    setIsOpen(true);
    triggerConfetti();
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsClaimed(true);
      triggerConfetti();
    }, 1500);
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-[#021818] via-[#042F2E] to-black text-[#FFFDF5] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Star sparkles */}
      <div className="absolute top-20 left-10 w-[200px] h-[200px] bg-saffron/10 rounded-full blur-3xl filter animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-rani-pink/5 rounded-full blur-3xl filter animate-pulse" />

      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          {/* STATE 1: Unopened box */}
          {!isOpen && (
            <motion.div
              key="unopened"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-1.5 bg-saffron/10 border border-saffron/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-saffron uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>A Gift Awaits You</span>
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                  You&apos;ve Received <br />a Box of Joy!
                </h1>
                <p className="text-sm text-[#FFFDF5]/70 max-w-sm mx-auto leading-relaxed">
                  From <strong className="text-saffron font-bold">{mockSender}</strong>. Click below to unwrap your custom handcrafted celebration hamper.
                </p>
              </div>

              {/* Pulsing Gift Box container */}
              <div className="flex justify-center py-6">
                <motion.button
                  onClick={handleOpenBox}
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, -1, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className="w-48 h-48 bg-gradient-to-tr from-rani-pink to-saffron rounded-[36px] flex items-center justify-center shadow-[0_20px_50px_rgba(209,18,106,0.35)] border border-[#FFFDF5]/20 hover:scale-105 active:scale-95 transition-transform duration-300 relative group cursor-pointer"
                >
                  <div className="absolute inset-2 border-2 border-dashed border-[#FFFDF5]/25 rounded-[28px] flex items-center justify-center">
                    <Gift className="w-20 h-20 text-white transition-transform group-hover:scale-110" />
                  </div>
                  {/* Decorative ribbon ribbon */}
                  <div className="absolute top-0 bottom-0 left-[47%] right-[47%] bg-gold/80 backdrop-blur-sm z-10" />
                  <div className="absolute left-0 right-0 top-[47%] bottom-[47%] bg-gold/80 backdrop-blur-sm z-10" />
                </motion.button>
              </div>

              <button
                onClick={handleOpenBox}
                className="px-8 py-3.5 bg-[#FFFDF5] text-teal-deep rounded-full text-sm font-bold shadow-lg hover:bg-gold-light hover:shadow-xl transition-all"
              >
                Tap to Unwrap
              </button>
            </motion.div>
          )}

          {/* STATE 2: Opened box & claim form */}
          {isOpen && !isClaimed && (
            <motion.div
              key="opened"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              {/* Header card with note */}
              <div className="bg-[#FFFDF5]/10 border border-white/5 p-6 sm:p-8 rounded-[32px] space-y-4 text-center">
                <span className="text-[10px] bg-saffron/20 border border-saffron/30 text-saffron font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Handwritten Note from {mockSender}
                </span>
                {/* Note font styling */}
                <p className="font-heading text-lg sm:text-xl italic text-gold-light leading-relaxed max-w-lg mx-auto">
                  &ldquo;{mockNote}&rdquo;
                </p>
                <div className="flex justify-center items-center space-x-1.5 text-xs text-[#FFFDF5]/60">
                  <Heart className="w-3.5 h-3.5 text-rani-pink fill-rani-pink" />
                  <span>Sent with Love</span>
                </div>
              </div>

              {/* Box Contents */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFDF5]/50">
                  Hamper Contents
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {mockItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-between text-center space-y-2"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80";
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold leading-tight line-clamp-2 max-w-[120px]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Claim Address Form */}
              <form
                onSubmit={handleClaimSubmit}
                className="bg-[#FFFDF5] text-teal-deep p-6 sm:p-8 rounded-[32px] border border-teal-deep/5 space-y-6 shadow-xl"
              >
                <div className="border-b border-teal-deep/10 pb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-rani-pink" />
                  <h3 className="font-heading text-lg font-bold">Provide Delivery Address</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Tanvi Sharma"
                      value={addressInfo.name}
                      onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
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
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-teal-deep/60">Delivery Address</label>
                  <input
                    type="text"
                    required
                    placeholder="House / Office details, Building, Street"
                    value={addressInfo.address}
                    onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })}
                    className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">City</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Delhi"
                      value={addressInfo.city}
                      onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">State</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Delhi NCR"
                      value={addressInfo.state}
                      onChange={(e) => setAddressInfo({ ...addressInfo, state: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
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
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-teal-deep hover:bg-teal-deep/95 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <span>Registering Address details...</span>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Submit Delivery Address</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STATE 3: Success Claimed */}
          {isOpen && isClaimed && (
            <motion.div
              key="claimed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white text-teal-deep p-8 rounded-[40px] text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-saffron/10 border border-saffron/20 rounded-full flex items-center justify-center mx-auto text-saffron animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] bg-[#D1126A]/10 border border-rani-pink/20 text-rani-pink font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Success
                </span>
                <h2 className="font-heading text-3xl font-black">Gift is Registered!</h2>
                <p className="text-xs text-teal-deep/70 max-w-sm mx-auto leading-relaxed">
                  Excellent, <strong className="text-teal-deep font-bold">{addressInfo.name}</strong>. We have registered your delivery coordinates. 
                  The custom hamper sent by <strong className="text-saffron font-bold">{mockSender}</strong> will be shipped to:
                </p>
                <p className="text-xs bg-[#FFFDF5] border border-teal-deep/15 p-3 rounded-xl italic font-semibold max-w-sm mx-auto">
                  {addressInfo.address}, {addressInfo.city}, {addressInfo.state} - {addressInfo.zip}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center space-x-2 text-[10px] text-teal-deep/50">
                <Truck className="w-3.5 h-3.5 animate-pulse" />
                <span>ETA: 3 to 4 business days. Tracking details sent to {addressInfo.phone}.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
