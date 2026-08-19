"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Loader, ArrowLeft, Printer, Receipt } from "lucide-react";
import type { InvoiceRow, InvoiceLineItem } from "../../lib/types";

interface ProductOption {
  id: string;
  name: string;
  price: number;
  cost_price: number | null;
}

const emptyLineItem = (): InvoiceLineItem => ({ description: "", quantity: 1, cost_price: 0, selling_price: 0 });

const viewVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const listContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const listItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function BillingTab() {
  const [view, setView] = useState<"list" | "create">("list");
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  // Create-form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([emptyLineItem()]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchInvoices = useCallback(async () => {
    const res = await fetch("/api/admin/invoices");
    const data = await res.json();
    if (data.success) setInvoices(data.invoices);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchInvoices();
      setIsLoading(false);
    };
    load();
  }, [fetchInvoices, refreshTrigger]);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProductOptions(data.products.map((p: ProductOption) => ({ id: p.id, name: p.name, price: p.price, cost_price: p.cost_price })));
      }
    };
    loadProducts();
  }, []);

  const resetForm = () => {
    setCustomerName(""); setCustomerPhone(""); setCustomerAddress(""); setNotes("");
    setLineItems([emptyLineItem()]);
  };

  const addLineItem = () => setLineItems([...lineItems, emptyLineItem()]);
  const removeLineItem = (idx: number) => setLineItems(lineItems.filter((_, i) => i !== idx));
  const updateLineItem = (idx: number, patch: Partial<InvoiceLineItem>) =>
    setLineItems(lineItems.map((item, i) => (i === idx ? { ...item, ...patch } : item)));

  const applyProductToLine = (idx: number, productId: string) => {
    const product = productOptions.find((p) => p.id === productId);
    if (!product) return;
    updateLineItem(idx, {
      description: product.name,
      selling_price: product.price,
      cost_price: product.cost_price ?? 0,
    });
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.selling_price * item.quantity, 0);
  const totalCost = lineItems.reduce((sum, item) => sum + item.cost_price * item.quantity, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) { alert("Customer name is required."); return; }
    const validItems = lineItems.filter((item) => item.description.trim() && item.quantity > 0);
    if (validItems.length === 0) { alert("Add at least one line item with a description and quantity."); return; }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone || undefined,
          customer_address: customerAddress || undefined,
          notes: notes || undefined,
          line_items: validItems,
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.open(`/admin/invoices/${data.invoice.id}/print`, "_blank");
        resetForm();
        setView("list");
        setRefreshTrigger((prev) => prev + 1);
      } else {
        alert("Failed to create invoice: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Delete this invoice? This can't be undone.")) return;
    const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) { alert("Failed to delete: " + data.error); return; }
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AnimatePresence mode="wait">
      {view === "list" && (
        <motion.div key="list" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-teal-deep/60">Build an invoice, see the cost price while you work, print a clean customer-facing copy.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("create")}
              className="flex items-center space-x-1.5 bg-teal-deep text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-teal-deep/90 transition-colors flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </motion.button>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center"><Loader className="w-5 h-5 animate-spin text-teal-deep/40" /></div>
          ) : invoices.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center text-xs text-teal-deep/40">No invoices yet.</motion.div>
          ) : (
            <motion.div variants={listContainer} initial="initial" animate="animate" className="space-y-2">
              {invoices.map((inv) => (
                <motion.div
                  key={inv.id}
                  variants={listItem}
                  className="bg-white border border-teal-deep/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-deep/5 flex items-center justify-center flex-shrink-0">
                      <Receipt className="w-4 h-4 text-teal-deep/50" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-teal-deep">{inv.invoice_number}</span>
                        <span className="text-[12px] text-teal-deep/40">{new Date(inv.created_at).toLocaleDateString("en-IN")}</span>
                      </div>
                      <p className="text-xs text-teal-deep/60">{inv.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-heading text-sm font-black text-teal-deep">₹{inv.subtotal}</span>
                    <a
                      href={`/admin/invoices/${inv.id}/print`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 text-[12px] font-bold px-3 py-2 rounded-full bg-teal-deep/5 text-teal-deep hover:bg-teal-deep/10"
                    >
                      <Printer className="w-3.5 h-3.5" /><span>Print</span>
                    </a>
                    <button onClick={() => deleteInvoice(inv.id)} className="text-teal-deep/30 hover:text-rani-pink p-1.5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {view === "create" && (
        <motion.div key="create" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
          <button onClick={() => setView("list")} className="flex items-center space-x-1.5 text-xs font-bold text-teal-deep/60 hover:text-teal-deep">
            <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Invoices</span>
          </button>

          <form onSubmit={handleCreate} className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-teal-deep/5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-teal-deep/60">Customer Name</label>
                <input required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Priya Sharma"
                  className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-teal-deep/60">Phone (optional)</label>
                <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-teal-deep/60">Address (optional)</label>
                <input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-teal-deep/60">Line Items</label>
                <button type="button" onClick={addLineItem} className="text-[12px] font-bold text-teal-deep flex items-center space-x-1">
                  <Plus className="w-3 h-3" /><span>Add Line</span>
                </button>
              </div>
              <AnimatePresence initial={false}>
                {lineItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-teal-deep/10 rounded-xl p-3 space-y-2 overflow-hidden"
                  >
                    {productOptions.length > 0 && (
                      <select
                        defaultValue=""
                        onChange={(e) => e.target.value && applyProductToLine(idx, e.target.value)}
                        className="w-full bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-[12px] focus:outline-none"
                      >
                        <option value="">Pick a product to autofill (optional)…</option>
                        {productOptions.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-center">
                      <input
                        value={item.description}
                        onChange={(e) => updateLineItem(idx, { description: e.target.value })}
                        placeholder="Description"
                        className="col-span-2 sm:col-span-4 bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      />
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-teal-deep/40 uppercase">Qty</label>
                        <input type="number" min={1} value={item.quantity}
                          onChange={(e) => updateLineItem(idx, { quantity: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-teal-deep/40 uppercase">Cost ₹</label>
                        <input type="number" min={0} value={item.cost_price}
                          onChange={(e) => updateLineItem(idx, { cost_price: Number(e.target.value) })}
                          className="w-full bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-teal-deep/40 uppercase">Price ₹</label>
                        <input type="number" min={0} value={item.selling_price}
                          onChange={(e) => updateLineItem(idx, { selling_price: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <label className="text-[10px] font-bold text-teal-deep/40 uppercase block">Total</label>
                        <span className="text-xs font-bold text-teal-deep">₹{item.selling_price * item.quantity}</span>
                      </div>
                      {lineItems.length > 1 && (
                        <button type="button" onClick={() => removeLineItem(idx)} className="sm:col-span-1 text-teal-deep/30 hover:text-rani-pink justify-self-end">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-teal-deep/60">Notes (optional — printed on the invoice)</label>
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Payment terms, thank-you note"
                className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Cost (internal only, never printed)</span>
                <p className="font-heading text-lg font-black text-amber-800">₹{totalCost}</p>
              </div>
              <div className="bg-teal-deep/5 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-deep/60">Total (customer)</span>
                <p className="font-heading text-lg font-black text-teal-deep">₹{subtotal}</p>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isSaving}
              className="w-full py-3.5 bg-teal-deep text-white rounded-xl font-bold text-sm hover:bg-teal-deep/90 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2">
              {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>Save &amp; Print Invoice</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
