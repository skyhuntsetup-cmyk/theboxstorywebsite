"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import type { CategoryRow, ProductWithCategories } from "../../lib/types";
import { Sparkles, Send, Bot, User, RefreshCw, Mic, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  recommendations?: ProductWithCategories[];
  categorySlug?: string;
}

// Minimal typing for the browser's built-in Web Speech API (not in the
// standard TS DOM lib). Chrome/Edge expose it as webkitSpeechRecognition;
// Firefox doesn't support it at all, hence the feature-detection below.
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

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
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const nextId = useRef(0);

  // Voice: speech-to-text via the browser's mic, text-to-speech for replies.
  // Both are free (no API calls) but only work where the browser supports
  // them — Chrome/Edge have both, Safari has speech synthesis only, Firefox
  // has neither, so every control below is feature-detected and hidden
  // rather than shown broken.
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor = (window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;

    if (SpeechRecognitionCtor) {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";
      recognitionRef.current = recognition;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- feature-detecting Web Speech API support, only knowable client-side post-mount
      setSpeechSupported(true);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Live catalog, so the Genie always recommends what's actually stocked and
  // tagged in Admin rather than a stale, hand-picked seed list.
  useEffect(() => {
    const load = async () => {
      const [{ data: catData }, { data: prodData }] = await Promise.all([
        supabase.from("categories").select("*").eq("is_active", true),
        supabase.from("products").select("*, product_categories(category_id)").order("name"),
      ]);
      if (catData) setCategories(catData);
      if (prodData) {
        setProducts(
          prodData.map((p) => {
            const { product_categories, ...rest } = p as typeof p & { product_categories: { category_id: string }[] };
            return { ...rest, categoryIds: (product_categories || []).map((pc: { category_id: string }) => pc.category_id) };
          })
        );
      }
    };
    load();
  }, []);

  const presets = [
    "Corporate gifts for my team under ₹2500",
    "Traditional Diwali gift for parents",
    "Romance anniversary box for spouse",
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${nextId.current++}`,
      sender: "user",
      text,
    };
    // Snapshot of the conversation so far, sent along so the Genie has
    // context for follow-up questions ("what about under 1500?").
    const history = messages.map((m) => ({ role: m.sender === "user" ? ("user" as const) : ("assistant" as const), text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gift-genie/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();

      if (!data.success) {
        const botMsg: ChatMessage = {
          id: `bot-${nextId.current++}`,
          sender: "bot",
          text: data.error || "Sorry, I couldn't process that — please try again.",
        };
        setMessages((prev) => [...prev, botMsg]);
        speak(botMsg.text);
        return;
      }

      const recommendedProducts = (data.productIds as string[])
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is ProductWithCategories => Boolean(p));
      const firstCategoryId = recommendedProducts[0]?.categoryIds[0];
      const categorySlug = firstCategoryId ? categories.find((c) => c.id === firstCategoryId)?.slug : undefined;

      const botMsg: ChatMessage = {
        id: `bot-${nextId.current++}`,
        sender: "bot",
        text: data.reply,
        recommendations: recommendedProducts.length > 0 ? recommendedProducts : undefined,
        categorySlug,
      };
      setMessages((prev) => [...prev, botMsg]);
      speak(data.reply);
    } catch {
      const botMsg: ChatMessage = {
        id: `bot-${nextId.current++}`,
        sender: "bot",
        text: "Sorry, something went wrong reaching the Genie. Please try again.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition || isListening) return;

    // Using voice at all is a strong signal the visitor wants spoken
    // replies too, so turn that on the first time they use the mic.
    setVoiceEnabled(true);
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) handleSend(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 py-10 px-6 relative overflow-hidden flex flex-col justify-between">
      {/* Light background glows */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-100 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-50 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between space-y-8">

        {/* Editorial header */}
        <section className="text-center space-y-4 relative">
          <div className="inline-flex items-center space-x-1.5 bg-teal-deep/5 border border-teal-deep/15 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-deep uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-teal-deep" />
            <span>AI Assistant</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-teal-deep tracking-tight">
            AI Gift Genie
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {speechSupported ? "Speak or type your parameters — the genie replies out loud too." : "Whisper your parameters to the genie. Unravel the perfect celebratory bundles automatically."}
          </p>
          <button
            onClick={() => {
              if (voiceEnabled) window.speechSynthesis.cancel();
              setVoiceEnabled((v) => !v);
            }}
            title={voiceEnabled ? "Turn off spoken replies" : "Turn on spoken replies"}
            className={`absolute top-0 right-0 p-2.5 rounded-full border transition-colors ${
              voiceEnabled ? "bg-teal-deep text-white border-teal-deep" : "bg-white text-slate-400 border-slate-200 hover:text-teal-deep"
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
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
                            <img
                              src={prod.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80"}
                              alt={prod.name}
                              className="w-full aspect-[4/3] object-cover rounded-xl"
                            />
                            <div className="space-y-1">
                              <span className="text-[13px] font-bold text-slate-800 block truncate leading-snug">{prod.name}</span>
                              <span className="text-[12px] text-saffron font-bold block">₹{prod.price}</span>
                            </div>
                            <Link
                              href={msg.categorySlug ? `/collections/${msg.categorySlug}` : "/collections"}
                              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] block text-center uppercase tracking-wider transition-colors"
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
                  className="text-[12px] font-bold bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-full hover:bg-slate-100 text-teal-deep transition-colors uppercase tracking-wider"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}

          {/* Listening indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center space-x-2 text-[13px] font-bold text-rani-pink"
              >
                <span className="w-2 h-2 bg-rani-pink rounded-full animate-ping" />
                <span>Listening...</span>
              </motion.div>
            )}
          </AnimatePresence>

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
            {speechSupported && (
              <motion.button
                type="button"
                onClick={handleMicClick}
                whileTap={{ scale: 0.92 }}
                animate={isListening ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={isListening ? { repeat: Infinity, duration: 1 } : undefined}
                title="Speak to the Genie"
                className={`p-3 rounded-xl shadow transition-colors ${
                  isListening ? "bg-rani-pink text-white" : "bg-white border border-slate-200 text-teal-deep hover:border-teal-deep"
                }`}
              >
                <Mic className="w-4.5 h-4.5" />
              </motion.button>
            )}
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
