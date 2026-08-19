"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, ChevronDown, Trash2, Mail } from "lucide-react";
import type { ContactMessage } from "../../lib/types";

const listContainer = { animate: { transition: { staggerChildren: 0.04 } } };
const listItem = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

export default function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    const res = await fetch("/api/admin/contact-messages");
    const data = await res.json();
    if (data.success) setMessages(data.messages);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchMessages();
      setIsLoading(false);
    };
    load();
  }, [fetchMessages]);

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/admin/contact-messages/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) { alert("Failed to delete: " + data.error); return; }
    fetchMessages();
  };

  return (
    <div className="p-6 space-y-6">
      <p className="text-xs text-teal-deep/60">Everyone who&apos;s submitted the /contact form.</p>

      {isLoading ? (
        <div className="py-12 flex justify-center"><Loader className="w-5 h-5 animate-spin text-teal-deep/40" /></div>
      ) : messages.length === 0 ? (
        <div className="py-12 text-center text-xs text-teal-deep/40">No messages yet.</div>
      ) : (
        <motion.div variants={listContainer} initial="initial" animate="animate" className="space-y-2">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              return (
                <motion.div key={msg.id} layout variants={listItem} exit={{ opacity: 0 }} className="bg-white border border-teal-deep/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-teal-deep/5 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-3.5 h-3.5 text-teal-deep/50" />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-teal-deep">{msg.name}</span>
                        <span className="text-teal-deep/50"> · {msg.subject}</span>
                        <div className="text-[12px] text-teal-deep/40">{msg.email} · {new Date(msg.created_at).toLocaleDateString("en-IN")}</div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-teal-deep/40 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-teal-deep/5 pt-3">
                      <p className="text-xs text-teal-deep/70 whitespace-pre-wrap">{msg.message}</p>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="flex items-center space-x-1.5 text-[11px] font-bold text-rani-pink/70 hover:text-rani-pink"
                      >
                        <Trash2 className="w-3.5 h-3.5" /><span>Delete</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
