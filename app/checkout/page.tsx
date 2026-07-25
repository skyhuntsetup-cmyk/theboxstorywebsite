"use client";

import React, { useState } from "react";
import { useGift } from "../context/GiftContext";
import { ShieldCheck, CreditCard, Send, MapPin, Sparkles, Check, CheckCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function Checkout() {
  const { cartItems, clearCart } = useGift();
  const [deliveryMode, setDeliveryMode] = useState<"physical" | "magical">("physical");
  const [createdOrderId, setCreatedOrderId] = useState<string>("");

  // ... (form states and other variables)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
  });

  const [magicalInfo, setMagicalInfo] = useState({
    recipientName: "",
    recipientContact: "",
    giftNote: "",
  });

  // Payment states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"none" | "authorizing" | "success">("none");

  const subtotal = cartItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

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

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setPaymentStep("authorizing");

    const payload = {
      deliveryMode,
      subtotal,
      customerName: deliveryMode === "physical" ? `${shippingInfo.firstName} ${shippingInfo.lastName}` : null,
      customerPhone: deliveryMode === "physical" ? shippingInfo.phone : null,
      customerEmail: deliveryMode === "physical" ? shippingInfo.email : null,
      shippingAddress: deliveryMode === "physical" ? shippingInfo : null,
      magicalLinkDetails: deliveryMode === "magical" ? magicalInfo : null,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isCustomBox: item.isCustomBox || false,
        boxItems: item.boxItems || null,
      })),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCreatedOrderId(data.order.id);
        setPaymentStep("success");
        setPaymentSuccess(true);
        setIsProcessingPayment(false);
        triggerConfetti();
        clearCart();
      } else {
        alert("Transaction Failed: " + (data.error || "Please review connection settings."));
        setIsProcessingPayment(false);
      }
    } catch (err: any) {
      alert("Network Error: " + err.message);
      setIsProcessingPayment(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-teal-deep/5 rounded-[40px] p-8 text-center space-y-6 shadow-xl relative overflow-hidden"
        >
          {/* Confetti details */}
          <div className="w-20 h-20 bg-saffron/10 border border-saffron/20 rounded-full flex items-center justify-center mx-auto text-saffron animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D1126A] bg-[#D1126A]/10 px-3.5 py-1.5 rounded-full">
              Order Placed Successfully
            </span>
            <h1 className="font-heading text-3xl font-black text-teal-deep">
              Celebrate the Moment!
            </h1>
            <p className="text-xs text-teal-deep/75 max-w-sm mx-auto leading-relaxed">
              Your order has been recorded and the Razorpay gateway confirmed your receipt. 
              {deliveryMode === "magical" ? (
                <span> We have generated your <strong>Magical Gift Link</strong>. You can send it to your recipient to let them claim their package.</span>
              ) : (
                <span> We are preparing your box and will ship it to the provided address shortly.</span>
              )}
            </p>
          </div>

          {deliveryMode === "magical" && (
            <div className="bg-[#042F2E]/5 border border-teal-deep/5 p-4 rounded-2xl text-left space-y-2">
              <span className="text-[10px] font-bold text-teal-deep/50 uppercase">Your Magical Link</span>
              <div className="flex items-center justify-between bg-white border border-teal-deep/10 px-4 py-2.5 rounded-xl">
                <code className="text-xs text-rani-pink font-semibold truncate select-all pr-4">
                  {typeof window !== "undefined" ? `${window.location.origin}/claim-gift?id=${createdOrderId}` : `https://theboxstory.in/claim-gift?id=${createdOrderId}`}
                </code>
                <Link
                  href={`/claim-gift?id=${createdOrderId}`}
                  className="text-xs font-bold text-teal-deep hover:underline flex items-center space-x-1 flex-shrink-0"
                >
                  <span>Test Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-teal-deep/5 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="text-xs font-bold bg-teal-deep text-white px-6 py-3 rounded-full hover:bg-teal-deep/90 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/collections"
              className="text-xs font-bold border border-teal-deep text-teal-deep px-6 py-3 rounded-full hover:bg-teal-deep/5 transition-colors"
            >
              Continue Gifting
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <h1 className="font-heading text-3xl md:text-4xl font-black text-teal-deep text-center">
        Complete Purchase
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white/40 border border-teal-deep/5 rounded-3xl p-12 text-center space-y-4">
          <p className="text-sm text-teal-deep/75">Your celebration bag is empty. Please add items to checkout.</p>
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 text-xs font-bold bg-teal-deep text-[#FFFDF5] px-6 py-3 rounded-full"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Mode Toggle */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl border border-teal-deep/5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-deep/60 flex items-center space-x-2">
                <span>Select Gifting Method</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMode("physical")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-24 ${
                    deliveryMode === "physical"
                      ? "border-teal-deep bg-teal-deep/5 ring-2 ring-teal-deep/10"
                      : "border-teal-deep/10 opacity-70 hover:opacity-100 bg-[#FFFDF5]"
                  }`}
                >
                  <MapPin className="w-5 h-5 text-teal-deep" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-teal-deep block">Ship to Address</span>
                    <span className="text-[10px] text-teal-deep/50">Standard courier delivery</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMode("magical")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-24 ${
                    deliveryMode === "magical"
                      ? "border-teal-deep bg-teal-deep/5 ring-2 ring-teal-deep/10"
                      : "border-teal-deep/10 opacity-70 hover:opacity-100 bg-[#FFFDF5]"
                  }`}
                >
                  <Send className="w-5 h-5 text-rani-pink" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-teal-deep block">Send via Magical Link</span>
                    <span className="text-[10px] text-teal-deep/50">Recipient fills their own address</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Address fields vs Magical Link details */}
            <AnimatePresence mode="wait">
              {deliveryMode === "physical" ? (
                <motion.div
                  key="physical"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl border border-teal-deep/5 shadow-sm space-y-4"
                >
                  <h3 className="font-heading text-lg font-bold text-teal-deep">Shipping Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Last Name"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Address Line 1"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                    <input
                      type="text"
                      required
                      placeholder="ZIP / Postal Code"
                      value={shippingInfo.zip}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Phone"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="magical"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl border border-teal-deep/5 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-teal-deep/10 pb-3">
                    <h3 className="font-heading text-lg font-bold text-teal-deep">Magical Link Generation</h3>
                    <Sparkles className="w-5 h-5 text-saffron animate-pulse" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-teal-deep/60">Recipient Name</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Tanvi Sharma"
                        value={magicalInfo.recipientName}
                        onChange={(e) => setMagicalInfo({ ...magicalInfo, recipientName: e.target.value })}
                        className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-teal-deep/60">Recipient WhatsApp or Email</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. +91 99999 88888"
                        value={magicalInfo.recipientContact}
                        onChange={(e) => setMagicalInfo({ ...magicalInfo, recipientContact: e.target.value })}
                        className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rani-pink/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-deep/60">Handwritten Note (Cursive Render)</label>
                    <textarea
                      rows={4}
                      placeholder="Write a message. It will render in a beautiful handwriting font on their claim page..."
                      value={magicalInfo.giftNote}
                      onChange={(e) => setMagicalInfo({ ...magicalInfo, giftNote: e.target.value })}
                      className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-2xl px-4 py-3 text-sm italic font-medium focus:outline-none focus:border-rani-pink/40 resize-none font-heading text-teal-deep/90"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Summary Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-teal-deep text-[#FFFDF5] p-6 rounded-[32px] border border-white/10 shadow-lg space-y-6">
              <h3 className="font-heading text-xl font-bold border-b border-white/10 pb-4">
                Summary of Joy
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="font-semibold truncate max-w-[200px]">
                      {item.name} <span className="text-white/55">x{item.quantity}</span>
                    </span>
                    <span className="font-bold text-gold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#FFFDF5]/70">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#FFFDF5]/70">
                  <span>Shipping</span>
                  <span className="text-gold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-2">
                  <span>Total Amount</span>
                  <span className="text-gold text-base">₹{subtotal}</span>
                </div>
              </div>

              {/* Payment Processing Indicator */}
              <AnimatePresence>
                {isProcessingPayment && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-white/10 border border-white/5 rounded-2xl flex items-center space-x-3 text-xs"
                  >
                    <div className="w-4.5 h-4.5 border-2 border-gold border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <span>Razorpay is authorizing transaction. Please do not close...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Purchase button */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full flex items-center justify-center space-x-2 py-4 bg-white hover:bg-gold-light text-teal-deep rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-teal-deep" />
                <span>Pay via Razorpay</span>
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-white/50">
                <CreditCard className="w-3.5 h-3.5" />
                <span>SSL Encrypted Secure Gateway Connection</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
