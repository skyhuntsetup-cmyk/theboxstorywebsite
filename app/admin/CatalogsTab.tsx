"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit3, Eye, EyeOff, Trash2 } from "lucide-react";
import type { CorporateCatalogRow, CorporateCatalogCategory } from "../../lib/types";

const CATEGORIES: CorporateCatalogCategory[] = [
  "Tech & Gadgets", "Drinkware & Coffee", "Bags & Leather",
  "Stationery & Office", "Apparel & Clothing", "Corporate Proposals",
];

const emptyForm = { file: "", title: "", category: CATEGORIES[0], description: "", size: "" };

export default function CatalogsTab() {
  const [catalogs, setCatalogs] = useState<CorporateCatalogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newCatalog, setNewCatalog] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCatalog, setEditingCatalog] = useState<CorporateCatalogRow | null>(null);

  const fetchCatalogs = useCallback(async () => {
    const res = await fetch("/api/admin/corporate-catalogs");
    const data = await res.json();
    if (data.success) setCatalogs(data.catalogs);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchCatalogs();
      setIsLoading(false);
    };
    load();
  }, [fetchCatalogs, refreshTrigger]);

  const addCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatalog.file.trim() || !newCatalog.title.trim()) { alert("File name and title are required."); return; }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/corporate-catalogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCatalog, display_order: catalogs.length }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCatalog(emptyForm);
        setRefreshTrigger((v) => v + 1);
      } else {
        alert("Failed to add: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const updateCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatalog) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/corporate-catalogs/${editingCatalog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: editingCatalog.file,
          title: editingCatalog.title,
          category: editingCatalog.category,
          description: editingCatalog.description,
          size: editingCatalog.size,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        setEditingCatalog(null);
        setRefreshTrigger((v) => v + 1);
      } else {
        alert("Failed to update: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const res = await fetch(`/api/admin/corporate-catalogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    const data = await res.json();
    if (data.success) setRefreshTrigger((v) => v + 1);
    else alert("Failed to toggle: " + data.error);
  };

  const deleteCatalog = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from the catalogue list?`)) return;
    const res = await fetch(`/api/admin/corporate-catalogs/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) setRefreshTrigger((v) => v + 1);
    else alert("Failed to delete: " + data.error);
  };

  if (isLoading) {
    return <div className="p-6 text-xs text-teal-deep/40">Loading catalogues...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <p className="text-xs text-teal-deep/50">
        Controls what shows on /corporate/catalog. The PDF file itself still has to be placed under <code className="bg-teal-deep/5 px-1 rounded">public/catalogues/</code> manually — this only manages the listing.
      </p>

      <form onSubmit={addCatalog} className="bg-slate-50/50 p-6 rounded-2xl border border-teal-deep/5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-teal-deep/60">File Name (exact, under public/catalogues/)</label>
          <input type="text" required placeholder="e.g. 24. New Catalog.pdf" value={newCatalog.file}
            onChange={(e) => setNewCatalog({ ...newCatalog, file: e.target.value })}
            className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-teal-deep/60">Title</label>
          <input type="text" required placeholder="e.g. Premium Drinkware" value={newCatalog.title}
            onChange={(e) => setNewCatalog({ ...newCatalog, title: e.target.value })}
            className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-teal-deep/60">Category</label>
          <select value={newCatalog.category} onChange={(e) => setNewCatalog({ ...newCatalog, category: e.target.value as CorporateCatalogCategory })}
            className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-teal-deep/60">Size (display text, e.g. &quot;12.4 MB&quot;)</label>
          <input type="text" placeholder="12.4 MB" value={newCatalog.size}
            onChange={(e) => setNewCatalog({ ...newCatalog, size: e.target.value })}
            className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[12px] font-bold text-teal-deep/60">Description</label>
          <input type="text" placeholder="Short description shown in the sidebar" value={newCatalog.description}
            onChange={(e) => setNewCatalog({ ...newCatalog, description: e.target.value })}
            className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
        </div>
        <button type="submit" disabled={isSaving}
          className="sm:col-span-2 px-4 py-2 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-60 flex items-center justify-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>{isSaving ? "Adding..." : "Add Catalog"}</span>
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catalogs.map((cat) => {
          const isEditing = editingId === cat.id;
          return (
            <div key={cat.id} className="bg-white border border-teal-deep/10 rounded-2xl p-5 space-y-3">
              {isEditing && editingCatalog ? (
                <form onSubmit={updateCatalog} className="space-y-3">
                  <input type="text" value={editingCatalog.file} onChange={(e) => setEditingCatalog({ ...editingCatalog, file: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  <input type="text" value={editingCatalog.title} onChange={(e) => setEditingCatalog({ ...editingCatalog, title: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  <select value={editingCatalog.category} onChange={(e) => setEditingCatalog({ ...editingCatalog, category: e.target.value as CorporateCatalogCategory })}
                    className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" placeholder="Size" value={editingCatalog.size || ""} onChange={(e) => setEditingCatalog({ ...editingCatalog, size: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  <input type="text" placeholder="Description" value={editingCatalog.description || ""} onChange={(e) => setEditingCatalog({ ...editingCatalog, description: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  <div className="flex space-x-2">
                    <button type="submit" disabled={isSaving} className="px-3 py-1.5 bg-teal-deep text-white rounded-lg font-bold text-[12px] uppercase disabled:opacity-60">Save</button>
                    <button type="button" onClick={() => { setEditingId(null); setEditingCatalog(null); }} className="px-3 py-1.5 border border-teal-deep/15 text-teal-deep rounded-lg font-bold text-[12px] uppercase">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-heading text-sm font-bold text-teal-deep">{cat.title}</h4>
                      <span className="text-[12px] text-teal-deep/50">{cat.category}</span>
                    </div>
                    {!cat.is_active && (
                      <span className="text-[11px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full uppercase">Hidden</span>
                    )}
                  </div>
                  {cat.description && <p className="text-xs text-teal-deep/60">{cat.description}</p>}
                  <p className="text-[11px] text-teal-deep/40 font-mono truncate">{cat.file}{cat.size ? ` · ${cat.size}` : ""}</p>
                  <div className="flex items-center space-x-2 pt-1">
                    <button onClick={() => { setEditingId(cat.id); setEditingCatalog(cat); }}
                      className="p-1.5 rounded-lg hover:bg-teal-deep/10 text-teal-deep/60 hover:text-teal-deep transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toggleActive(cat.id, cat.is_active)}
                      className="p-1.5 rounded-lg hover:bg-teal-deep/10 text-teal-deep/60 hover:text-teal-deep transition-colors">
                      {cat.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => deleteCatalog(cat.id, cat.title)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-teal-deep/60 hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
