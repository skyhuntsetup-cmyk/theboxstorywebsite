"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, ChevronDown, Trash2, Building2, BookOpen } from "lucide-react";
import type { CatalogueLead } from "../../lib/types";

const listContainer = { animate: { transition: { staggerChildren: 0.04 } } };
const listItem = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

export default function LeadsTab() {
  const [leads, setLeads] = useState<CatalogueLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "shop" | "corporate">("all");

  const fetchLeads = useCallback(async () => {
    const res = await fetch("/api/admin/catalogue-leads");
    const data = await res.json();
    if (data.success) setLeads(data.leads);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchLeads();
      setIsLoading(false);
    };
    load();
  }, [fetchLeads]);

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const res = await fetch(`/api/admin/catalogue-leads/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) { alert("Failed to delete: " + data.error); return; }
    fetchLeads();
  };

  const filteredLeads = leads.filter((l) => filter === "all" || l.source === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-teal-deep/60">Everyone who&apos;s browsed and shared a cart from /catalogue or the Corporate Quote Builder.</p>
        <div className="flex space-x-1 bg-teal-deep/5 p-1 rounded-xl">
          {(["all", "shop", "corporate"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] font-bold uppercase px-3 py-1.5 rounded-lg transition-colors ${
                filter === f ? "bg-teal-deep text-white" : "text-teal-deep/60 hover:bg-teal-deep/5"
              }`}
            >
              {f === "all" ? "All" : f === "shop" ? "Shop" : "Corporate"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center"><Loader className="w-5 h-5 animate-spin text-teal-deep/40" /></div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-12 text-center text-xs text-teal-deep/40">No leads yet.</div>
      ) : (
        <motion.div variants={listContainer} initial="initial" animate="animate" className="space-y-2">
          <AnimatePresence initial={false}>
            {filteredLeads.map((lead) => {
              const isExpanded = expandedId === lead.id;
              return (
                <motion.div key={lead.id} layout variants={listItem} exit={{ opacity: 0 }} className="bg-white border border-teal-deep/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center space-x-1 text-[11px] font-bold uppercase px-2 py-1 rounded-full ${
                        lead.source === "corporate" ? "bg-saffron/10 text-saffron" : "bg-teal-deep/5 text-teal-deep/60"
                      }`}>
                        {lead.source === "corporate" ? <Building2 className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                        <span>{lead.source === "corporate" ? "Corporate" : "Shop"}</span>
                      </span>
                      <div className="text-xs">
                        <span className="font-bold text-teal-deep">{lead.name}</span>
                        {lead.company && <span className="text-teal-deep/50"> · {lead.company}</span>}
                        <div className="text-[12px] text-teal-deep/40">{lead.whatsapp} · {new Date(lead.created_at).toLocaleDateString("en-IN")}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-teal-deep">₹{lead.subtotal}</span>
                      <ChevronDown className={`w-4 h-4 text-teal-deep/40 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2 border-t border-teal-deep/5 pt-3">
                      {lead.cart_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-[12px]">
                          <span className="text-teal-deep/70">{item.name} × {item.quantity}</span>
                          <span className="text-teal-deep/50">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="flex items-center space-x-1.5 text-[11px] font-bold text-rani-pink/70 hover:text-rani-pink pt-2"
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
