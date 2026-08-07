"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Printer, ArrowLeft, Loader } from "lucide-react";
import type { InvoiceRow } from "../../../../../lib/types";

export default function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/invoices/${id}`);
        const data = await res.json();
        if (data.success) setInvoice(data.invoice);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return <div className="py-20 text-center text-sm text-slate-500">Invoice not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="print:hidden flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center space-x-1.5 text-xs font-bold text-teal-deep/60 hover:text-teal-deep">
            <ArrowLeft className="w-3.5 h-3.5" /><span>Back</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 bg-teal-deep text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-teal-deep/90 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /><span>Print</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-10 space-y-8 print:border-0 print:rounded-none print:p-0">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl font-black text-teal-deep">The Box Story</h1>
              <p className="text-xs text-slate-500">Premium Gifting &amp; Celebration Hampers</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-teal-deep">Invoice {invoice.invoice_number}</p>
              <p className="text-xs text-slate-500">{new Date(invoice.created_at).toLocaleDateString("en-IN")}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Bill To</p>
            <p className="text-sm font-bold text-teal-deep">{invoice.customer_name}</p>
            {invoice.customer_phone && <p className="text-xs text-slate-500">{invoice.customer_phone}</p>}
            {invoice.customer_address && <p className="text-xs text-slate-500">{invoice.customer_address}</p>}
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="text-left py-2 font-bold">Description</th>
                <th className="text-right py-2 font-bold">Qty</th>
                <th className="text-right py-2 font-bold">Price</th>
                <th className="text-right py-2 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.line_items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50">
                  <td className="py-2.5 text-slate-700">{item.description}</td>
                  <td className="py-2.5 text-right text-slate-700">{item.quantity}</td>
                  <td className="py-2.5 text-right text-slate-700">₹{item.selling_price}</td>
                  <td className="py-2.5 text-right font-bold text-teal-deep">₹{item.selling_price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-48 flex justify-between border-t-2 border-teal-deep pt-2">
              <span className="text-sm font-black text-teal-deep">Total</span>
              <span className="text-sm font-black text-teal-deep">₹{invoice.subtotal}</span>
            </div>
          </div>

          {invoice.notes && (
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
