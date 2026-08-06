"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit3, Eye, EyeOff, Trash2 } from "lucide-react";
import type { StoreRow } from "../../lib/types";

const emptyForm = { name: "", tagline: "", description: "", hero_image: "" };

export default function StoresTab() {
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newStore, setNewStore] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStore, setEditingStore] = useState<StoreRow | null>(null);

  const fetchStores = useCallback(async () => {
    const res = await fetch("/api/admin/stores");
    const data = await res.json();
    if (data.success) setStores(data.stores);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchStores();
      setIsLoading(false);
    };
    load();
  }, [fetchStores, refreshTrigger]);

  const addStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStore.name.trim()) { alert("Store name is required."); return; }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newStore, display_order: stores.length }),
      });
      const data = await res.json();
      if (data.success) {
        setNewStore(emptyForm);
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

  const updateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/stores/${editingStore.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingStore.name,
          tagline: editingStore.tagline,
          description: editingStore.description,
          hero_image: editingStore.hero_image,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        setEditingStore(null);
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
    const res = await fetch(`/api/admin/stores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    const data = await res.json();
    if (data.success) setRefreshTrigger((v) => v + 1);
    else alert("Failed to toggle: " + data.error);
  };

  const deleteStore = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Products tagged into it will lose that tag.`)) return;
    const res = await fetch(`/api/admin/stores/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) setRefreshTrigger((v) => v + 1);
    else alert("Failed to delete: " + data.error);
  };

  if (isLoading) {
    return <div className="p-6 text-xs text-teal-deep/40">Loading stores...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <p className="text-xs text-teal-deep/50">
        The 5 shopping destinations on the site. Tag products into one or more from the Products tab.
      </p>

      <form onSubmit={addStore} className="bg-slate-50/50 p-6 rounded-2xl border border-teal-deep/5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-teal-deep/60">Store Name</label>
          <input type="text" required placeholder="e.g. Quirky Stuff Store" value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-teal-deep/60">Tagline (optional)</label>
          <input type="text" placeholder="e.g. Fun, offbeat gifts with personality" value={newStore.tagline}
            onChange={(e) => setNewStore({ ...newStore, tagline: e.target.value })}
            className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[12px] font-bold text-teal-deep/60">Hero Image URL (optional)</label>
          <input type="text" placeholder="https://..." value={newStore.hero_image}
            onChange={(e) => setNewStore({ ...newStore, hero_image: e.target.value })}
            className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
        </div>
        <button type="submit" disabled={isSaving}
          className="sm:col-span-2 px-4 py-2 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-60 flex items-center justify-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>{isSaving ? "Adding..." : "Add Store"}</span>
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => {
          const isEditing = editingId === store.id;
          return (
            <div key={store.id} className="bg-white border border-teal-deep/10 rounded-2xl p-5 space-y-3">
              {isEditing && editingStore ? (
                <form onSubmit={updateStore} className="space-y-3">
                  <input type="text" value={editingStore.name} onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  <input type="text" placeholder="Tagline" value={editingStore.tagline || ""} onChange={(e) => setEditingStore({ ...editingStore, tagline: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  <input type="text" placeholder="Hero Image URL" value={editingStore.hero_image || ""} onChange={(e) => setEditingStore({ ...editingStore, hero_image: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  <div className="flex space-x-2">
                    <button type="submit" disabled={isSaving} className="px-3 py-1.5 bg-teal-deep text-white rounded-lg font-bold text-[12px] uppercase disabled:opacity-60">Save</button>
                    <button type="button" onClick={() => { setEditingId(null); setEditingStore(null); }} className="px-3 py-1.5 border border-teal-deep/15 text-teal-deep rounded-lg font-bold text-[12px] uppercase">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-heading text-sm font-bold text-teal-deep">{store.name}</h4>
                      <span className="text-[12px] text-teal-deep/50">/{store.slug}</span>
                    </div>
                    {!store.is_active && (
                      <span className="text-[11px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full uppercase">Hidden</span>
                    )}
                  </div>
                  {store.tagline && <p className="text-xs text-teal-deep/60">{store.tagline}</p>}
                  <div className="flex items-center space-x-2 pt-1">
                    <button onClick={() => { setEditingId(store.id); setEditingStore(store); }}
                      className="p-1.5 rounded-lg hover:bg-teal-deep/10 text-teal-deep/60 hover:text-teal-deep transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toggleActive(store.id, store.is_active)}
                      className="p-1.5 rounded-lg hover:bg-teal-deep/10 text-teal-deep/60 hover:text-teal-deep transition-colors">
                      {store.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => deleteStore(store.id, store.name)}
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
