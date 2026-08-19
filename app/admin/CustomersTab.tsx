"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, ArrowLeft, Download, Search, Save, User, ShoppingBag, MessageSquare, BookOpen } from "lucide-react";
import type { CustomerWithStats, CustomerDetail } from "../../lib/types";

const viewVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function CustomersTab() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", company: "", notes: "" });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCustomers = useCallback(async () => {
    const res = await fetch("/api/admin/customers");
    const data = await res.json();
    if (data.success) setCustomers(data.customers);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchCustomers();
      setIsLoading(false);
    };
    load();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter((c) =>
      c.phone.includes(q) ||
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  const openDetail = async (phone: string) => {
    setView("detail");
    setDetail(null);
    const res = await fetch(`/api/admin/customers/${phone}`);
    const data = await res.json();
    if (data.success) {
      setDetail(data.customer);
      setEditForm({
        name: data.customer.name || "",
        email: data.customer.email || "",
        company: data.customer.company || "",
        notes: data.customer.notes || "",
      });
    }
  };

  const saveDetail = async () => {
    if (!detail) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/customers/${detail.phone}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!data.success) { alert("Failed to save: " + data.error); return; }
      await fetchCustomers();
      openDetail(detail.phone);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {view === "list" && (
        <motion.div key="list" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-teal-deep/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, email, company…"
                className="w-full bg-white border border-teal-deep/15 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none"
              />
            </div>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- downloads a generated file from an API route, not a page to client-navigate to */}
            <a
              href="/api/admin/customers/export"
              className="flex items-center space-x-1.5 text-[12px] font-bold px-4 py-2.5 rounded-xl border border-teal-deep/15 text-teal-deep hover:bg-teal-deep/5 flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5" /><span>Export CSV</span>
            </a>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center"><Loader className="w-5 h-5 animate-spin text-teal-deep/40" /></div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-12 text-center text-xs text-teal-deep/40">No customers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-teal-deep/40 border-b border-teal-deep/5">
                    <th className="py-2 pr-4 font-bold">Name</th>
                    <th className="py-2 pr-4 font-bold">Phone</th>
                    <th className="py-2 pr-4 font-bold">Company</th>
                    <th className="py-2 pr-4 font-bold text-right">Orders</th>
                    <th className="py-2 pr-4 font-bold text-right">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => openDetail(c.phone)}
                      className="border-b border-teal-deep/5 hover:bg-teal-deep/5 cursor-pointer transition-colors"
                    >
                      <td className="py-3 pr-4 font-bold text-teal-deep">{c.name || "—"}</td>
                      <td className="py-3 pr-4 font-mono text-teal-deep/60">{c.phone}</td>
                      <td className="py-3 pr-4 text-teal-deep/60">{c.company || "—"}</td>
                      <td className="py-3 pr-4 text-right text-teal-deep/60">{c.totalOrders}</td>
                      <td className="py-3 pr-4 text-right font-bold text-teal-deep">₹{c.totalSpent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {view === "detail" && (
        <motion.div key="detail" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
          <button onClick={() => setView("list")} className="flex items-center space-x-1.5 text-xs font-bold text-teal-deep/60 hover:text-teal-deep">
            <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Customers</span>
          </button>

          {!detail ? (
            <div className="py-12 flex justify-center"><Loader className="w-5 h-5 animate-spin text-teal-deep/40" /></div>
          ) : (
            <>
              <div className="bg-slate-50/50 border border-teal-deep/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-teal-deep/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-deep/50" />
                  </div>
                  <div>
                    <p className="font-heading text-lg font-black text-teal-deep">{detail.name || detail.phone}</p>
                    <p className="text-[12px] font-mono text-teal-deep/50">{detail.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Name</label>
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Email</label>
                    <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Company</label>
                    <input value={editForm.company} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Notes</label>
                    <input value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="e.g. VIP, prefers WhatsApp"
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={saveDetail}
                  disabled={isSaving}
                  className="flex items-center space-x-1.5 text-[12px] font-bold px-4 py-2.5 rounded-xl bg-teal-deep text-white hover:bg-teal-deep/90 disabled:opacity-50"
                >
                  {isSaving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: ShoppingBag, value: detail.totalOrders, label: "Orders", color: "text-rani-pink" },
                  { icon: MessageSquare, value: detail.inquiries.length, label: "Inquiries", color: "text-saffron" },
                  { icon: BookOpen, value: detail.catalogueLeads.length, label: "Catalogue Shares", color: "text-teal-deep" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-teal-deep/10 rounded-xl p-4 flex items-center space-x-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <div><span className="block text-lg font-black text-teal-deep">{stat.value}</span><span className="text-[12px] text-teal-deep/50">{stat.label}</span></div>
                  </div>
                ))}
              </div>

              {detail.orders.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-deep/50">Orders</h4>
                  {detail.orders.map((o) => (
                    <div key={o.id} className="bg-white border border-teal-deep/10 rounded-xl p-3 flex items-center justify-between text-xs">
                      <span className="text-teal-deep/60">{new Date(o.created_at).toLocaleDateString("en-IN")} · {o.delivery_mode}</span>
                      <span className="font-bold text-teal-deep">₹{o.subtotal}</span>
                    </div>
                  ))}
                </div>
              )}

              {detail.inquiries.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-deep/50">Inquiries</h4>
                  {detail.inquiries.map((i) => (
                    <div key={i.id} className="bg-white border border-teal-deep/10 rounded-xl p-3 text-xs">
                      <span className="font-bold text-teal-deep">{i.company}</span>
                      <span className="text-teal-deep/50"> · {new Date(i.created_at).toLocaleDateString("en-IN")} · {i.budget}</span>
                    </div>
                  ))}
                </div>
              )}

              {detail.catalogueLeads.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-deep/50">Catalogue Shares</h4>
                  {detail.catalogueLeads.map((l) => (
                    <div key={l.id} className="bg-white border border-teal-deep/10 rounded-xl p-3 flex items-center justify-between text-xs">
                      <span className="text-teal-deep/60">{new Date(l.created_at).toLocaleDateString("en-IN")} · {l.cart_items.length} items {l.source === "corporate" ? "· Corporate" : ""}</span>
                      <span className="font-bold text-teal-deep">₹{l.subtotal}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
