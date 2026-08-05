"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Loader, ArrowLeft, Download, Copy, Check,
  Building, Package, Users, Power
} from "lucide-react";
import type { CampaignRow, CampaignDetail, CustomFieldDef, CampaignType } from "../../lib/types";

type CampaignListItem = CampaignRow & { redeemedCount: number; totalCount: number };

interface ProductDraft {
  name: string;
  description: string;
  file: File | null;
  previewUrl: string;
}

const emptyProduct = (): ProductDraft => ({ name: "", description: "", file: null, previewUrl: "" });
const emptyCustomField = (): CustomFieldDef => ({ key: "", label: "", type: "text", options: [], required: false });

async function uploadCampaignFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/campaigns/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Upload failed");
  return data.url;
}

const slugify = (label: string, idx: number) =>
  (label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "") || `field_${idx}`);

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

export default function CampaignsTab() {
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detail, setDetail] = useState<CampaignDetail | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Create-form state
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [campaignType, setCampaignType] = useState<CampaignType>("single");
  const [numHampers, setNumHampers] = useState("50");
  const [products, setProducts] = useState<ProductDraft[]>([emptyProduct()]);
  const [customFields, setCustomFields] = useState<CustomFieldDef[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchCampaigns = useCallback(async () => {
    const res = await fetch("/api/admin/campaigns");
    const data = await res.json();
    if (data.success) setCampaigns(data.campaigns);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchCampaigns();
      setIsLoading(false);
    };
    load();
  }, [fetchCampaigns, refreshTrigger]);

  const openDetail = async (id: string) => {
    setView("detail");
    setDetail(null);
    const res = await fetch(`/api/admin/campaigns/${id}`);
    const data = await res.json();
    if (data.success) setDetail(data.campaign);
  };

  const resetForm = () => {
    setName(""); setLogoFile(null); setLogoPreview(""); setCampaignType("single");
    setNumHampers("50"); setProducts([emptyProduct()]); setCustomFields([]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert("Campaign name is required."); return; }
    const validProducts = products.filter((p) => p.name.trim());
    if (validProducts.length === 0) { alert("Add at least one hamper product."); return; }
    if (campaignType === "single" && validProducts.length > 1) {
      alert("\"Same Kit for All\" can only have one product — remove the extras or switch to Multiple Options.");
      return;
    }

    setIsSaving(true);
    try {
      const logo_url = logoFile ? await uploadCampaignFile(logoFile) : undefined;
      const productPayload = [];
      for (const p of validProducts) {
        const image_url = p.file ? await uploadCampaignFile(p.file) : undefined;
        productPayload.push({ name: p.name, description: p.description || undefined, image_url });
      }

      const fieldsPayload = customFields
        .filter((f) => f.label.trim())
        .map((f, idx) => ({
          ...f,
          key: slugify(f.label, idx),
          options: f.type === "dropdown" ? (f.options || []).filter(Boolean) : undefined,
        }));

      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          logo_url,
          campaign_type: campaignType,
          num_hampers: Number(numHampers),
          custom_fields: fieldsPayload,
          products: productPayload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        resetForm();
        setView("list");
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to create campaign: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    setRefreshTrigger(prev => prev + 1);
    if (detail?.id === id) openDetail(id);
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm("Delete this campaign and all its codes/redemptions? This can't be undone.")) return;
    await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
    setView("list");
    setRefreshTrigger(prev => prev + 1);
  };

  const markShipped = async (campaignId: string, code: string, currentStatus: string) => {
    await fetch(`/api/admin/campaigns/${campaignId}/codes/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fulfillment_status: currentStatus === "shipped" ? "pending" : "shipped" }),
    });
    openDetail(campaignId);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const addProduct = () => setProducts([...products, emptyProduct()]);
  const removeProduct = (idx: number) => setProducts(products.filter((_, i) => i !== idx));
  const updateProduct = (idx: number, patch: Partial<ProductDraft>) =>
    setProducts(products.map((p, i) => (i === idx ? { ...p, ...patch } : p)));

  const addCustomField = () => setCustomFields([...customFields, emptyCustomField()]);
  const removeCustomField = (idx: number) => setCustomFields(customFields.filter((_, i) => i !== idx));
  const updateCustomField = (idx: number, patch: Partial<CustomFieldDef>) =>
    setCustomFields(customFields.map((f, i) => (i === idx ? { ...f, ...patch } : f)));

  const redeemed = detail?.codes.filter((c) => c.is_redeemed) || [];
  const unredeemed = detail?.codes.filter((c) => !c.is_redeemed) || [];
  const productNameById = new Map((detail?.products || []).map((p) => [p.id, p.name]));

  return (
    <AnimatePresence mode="wait">
      {view === "list" && (
        <motion.div key="list" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-teal-deep/60">Spin up a claim panel for a corporate client — generate unique redemption codes, hand them to HR, and track fulfillment.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("create")}
              className="flex items-center space-x-1.5 bg-teal-deep text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-teal-deep/90 transition-colors flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Campaign</span>
            </motion.button>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center"><Loader className="w-5 h-5 animate-spin text-teal-deep/40" /></div>
          ) : campaigns.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center text-xs text-teal-deep/40">No campaigns yet.</motion.div>
          ) : (
            <motion.div variants={listContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campaigns.map((c) => (
                <motion.button
                  key={c.id}
                  variants={listItem}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openDetail(c.id)}
                  className="text-left bg-white border border-teal-deep/10 rounded-2xl p-5 space-y-3 hover:border-teal-deep/30 hover:shadow-sm transition-[border-color,box-shadow]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-teal-deep">{c.name}</span>
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full uppercase ${c.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                      {c.is_active ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[12px] text-teal-deep/50">
                    <span className="uppercase font-bold tracking-wider">{c.campaign_type === "single" ? "Same Kit" : "Multiple Options"}</span>
                    <span>·</span>
                    <span>{c.redeemedCount} / {c.totalCount} redeemed</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-teal-deep"
                      initial={{ width: 0 }}
                      animate={{ width: `${c.totalCount ? (c.redeemedCount / c.totalCount) * 100 : 0}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {view === "create" && (
        <motion.div key="create" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
          <button onClick={() => setView("list")} className="flex items-center space-x-1.5 text-xs font-bold text-teal-deep/60 hover:text-teal-deep">
            <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Campaigns</span>
          </button>

          <form onSubmit={handleCreate} className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-teal-deep/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-teal-deep/60">Campaign / Company Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. TATA Diwali 2026"
                  className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-teal-deep/60">Number of Hampers (unique codes generated)</label>
                <input required type="number" min={1} value={numHampers} onChange={(e) => setNumHampers(e.target.value)}
                  className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-bold text-teal-deep/60">Company Logo (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setLogoFile(f);
                setLogoPreview(f ? URL.createObjectURL(f) : "");
              }} className="text-xs" />
              <AnimatePresence>
                {logoPreview && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain rounded-lg border border-teal-deep/10 bg-white mt-2"
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-teal-deep/60">Campaign Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => setCampaignType("single")}
                  className={`p-4 rounded-xl border text-left transition-colors ${campaignType === "single" ? "border-teal-deep bg-teal-deep/5" : "border-teal-deep/10 bg-white"}`}>
                  <span className="text-xs font-bold text-teal-deep block">Same Kit for All</span>
                  <span className="text-[12px] text-teal-deep/50">Every code redeems the identical hamper.</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => setCampaignType("choice")}
                  className={`p-4 rounded-xl border text-left transition-colors ${campaignType === "choice" ? "border-teal-deep bg-teal-deep/5" : "border-teal-deep/10 bg-white"}`}>
                  <span className="text-xs font-bold text-teal-deep block">Multiple Options</span>
                  <span className="text-[12px] text-teal-deep/50">Employee picks one hamper from a list you define.</span>
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-teal-deep/60">
                  {campaignType === "single" ? "The Hamper" : "Hamper Options"}
                </label>
                {campaignType === "choice" && (
                  <button type="button" onClick={addProduct} className="text-[12px] font-bold text-teal-deep flex items-center space-x-1">
                    <Plus className="w-3 h-3" /><span>Add Option</span>
                  </button>
                )}
              </div>
              <AnimatePresence initial={false}>
                {products.map((p, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-teal-deep/10 rounded-xl p-4 space-y-2 overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <input value={p.name} onChange={(e) => updateProduct(idx, { name: e.target.value })} placeholder="Hamper name"
                          className="w-full bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                        <textarea rows={2} value={p.description} onChange={(e) => updateProduct(idx, { description: e.target.value })} placeholder="Description (optional)"
                          className="w-full bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none" />
                        <input type="file" accept="image/*" onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          updateProduct(idx, { file: f, previewUrl: f ? URL.createObjectURL(f) : "" });
                        }} className="text-[12px]" />
                      </div>
                      {p.previewUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={p.previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-teal-deep/10 flex-shrink-0" />
                      )}
                      {campaignType === "choice" && products.length > 1 && (
                        <button type="button" onClick={() => removeProduct(idx)} className="text-teal-deep/30 hover:text-rani-pink flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-teal-deep/60">Custom Fields (asked on the claim form, in addition to name/phone/address)</label>
                <button type="button" onClick={addCustomField} className="text-[12px] font-bold text-teal-deep flex items-center space-x-1">
                  <Plus className="w-3 h-3" /><span>Add Field</span>
                </button>
              </div>
              <AnimatePresence initial={false}>
                {customFields.map((f, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-teal-deep/10 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center overflow-hidden"
                  >
                    <input value={f.label} onChange={(e) => updateCustomField(idx, { label: e.target.value })} placeholder="Field label, e.g. T-Shirt Size"
                      className="sm:col-span-4 bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                    <select value={f.type} onChange={(e) => updateCustomField(idx, { type: e.target.value as "text" | "dropdown" })}
                      className="sm:col-span-2 bg-slate-50 border border-teal-deep/10 rounded-lg px-2 py-2 text-xs focus:outline-none">
                      <option value="text">Text</option>
                      <option value="dropdown">Dropdown</option>
                    </select>
                    {f.type === "dropdown" ? (
                      <input
                        value={(f.options || []).join(", ")}
                        onChange={(e) => updateCustomField(idx, { options: e.target.value.split(",").map((s) => s.trim()) })}
                        placeholder="Options, comma separated"
                        className="sm:col-span-4 bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      />
                    ) : <div className="sm:col-span-4" />}
                    <label className="sm:col-span-1 flex items-center space-x-1 text-[12px] text-teal-deep/60">
                      <input type="checkbox" checked={f.required} onChange={(e) => updateCustomField(idx, { required: e.target.checked })} />
                      <span>Required</span>
                    </label>
                    <button type="button" onClick={() => removeCustomField(idx)} className="sm:col-span-1 text-teal-deep/30 hover:text-rani-pink justify-self-end">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isSaving}
              className="w-full py-3.5 bg-teal-deep text-white rounded-xl font-bold text-sm hover:bg-teal-deep/90 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2">
              {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <span>Create Campaign &amp; Generate {numHampers || 0} Codes</span>}
            </motion.button>
          </form>
        </motion.div>
      )}

      {view === "detail" && (
        <motion.div key="detail" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-8">
          {!detail ? (
            <div className="py-12 flex justify-center"><Loader className="w-5 h-5 animate-spin text-teal-deep/40" /></div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <button onClick={() => setView("list")} className="flex items-center space-x-1.5 text-xs font-bold text-teal-deep/60 hover:text-teal-deep">
                  <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Campaigns</span>
                </button>
                <div className="flex items-center space-x-2">
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => toggleActive(detail.id, detail.is_active)}
                    className="flex items-center space-x-1.5 text-[12px] font-bold px-3 py-2 rounded-full border border-teal-deep/15 text-teal-deep hover:bg-teal-deep/5">
                    <Power className="w-3 h-3" /><span>{detail.is_active ? "Pause" : "Activate"}</span>
                  </motion.button>
                  <motion.a whileTap={{ scale: 0.96 }} href={`/api/admin/campaigns/${detail.id}/export`} className="flex items-center space-x-1.5 text-[12px] font-bold px-3 py-2 rounded-full bg-teal-deep text-white hover:bg-teal-deep/90">
                    <Download className="w-3 h-3" /><span>Export CSV</span>
                  </motion.a>
                  <button onClick={() => deleteCampaign(detail.id)} className="text-teal-deep/30 hover:text-rani-pink p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-4">
                {detail.logo_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={detail.logo_url} alt={detail.name} className="w-14 h-14 object-contain rounded-xl border border-teal-deep/10 bg-white" />
                )}
                <div>
                  <h3 className="font-heading text-xl font-black text-teal-deep">{detail.name}</h3>
                  <p className="text-[13px] text-teal-deep/50">{redeemed.length} / {detail.codes.length} redeemed · {detail.campaign_type === "single" ? "Same Kit for All" : "Multiple Options"}</p>
                </div>
              </motion.div>

              <motion.div variants={listContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Package, value: detail.products.length, label: `Hamper Option${detail.products.length !== 1 ? "s" : ""}`, color: "text-saffron" },
                  { icon: Users, value: redeemed.length, label: "Redeemed", color: "text-rani-pink" },
                  { icon: Building, value: unredeemed.length, label: "Unclaimed Codes", color: "text-teal-deep" },
                ].map((stat) => (
                  <motion.div key={stat.label} variants={listItem} className="bg-white border border-teal-deep/10 rounded-xl p-4 flex items-center space-x-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <div><span className="block text-lg font-black text-teal-deep">{stat.value}</span><span className="text-[12px] text-teal-deep/50">{stat.label}</span></div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-deep/50">Redemptions</h4>
                {redeemed.length === 0 ? (
                  <p className="text-xs text-teal-deep/40">No redemptions yet.</p>
                ) : (
                  <motion.div variants={listContainer} initial="initial" animate="animate" className="space-y-2">
                    <AnimatePresence initial={false}>
                      {redeemed.map((c) => (
                        <motion.div
                          key={c.code}
                          layout
                          variants={listItem}
                          initial="initial"
                          animate="animate"
                          exit={{ opacity: 0 }}
                          className="bg-white border border-teal-deep/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="text-xs">
                            <span className="font-bold text-teal-deep">{c.recipient_name}</span>
                            <span className="text-teal-deep/40"> · {c.recipient_phone}</span>
                            {c.selected_product_id && <span className="text-teal-deep/40"> · {productNameById.get(c.selected_product_id)}</span>}
                            <div className="text-[12px] text-teal-deep/40 font-mono mt-0.5">{c.code}</div>
                          </div>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => markShipped(detail.id, c.code, c.fulfillment_status)}
                            className={`text-[12px] font-bold px-3 py-1.5 rounded-full self-start ${c.fulfillment_status === "shipped" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                            {c.fulfillment_status === "shipped" ? "Shipped" : "Mark Shipped"}
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-deep/50">Unclaimed Codes ({unredeemed.length}) — copy and distribute to employees</h4>
                <motion.div variants={listContainer} initial="initial" animate="animate" className="flex flex-wrap gap-2">
                  {unredeemed.map((c) => (
                    <motion.button
                      key={c.code}
                      variants={listItem}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyCode(c.code)}
                      className="flex items-center space-x-1.5 font-mono text-[13px] bg-slate-50 border border-teal-deep/10 px-3 py-1.5 rounded-lg hover:border-teal-deep/30"
                    >
                      <span>{c.code}</span>
                      <AnimatePresence mode="wait" initial={false}>
                        {copiedCode === c.code ? (
                          <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                            <Check className="w-3 h-3 text-emerald-500" />
                          </motion.span>
                        ) : (
                          <motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                            <Copy className="w-3 h-3 text-teal-deep/30" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
