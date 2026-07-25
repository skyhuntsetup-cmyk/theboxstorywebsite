"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Gift, MapPin, CheckCircle, Truck, Heart, Loader, Plus, Minus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "../../lib/supabase";

function ClaimGiftContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customizer state if recipientSelects is true
  const [bazaarList, setBazaarList] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  useEffect(() => {
    if (!orderId) {
      setErrorMsg("No gift identifier found in the URL. Please verify your claim link.");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error || !data) {
          setErrorMsg("This gift link is invalid or has already been claimed.");
        } else {
          setOrder(data);
          if (data.status === "claimed") {
            setIsClaimed(true);
            setIsOpen(true);
          }
        }
      } catch (err: any) {
        setErrorMsg("Failed to query gift coordinates.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Load bazaar if recipient customizable
  useEffect(() => {
    if (order?.magical_link_details?.recipientSelects) {
      const fetchBazaar = async () => {
        try {
          const { data } = await supabase
            .from("bazaar_items")
            .select("*")
            .eq("is_active", true);

          if (data && data.length > 0) {
            setBazaarList(data);
          } else {
            // fallback treats
            setBazaarList([
              { id: "bz-1", name: "Artisanal Kaju Katli (250g)", price: 450, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80", category: "Sweets" },
              { id: "bz-2", name: "Handcrafted Brass Diya (Pair)", price: 600, image: "https://images.unsplash.com/photo-1605884768395-5cb5dbfb21be?w=300&auto=format&fit=crop&q=80", category: "Decor" },
              { id: "bz-3", name: "Organic Lavender Soy Candle", price: 350, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&auto=format&fit=crop&q=80", category: "Wellness" },
              { id: "bz-4", name: "Premium Kashmiri Saffron (1g)", price: 550, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80", category: "Gourmet" }
            ]);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchBazaar();
    }
  }, [order]);

  const budgetLimit = order?.magical_link_details?.budgetTier || 2500;
  const maxItems = budgetLimit <= 1500 ? 3 : budgetLimit <= 2500 ? 4 : 5;

  const handleSelectItem = (item: any) => {
    const isAlreadySelected = selectedItems.some(x => x.id === item.id);
    if (isAlreadySelected) {
      setSelectedItems(selectedItems.filter(x => x.id !== item.id));
    } else {
      if (selectedItems.length >= maxItems) {
        alert(`You can select up to ${maxItems} items for this budget tier.`);
        return;
      }
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

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

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isCustomizable = order?.magical_link_details?.recipientSelects;
    if (isCustomizable && selectedItems.length === 0) {
      alert("Please select at least 1 treat to fill your customized box!");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatePayload: any = {
        status: "claimed",
        shipping_address: addressInfo,
      };

      // Write chosen items to the order record in database!
      if (isCustomizable) {
        updatePayload.items = selectedItems;
      }

      const { error } = await supabase
        .from("orders")
        .update(updatePayload)
        .eq("id", orderId);

      if (error) {
        alert("Fulfillment Error: " + error.message);
      } else {
        setIsClaimed(true);
        triggerConfetti();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <Loader className="w-10 h-10 text-saffron animate-spin" />
        <p className="text-sm text-[#FFFDF5]/70">Retrieving details of your custom gift...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 bg-white/5 border border-white/10 p-8 rounded-3xl">
        <Gift className="w-12 h-12 text-[#FFFDF5]/20 mx-auto" />
        <h2 className="font-heading text-xl font-bold text-saffron">Invalid Gift Link</h2>
        <p className="text-xs text-[#FFFDF5]/70 leading-relaxed">{errorMsg}</p>
        <a
          href="/"
          className="inline-block text-xs font-bold bg-[#FFFDF5] text-teal-deep px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
        >
          Go to Home
        </a>
      </div>
    );
  }

  const senderName = order?.customer_name || "A Special Friend";
  const greetingNote = order?.magical_link_details?.giftNote || "Hope this hamper brings celebration and joy into your home!";
  const isCustomizable = order?.magical_link_details?.recipientSelects && !isClaimed;
  
  // If claimed, read items from DB order record (which includes selectedItems now!)
  const boxItems = order?.status === "claimed" ? (order?.items || []) : (isCustomizable ? selectedItems : (order?.items || []));

  return (
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
                From <strong className="text-saffron font-bold">{senderName}</strong>. Click below to unwrap your custom handcrafted celebration hamper.
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
                <div className="absolute top-0 bottom-0 left-[47%] right-[47%] bg-gold/85 backdrop-blur-sm z-10" />
                <div className="absolute left-0 right-0 top-[47%] bottom-[47%] bg-gold/85 backdrop-blur-sm z-10" />
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
                Handwritten Note from {senderName}
              </span>
              <p className="font-heading text-lg sm:text-xl italic text-gold-light leading-relaxed max-w-lg mx-auto">
                &ldquo;{greetingNote}&rdquo;
              </p>
              <div className="flex justify-center items-center space-x-1.5 text-xs text-[#FFFDF5]/60">
                <Heart className="w-3.5 h-3.5 text-rani-pink fill-rani-pink" />
                <span>Sent with Love</span>
              </div>
            </div>

            {/* IF CUSTOMIZABLE: Display selection board */}
            {isCustomizable ? (
              <div className="space-y-4 bg-white/5 border border-white/5 p-6 rounded-3xl">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-saffron uppercase block">Customize Your Box</span>
                    <h3 className="font-heading text-base font-bold text-white">Choose Up to {maxItems} Treats</h3>
                  </div>
                  <span className="text-xs bg-saffron/10 border border-saffron/20 text-saffron font-bold px-3 py-1 rounded-full">
                    {selectedItems.length} / {maxItems} Filled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {bazaarList.map((item) => {
                    const isSelected = selectedItems.some(x => x.id === item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectItem(item)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-saffron bg-saffron/10 scale-[1.01]"
                            : "border-white/15 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="text-left space-y-0.5">
                            <span className="text-xs font-semibold text-white block leading-tight">{item.name}</span>
                            <span className="text-[10px] text-white/50">{item.category}</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected ? "bg-saffron border-saffron text-teal-deep" : "border-white/30 text-transparent"
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* IF PRE-CURATED: Display contents */
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFFDF5]/50 text-left">
                  Hamper Contents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {boxItems.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-between text-center space-y-3"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold leading-tight block">
                          {item.name}
                        </span>
                        {item.isCustomBox && (
                          <span className="text-[9px] text-gold font-bold">Custom Build</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Claim Address Form */}
            <form
              onSubmit={handleClaimSubmit}
              className="bg-[#FFFDF5] text-teal-deep p-6 sm:p-8 rounded-[32px] border border-teal-deep/5 space-y-6 shadow-xl text-left"
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
                We have registered your delivery coordinates. 
                The custom hamper sent by <strong className="text-saffron font-bold">{senderName}</strong> will be shipped shortly.
              </p>
            </div>

            {/* Display final selected items to recipient */}
            <div className="space-y-2 max-w-sm mx-auto bg-teal-deep/5 p-4 rounded-2xl border border-teal-deep/5">
              <span className="text-[10px] font-bold text-teal-deep/45 uppercase block mb-1">Your Custom Selection</span>
              <div className="flex flex-wrap gap-1 justify-center">
                {boxItems.map((item: any, idx: number) => (
                  <span key={idx} className="bg-teal-deep/10 text-teal-deep px-2 py-0.5 rounded text-[10px] font-semibold">
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2 text-[10px] text-teal-deep/50">
              <Truck className="w-3.5 h-3.5 animate-pulse" />
              <span>ETA: 3 to 4 business days. Delivery tracking details will be sent via SMS.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ClaimGift() {
  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-[#021818] via-[#042F2E] to-black text-[#FFFDF5] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-[200px] h-[200px] bg-saffron/10 rounded-full blur-3xl filter animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-rani-pink/5 rounded-full blur-3xl filter animate-pulse" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader className="w-10 h-10 text-saffron animate-spin" />
          <p className="text-sm text-[#FFFDF5]/70">Loading claim portal...</p>
        </div>
      }>
        <ClaimGiftContent />
      </Suspense>
    </div>
  );
}
