"use client";

import React, { useState } from "react";
import { curatedProducts, Product } from "../../data/products";
import { ProductCard } from "../../components/ProductCard";
import { Sparkles, Send, Bot, User, ArrowRight, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  recommendations?: Product[];
}

export default function GiftGenie() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Namaste! I am the Gift Genie. Tell me who you are gifting for, the occasion, or your budget, and I will recommend the perfect hamper combinations.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const presets = [
    "Corporate gift for my team under ₹2500",
    "Traditional Diwali gift for parents",
    "Romance anniversary box for wife",
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking and filtering products
    setTimeout(() => {
      let filtered: Product[] = [];
      const query = text.toLowerCase();

      if (query.includes("diwali") || query.includes("parents") || query.includes("festive") || query.includes("traditional")) {
        filtered = curatedProducts.filter((p) => p.category === "Diwali" || p.category === "Weddings");
      } else if (query.includes("corporate") || query.includes("team") || query.includes("boss") || query.includes("office")) {
        filtered = curatedProducts.filter((p) => p.category === "Corporate");
      } else if (query.includes("anniversary") || query.includes("wife") || query.includes("romance") || query.includes("couple")) {
        filtered = curatedProducts.filter((p) => p.category === "Anniversary" || p.category === "Housewarming");
      } else {
        // Fallback: pick any 3 items
        filtered = curatedProducts.slice(0, 3);
      }

      // If we filtered and got too few, fill with other items
      if (filtered.length === 0) {
        filtered = curatedProducts.slice(0, 3);
      } else if (filtered.length > 3) {
        filtered = filtered.slice(0, 3);
      }

      const genieMsg: ChatMessage = {
        id: `genie-${Date.now()}`,
        sender: "bot",
        text: `Based on your request "${text}", I have handpicked these exceptional premium hampers that match your theme perfectly. They convey elegance and celebration.`,
        recommendations: filtered,
      };

      setMessages((prev) => [...prev, genieMsg]);
      setIsLoading(false);
    }, 2200);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 flex flex-col min-h-[80vh]">
      {/* Page Header */}
      <section className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-saffron/10 to-rani-pink/10 border border-saffron/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-saffron uppercase">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Gift Genie AI Suggestor</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-teal-deep">
          Consult the Genie
        </h1>
        <p className="text-xs text-teal-deep/75 max-w-md mx-auto">
          Describe the recipient, occasion, or budget, and our AI will immediately recommend premium gift boxes.
        </p>
      </section>

      {/* Chat Portal Container */}
      <div className="flex-1 bg-gradient-to-b from-[#042F2E]/95 to-[#021818] text-[#FFFDF5] rounded-3xl border border-[#FFFDF5]/10 shadow-2xl flex flex-col overflow-hidden min-h-[500px]">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex space-x-3.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Bot Icon */}
                {msg.sender === "bot" && (
                  <div className="w-9 h-9 rounded-full bg-saffron/20 border border-saffron/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-saffron" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className="space-y-4 max-w-[85%]">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-rani-pink text-white rounded-br-none"
                        : "bg-[#FFFDF5]/10 border border-white/5 rounded-bl-none text-[#FFFDF5]"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Recommendations Grid */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                      {msg.recommendations.map((prod) => (
                        <div key={prod.id} className="text-teal-deep">
                          <ProductCard product={prod} />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* User Icon */}
                {msg.sender === "user" && (
                  <div className="w-9 h-9 rounded-full bg-rani-pink/20 border border-rani-pink/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-rani-pink" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Animation */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex space-x-3 items-center"
            >
              <div className="w-9 h-9 rounded-full bg-saffron/20 border border-saffron/30 flex items-center justify-center flex-shrink-0 animate-spin">
                <RefreshCw className="w-4 h-4 text-saffron" />
              </div>
              <div className="bg-[#FFFDF5]/10 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none text-xs flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-saffron animate-bounce" />
                <span>Genie is curating combinations...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Predefined Presets */}
        <div className="px-6 py-3 border-t border-[#FFFDF5]/5 bg-black/10 flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSend(preset)}
              className="text-[10px] sm:text-xs font-semibold px-3 py-1.5 bg-[#FFFDF5]/10 hover:bg-[#FFFDF5]/20 border border-white/10 rounded-full transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-black/20 border-t border-[#FFFDF5]/10 flex items-center space-x-3">
          <input
            type="text"
            disabled={isLoading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(input);
            }}
            placeholder="E.g., Elegant anniversary gift box with sweets and spa candles"
            className="flex-1 bg-white/5 border border-white/10 focus:border-saffron/40 focus:ring-1 focus:ring-saffron/20 rounded-full px-5 py-3 text-sm focus:outline-none placeholder-white/40 text-white transition-all"
          />
          <button
            disabled={isLoading || !input.trim()}
            onClick={() => handleSend(input)}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
              !input.trim() || isLoading
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : "bg-saffron text-teal-deep hover:bg-saffron/90 shadow-md hover:shadow-lg transform active:scale-95"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
