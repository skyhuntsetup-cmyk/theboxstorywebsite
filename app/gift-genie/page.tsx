"use client";

import React, { useState, useRef } from "react";
import { curatedProducts, Product } from "../../data/products";
import { Sparkles, Send, Bot, User, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
      text: "Namaste! I am the Gift Genie. Tell me who you are gifting for, the occasion, or your budget (e.g. under ₹2000), and I will recommend the perfect hamper combinations.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const nextId = useRef(0);

  const presets = [
    "Corporate gifts for my team under ₹2500",
    "Traditional Diwali gift for parents",
    "Romance anniversary box for spouse",
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${nextId.current++}`,
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      let filtered: Product[] = [];
      const query = text.toLowerCase();

      if (query.includes("corp") || query.includes("team") || query.includes("office") || query.includes("exec")) {
        filtered = curatedProducts.filter((p) => p.category === "Corporate");
      } else if (query.includes("diwali") || query.includes("fest") || query.includes("sweets") || query.includes("mithai")) {
        filtered = curatedProducts.filter((p) => p.category === "Diwali");
      } else if (query.includes("wedding") || query.includes("brides") || query.includes("couple") || query.includes("marriage")) {
        filtered = curatedProducts.filter((p) => p.category === "Weddings");
      } else if (query.includes("anniv") || query.includes("wife") || query.includes("love") || query.includes("husband") || query.includes("spouse")) {
        filtered = curatedProducts.filter((p) => p.category === "Anniversary");
      } else if (query.includes("house") || query.includes("warm") || query.includes("home")) {
        filtered = curatedProducts.filter((p) => p.category === "Housewarming");
      } else {
        filtered = curatedProducts.slice(0, 3);
      }

      if (query.includes("under") || query.includes("below") || query.includes("within")) {
        const numbers = query.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const limit = parseInt(numbers[0], 10);
          filtered = filtered.filter((p) => p.price <= limit);
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${nextId.current++}`,
        sender: "bot",
        text: `Here are the matching gift hamper combinations I found inside the catalog:`,
        recommendations: filtered.slice(0, 3),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 py-12 px-6 relative overflow-hidden flex flex-col justify-between">
      {/* Light background glows */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-100 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-50 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between space-y-8">
        
        {/* Editorial header */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-teal-deep/5 border border-teal-deep/15 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-deep uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-teal-deep" />
            <span>AI Assistant</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-teal-deep tracking-tight">
            AI Gift Genie
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Whisper your parameters to the genie. Unravel the perfect celebratory bundles automatically.
          </p>
        </section>

        {/* Chat History Panel */}
        <div className="flex-1 min-h-[400px] bg-white border border-slate-200 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm rounded-[40px] overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto space-y-6 max-h-[450px] pr-1">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start space-x-3.5`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-teal-deep flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  )}

                  <div className="space-y-4 max-w-[85%] text-left">
                    <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-teal-deep text-white rounded-tr-none"
                        : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>

                    {/* Recommendations horizontal carousel */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {msg.recommendations.map((prod) => (
                          <motion.div
                            key={prod.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-3 space-y-3 shadow-sm"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prod.image} alt={prod.name} className="w-full aspect-[4/3] object-cover rounded-xl" />
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-slate-800 block truncate leading-snug">{prod.name}</span>
                              <span className="text-[10px] text-saffron font-bold block">₹{prod.price}</span>
                            </div>
                            <Link
                              href={`/collections`}
                              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[9px] block text-center uppercase tracking-wider transition-colors"
                            >
                              Details
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-teal-deep flex-shrink-0 shadow-sm">
                      <User className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start items-center space-x-3 animate-pulse"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-deep flex items-center justify-center text-white flex-shrink-0 animate-spin">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-500">Genie is filtering hampers...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preset Chips */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(preset)}
                  className="text-[10px] font-bold bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-full hover:bg-slate-100 text-teal-deep transition-colors uppercase tracking-wider"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center space-x-2 border-t border-slate-100 pt-4"
          >
            <input
              type="text"
              placeholder="Tell the Genie e.g. corporate gifts under ₹2500..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-teal-deep rounded-xl px-4 py-3 text-xs focus:outline-none placeholder-slate-400 text-slate-800 transition-colors"
            />
            <button
              type="submit"
              className="p-3 bg-teal-deep text-white rounded-xl shadow hover:bg-teal-deep/90 transition-all transform active:scale-95"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
