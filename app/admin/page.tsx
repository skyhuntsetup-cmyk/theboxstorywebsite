"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  BarChart3, ShoppingBag, MessageSquare, Package, Loader, 
  CheckCircle, ArrowRight, Truck, Mail, Phone, Calendar, Search, RefreshCw,
  Eye, EyeOff, Plus, Trash2, Box as BoxIcon, ExternalLink, Edit3, Globe, Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "inquiries" | "products" | "bazaar" | "inventory">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [bazaarItems, setBazaarItems] = useState<any[]>([]);
  const [boxStyles, setBoxStyles] = useState<any[]>([]);
  const [offlineInventory, setOfflineInventory] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Stats indicators
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidOrders: 0,
    claimedGifts: 0,
    totalInquiries: 0,
    totalInventoryValue: 0,
    totalSKUs: 0,
  });

  // Creation forms
  const [newBazaar, setNewBazaar] = useState({ name: "", price: "", image: "", category: "Sweets" });
  const [newBox, setNewBox] = useState({ name: "", color: "from-[#F97316]/20 to-[#E2BA5F]/30 border-gold/30" });
  const [newInventory, setNewInventory] = useState({
    product_code: "",
    name: "",
    vendor_name: "",
    purchase_price: "",
    selling_price: "",
    photo_drive_link: "",
    stock_quantity: "0",
  });

  // Editing state for inventory
  const [editingInventoryCode, setEditingInventoryCode] = useState<string | null>(null);
  const [editingInventory, setEditingInventory] = useState<any>(null);

  // Sync to website modal state
  const [syncingItem, setSyncingItem] = useState<any | null>(null);
  const [syncCategory, setSyncCategory] = useState<string>("Diwali"); // Default for products
  const [syncBazaarCategory, setSyncBazaarCategory] = useState<"Sweets" | "Decor" | "Wellness" | "Gourmet">("Sweets");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Orders
        const { data: oData } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        // 2. Fetch Inquiries
        const { data: iData } = await supabase
          .from("inquiries")
          .select("*")
          .order("created_at", { ascending: false });

        // 3. Fetch Products
        const { data: pData } = await supabase
          .from("products")
          .select("*")
          .order("category");

        // 4. Fetch Bazaar Items
        const { data: bData } = await supabase
          .from("bazaar_items")
          .select("*")
          .order("category");

        // 5. Fetch Box Styles
        const { data: bsData } = await supabase
          .from("box_styles")
          .select("*")
          .order("name");

        // 6. Fetch Offline Inventory
        const { data: invData } = await supabase
          .from("offline_inventory")
          .select("*")
          .order("product_code");

        if (oData) {
          setOrders(oData);
          
          // Calculate Stats
          const revenue = oData.reduce((acc, curr) => acc + Number(curr.subtotal || 0), 0);
          const paid = oData.filter(o => o.status === "paid").length;
          const claimed = oData.filter(o => o.status === "claimed").length;

          // Calculate Offline Inventory Value
          const invValue = invData ? invData.reduce((acc, curr) => acc + (Number(curr.purchase_price || 0) * Number(curr.stock_quantity || 0)), 0) : 0;
          const skuCount = invData ? invData.length : 0;

          setStats({
            totalRevenue: revenue,
            paidOrders: paid,
            claimedGifts: claimed,
            totalInquiries: iData ? iData.length : 0,
            totalInventoryValue: invValue,
            totalSKUs: skuCount,
          });
        }
        
        if (iData) setInquiries(iData);
        if (pData) setProducts(pData);
        if (bData) setBazaarItems(bData);
        if (bsData) setBoxStyles(bsData);
        if (invData) setOfflineInventory(invData);

      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        alert("Failed to update status: " + error.message);
      } else {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const toggleBazaarActive = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("bazaar_items")
        .update({ is_active: !currentStatus })
        .eq("id", itemId);

      if (error) {
        alert("Failed to toggle status: " + error.message);
      } else {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const toggleBoxActive = async (boxId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("box_styles")
        .update({ is_active: !currentStatus })
        .eq("id", boxId);

      if (error) {
        alert("Failed to toggle status: " + error.message);
      } else {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const addBazaarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBazaar.name || !newBazaar.price || !newBazaar.image) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const { error } = await supabase
        .from("bazaar_items")
        .insert([{
          name: newBazaar.name,
          price: Number(newBazaar.price),
          image: newBazaar.image,
          category: newBazaar.category,
          is_active: true
        }]);

      if (error) {
        alert("Failed to add: " + error.message);
      } else {
        setNewBazaar({ name: "", price: "", image: "", category: "Sweets" });
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const addBoxStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBox.name || !newBox.color) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const { error } = await supabase
        .from("box_styles")
        .insert([{
          name: newBox.name,
          color: newBox.color,
          is_active: true
        }]);

      if (error) {
        alert("Failed to add: " + error.message);
      } else {
        setNewBox({ name: "", color: "from-[#F97316]/20 to-[#E2BA5F]/30 border-gold/30" });
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const addInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInventory.product_code || !newInventory.name || !newInventory.vendor_name || !newInventory.purchase_price || !newInventory.selling_price) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const { error } = await supabase
        .from("offline_inventory")
        .insert([{
          product_code: newInventory.product_code,
          name: newInventory.name,
          vendor_name: newInventory.vendor_name,
          purchase_price: Number(newInventory.purchase_price),
          selling_price: Number(newInventory.selling_price),
          photo_drive_link: newInventory.photo_drive_link || null,
          stock_quantity: Number(newInventory.stock_quantity || 0),
          is_synced: false
        }]);

      if (error) {
        alert("Failed to add: " + error.message);
      } else {
        setNewInventory({
          product_code: "",
          name: "",
          vendor_name: "",
          purchase_price: "",
          selling_price: "",
          photo_drive_link: "",
          stock_quantity: "0",
        });
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const deleteInventoryItem = async (code: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      const { error } = await supabase
        .from("offline_inventory")
        .delete()
        .eq("product_code", code);

      if (error) {
        alert("Failed to delete: " + error.message);
      } else {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const updateInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInventory) return;
    try {
      const { error } = await supabase
        .from("offline_inventory")
        .update({
          name: editingInventory.name,
          vendor_name: editingInventory.vendor_name,
          purchase_price: Number(editingInventory.purchase_price),
          selling_price: Number(editingInventory.selling_price),
          photo_drive_link: editingInventory.photo_drive_link || null,
          stock_quantity: Number(editingInventory.stock_quantity || 0),
        })
        .eq("product_code", editingInventory.product_code);

      if (error) {
        alert("Failed to update: " + error.message);
      } else {
        setEditingInventoryCode(null);
        setEditingInventory(null);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const executeWebsiteSync = async (type: "curated" | "bazaar") => {
    if (!syncingItem) return;
    try {
      if (type === "curated") {
        // Sync to products table
        const { error } = await supabase
          .from("products")
          .insert([{
            id: syncingItem.product_code,
            name: syncingItem.name,
            price: Number(syncingItem.selling_price),
            image: syncingItem.photo_drive_link || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80",
            description: `Offline Store exclusive catalog item by ${syncingItem.vendor_name}. Code: ${syncingItem.product_code}`,
            category: syncCategory,
            badge: "Offline Treasure"
          }]);

        if (error) {
          alert("Failed to sync as product: " + error.message);
          return;
        }
      } else {
        // Sync to bazaar_items table
        const { error } = await supabase
          .from("bazaar_items")
          .insert([{
            name: syncingItem.name,
            price: Number(syncingItem.selling_price),
            image: syncingItem.photo_drive_link || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&auto=format&fit=crop&q=80",
            category: syncBazaarCategory,
            is_active: true
          }]);

        if (error) {
          alert("Failed to sync as bazaar item: " + error.message);
          return;
        }
      }

      // Update sync flag on offline_inventory
      const { error: updateError } = await supabase
        .from("offline_inventory")
        .update({
          is_synced: true,
          synced_type: type
        })
        .eq("product_code", syncingItem.product_code);

      if (updateError) {
        console.error("Warning: Sync succeeded but flag update failed:", updateError.message);
      }

      setSyncingItem(null);
      alert("Successfully listed item on the website!");
      setRefreshTrigger(prev => prev + 1);

    } catch (err: any) {
      alert("Error during sync: " + err.message);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.customer_name && o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    o.delivery_mode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInquiries = inquiries.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInventory = offlineInventory.filter(item => 
    item.product_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-teal-deep/10 pb-6">
        <div>
          <h1 className="font-heading text-3xl font-black text-teal-deep">Admin Studio</h1>
          <p className="text-xs text-teal-deep/60">Configure checkout stats, orders, B2B briefs, and Hamper Studio items.</p>
        </div>
        <button
          onClick={() => setRefreshTrigger(prev => prev + 1)}
          className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 border border-teal-deep/15 hover:bg-teal-deep/5 rounded-full text-teal-deep transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Refresh Console</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Sales</span>
            <BarChart3 className="w-4 h-4 text-rani-pink" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">₹{stats.totalRevenue}</p>
          <span className="text-[10px] text-teal-deep/40">From orders database</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider">Paid Orders</span>
            <ShoppingBag className="w-4 h-4 text-saffron" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">{stats.paidOrders}</p>
          <span className="text-[10px] text-teal-deep/40">Awaiting dispatch</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider">Claimed Gifts</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">{stats.claimedGifts}</p>
          <span className="text-[10px] text-teal-deep/40">Addresses filled by recipient</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider">B2B Inquiries</span>
            <MessageSquare className="w-4 h-4 text-teal-deep" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">{stats.totalInquiries}</p>
          <span className="text-[10px] text-teal-deep/40">Corporate submissions</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider">Inventory Value</span>
            <Tag className="w-4 h-4 text-saffron" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">₹{stats.totalInventoryValue}</p>
          <span className="text-[10px] text-teal-deep/40">Total cost of offline stock</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total SKUs</span>
            <Package className="w-4 h-4 text-rani-pink" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">{stats.totalSKUs}</p>
          <span className="text-[10px] text-teal-deep/40">Offline product codes</span>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-teal-deep/5 p-2 rounded-2xl">
        <div className="flex space-x-1 flex-wrap gap-1">
          {["orders", "inquiries", "products", "bazaar", "inventory"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setSearchQuery("");
              }}
              className={`text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "bg-teal-deep text-white shadow-sm"
                  : "text-teal-deep/60 hover:text-teal-deep hover:bg-teal-deep/5"
              }`}
            >
              {tab === "bazaar" ? "Bazaar & Packaging" : tab === "inventory" ? "Offline Inventory" : tab}
            </button>
          ))}
        </div>

        {activeTab !== "bazaar" && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-teal-deep/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-teal-deep/15 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-rani-pink/40"
            />
          </div>
        )}
      </div>

      {/* Database Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader className="w-8 h-8 text-saffron animate-spin" />
          <p className="text-xs text-teal-deep/60">Fetching table items from Supabase...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-teal-deep/5 shadow-sm overflow-hidden">
          {/* TAB 1: ORDERS */}
          {activeTab === "orders" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-background border-b border-teal-deep/5 uppercase font-bold text-teal-deep/60">
                  <tr>
                    <th className="p-4">Order ID / Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Mode / Amount</th>
                    <th className="p-4">Hamper Items</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-deep/5">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-teal-deep/40">No orders registered.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-teal-deep/5 transition-colors">
                        <td className="p-4 font-semibold">
                          <span className="block truncate max-w-[120px] font-mono" title={order.id}>{order.id}</span>
                          <span className="text-[10px] text-teal-deep/45 flex items-center mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          {order.delivery_mode === "physical" ? (
                            <div>
                              <span className="font-semibold block">{order.customer_name}</span>
                              <span className="text-[10px] text-teal-deep/60">{order.customer_phone}</span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-semibold block text-rani-pink">{order.magical_link_details?.recipientName} (Recipient)</span>
                              <span className="text-[10px] text-teal-deep/60">{order.magical_link_details?.recipientContact}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase inline-block mb-1 ${
                            order.delivery_mode === "magical" ? "bg-rani-pink/10 text-rani-pink" : "bg-teal-deep/10 text-teal-deep"
                          }`}>
                            {order.delivery_mode}
                          </span>
                          <span className="block font-bold text-teal-deep">₹{order.subtotal}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {order.items?.map((item: any, idx: number) => (
                              <span key={idx} className="bg-teal-deep/5 px-2 py-0.5 rounded text-[10px] block">
                                {item.name} x{item.quantity}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            order.status === "claimed" ? "bg-emerald-100 text-emerald-800" :
                            order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          {order.status === "paid" && (
                            <button
                              onClick={() => updateOrderStatus(order.id, "shipped")}
                              className="px-2.5 py-1.5 bg-teal-deep text-white rounded-lg hover:bg-teal-deep/90 font-bold text-[10px] transition-colors"
                            >
                              Ship Order
                            </button>
                          )}
                          {order.status === "claimed" && (
                            <button
                              onClick={() => updateOrderStatus(order.id, "shipped")}
                              className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold text-[10px] transition-colors"
                            >
                              Dispatch Gift
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-background border-b border-teal-deep/5 uppercase font-bold text-teal-deep/60">
                  <tr>
                    <th className="p-4">Date / Brand</th>
                    <th className="p-4">Contact Person</th>
                    <th className="p-4">Details</th>
                    <th className="p-4">Requirements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-deep/5">
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-teal-deep/40">No B2B inquiries found.</td>
                    </tr>
                  ) : (
                    filteredInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-teal-deep/5 transition-colors">
                        <td className="p-4 font-semibold">
                          <span className="font-heading text-sm text-teal-deep block">{inq.company}</span>
                          <span className="text-[10px] text-teal-deep/45">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4 space-y-1">
                          <span className="font-semibold block">{inq.name}</span>
                          <span className="text-[10px] text-teal-deep/65 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {inq.email}
                          </span>
                          <span className="text-[10px] text-teal-deep/65 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {inq.phone}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <span className="block">Quantity: <strong>{inq.quantity} Hampers</strong></span>
                            <span className="block">Budget: <strong>{inq.budget}</strong></span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-xs text-teal-deep/75 max-w-sm italic line-clamp-2" title={inq.details}>
                            {inq.details || "No custom specifications listed."}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === "products" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-background border-b border-teal-deep/5 uppercase font-bold text-teal-deep/60">
                  <tr>
                    <th className="p-4">Product ID / Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Badge</th>
                    <th className="p-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-deep/5">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-teal-deep/5 transition-colors">
                      <td className="p-4 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-teal-deep/5 border border-teal-deep/10 flex items-center justify-center flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80";
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-semibold block">{prod.name}</span>
                          <span className="text-[10px] text-teal-deep/45 font-mono">{prod.id}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-teal-deep/80">{prod.category}</td>
                      <td className="p-4">
                        {prod.badge ? (
                          <span className="bg-saffron/10 border border-saffron/20 text-saffron font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide">
                            {prod.badge}
                          </span>
                        ) : (
                          <span className="text-teal-deep/30">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-bold text-teal-deep text-sm">₹{prod.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: BAZAAR & PACKAGING (NEW) */}
          {activeTab === "bazaar" && (
            <div className="p-6 space-y-12">
              {/* Part A: Bazaar items configuration */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-teal-deep/5 pb-4">
                  <h3 className="font-heading text-lg font-bold text-teal-deep">1. Hamper Studio treats</h3>
                  <span className="text-[10px] text-teal-deep/50">Configure treats selectable by user in Build-a-Box studio.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Form to add item */}
                  <form onSubmit={addBazaarItem} className="md:col-span-4 bg-teal-deep/5 p-6 rounded-2xl border border-teal-deep/5 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-teal-deep flex items-center space-x-1">
                      <Plus className="w-4 h-4 text-rani-pink" />
                      <span>Add New Custom Treat</span>
                    </h4>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-teal-deep/60">Treat Name</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Rose Barfi (150g)"
                        value={newBazaar.name}
                        onChange={(e) => setNewBazaar({ ...newBazaar, name: e.target.value })}
                        className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rani-pink/40"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-teal-deep/60">Price (INR)</label>
                        <input
                          type="number"
                          required
                          placeholder="399"
                          value={newBazaar.price}
                          onChange={(e) => setNewBazaar({ ...newBazaar, price: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rani-pink/40"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-teal-deep/60">Category</label>
                        <select
                          value={newBazaar.category}
                          onChange={(e) => setNewBazaar({ ...newBazaar, category: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-2 py-2 text-xs focus:outline-none text-teal-deep focus:border-rani-pink/40"
                        >
                          <option value="Sweets">Sweets</option>
                          <option value="Decor">Decor</option>
                          <option value="Wellness">Wellness</option>
                          <option value="Gourmet">Gourmet</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-teal-deep/60">Image URL</label>
                      <input
                        type="text"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={newBazaar.image}
                        onChange={(e) => setNewBazaar({ ...newBazaar, image: e.target.value })}
                        className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rani-pink/40"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-lg font-bold text-xs shadow transition-all"
                    >
                      Add to Studio Catalog
                    </button>
                  </form>

                  {/* List of active items */}
                  <div className="md:col-span-8 overflow-y-auto max-h-[360px] border border-teal-deep/5 rounded-2xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-background uppercase font-bold text-teal-deep/60 border-b border-teal-deep/5">
                        <tr>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Display Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-teal-deep/5">
                        {bazaarItems.map((item) => (
                          <tr key={item.id} className="hover:bg-teal-deep/5">
                            <td className="p-3 flex items-center space-x-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                              <span className="font-semibold">{item.name}</span>
                            </td>
                            <td className="p-3 text-teal-deep/80">{item.category}</td>
                            <td className="p-3 font-bold">₹{item.price}</td>
                            <td className="p-3">
                              <button
                                onClick={() => toggleBazaarActive(item.id, item.is_active)}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-bold text-[10px] transition-colors ${
                                  item.is_active 
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                }`}
                              >
                                {item.is_active ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span>Hidden</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Part B: Box Styles configuration */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-teal-deep/5 pb-4">
                  <h3 className="font-heading text-lg font-bold text-teal-deep">2. Rigid Packaging Styles</h3>
                  <span className="text-[10px] text-teal-deep/50">Manage the rigid boxes offered in Hamper customizer.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Form to add box */}
                  <form onSubmit={addBoxStyle} className="md:col-span-4 bg-teal-deep/5 p-6 rounded-2xl border border-teal-deep/5 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-teal-deep flex items-center space-x-1">
                      <Plus className="w-4 h-4 text-rani-pink" />
                      <span>Add Box Style</span>
                    </h4>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-teal-deep/60">Box Name</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Sapphire Velvet Drawer"
                        value={newBox.name}
                        onChange={(e) => setNewBox({ ...newBox, name: e.target.value })}
                        className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rani-pink/40"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-teal-deep/60">Tailwind Color Gradient Style</label>
                      <input
                        type="text"
                        required
                        placeholder="from-blue-900/20 to-blue-500/20 border-blue-500/20"
                        value={newBox.color}
                        onChange={(e) => setNewBox({ ...newBox, color: e.target.value })}
                        className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none font-mono"
                      />
                      <span className="text-[9px] text-teal-deep/50 block">Tailwind gradient class settings.</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-lg font-bold text-xs shadow transition-all"
                    >
                      Add Box Style
                    </button>
                  </form>

                  {/* List of box styles */}
                  <div className="md:col-span-8 overflow-y-auto max-h-[300px] border border-teal-deep/5 rounded-2xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-background uppercase font-bold text-teal-deep/60 border-b border-teal-deep/5">
                        <tr>
                          <th className="p-3">Box Style Name</th>
                          <th className="p-3">Color Preview</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-teal-deep/5">
                        {boxStyles.map((box) => (
                          <tr key={box.id} className="hover:bg-teal-deep/5">
                            <td className="p-3 font-semibold text-teal-deep">{box.name}</td>
                            <td className="p-3">
                              <div className={`w-20 h-6 rounded border bg-gradient-to-tr ${box.color}`} />
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => toggleBoxActive(box.id, box.is_active)}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-bold text-[10px] transition-colors ${
                                  box.is_active 
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                }`}
                              >
                                {box.is_active ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span>Hidden</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OFFLINE INVENTORY */}
          {activeTab === "inventory" && (
            <div className="p-6 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-teal-deep/5 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-teal-deep">Offline Store Inventory</h3>
                  <p className="text-[10px] text-teal-deep/50">Manage local stock parameters, margins, vendor listings, and publish directly to the website.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Create / Edit SKU Form */}
                <div className="lg:col-span-4">
                  {editingInventoryCode && editingInventory ? (
                    <form onSubmit={updateInventoryItem} className="bg-saffron/5 p-6 rounded-2xl border border-saffron/15 space-y-4">
                      <h4 className="font-heading text-sm font-bold text-saffron flex items-center space-x-1.5">
                        <Edit3 className="w-4 h-4" />
                        <span>Edit SKU: {editingInventoryCode}</span>
                      </h4>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-teal-deep/60">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={editingInventory.name}
                          onChange={(e) => setEditingInventory({ ...editingInventory, name: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-teal-deep/60">Vendor Name *</label>
                        <input
                          type="text"
                          required
                          value={editingInventory.vendor_name}
                          onChange={(e) => setEditingInventory({ ...editingInventory, vendor_name: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-teal-deep/60">Purchase Cost *</label>
                          <input
                            type="number"
                            required
                            value={editingInventory.purchase_price}
                            onChange={(e) => setEditingInventory({ ...editingInventory, purchase_price: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-teal-deep/60">Retail Price *</label>
                          <input
                            type="number"
                            required
                            value={editingInventory.selling_price}
                            onChange={(e) => setEditingInventory({ ...editingInventory, selling_price: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-teal-deep/60">Stock Count *</label>
                          <input
                            type="number"
                            required
                            value={editingInventory.stock_quantity}
                            onChange={(e) => setEditingInventory({ ...editingInventory, stock_quantity: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-teal-deep/60">Markup Margin</label>
                          <div className="w-full bg-teal-deep/5 border border-teal-deep/10 text-teal-deep font-bold rounded-lg px-3 py-2 text-xs">
                            {editingInventory.selling_price && editingInventory.purchase_price
                              ? `${(((Number(editingInventory.selling_price) - Number(editingInventory.purchase_price)) / Number(editingInventory.purchase_price)) * 100).toFixed(0)}%`
                              : "0%"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-teal-deep/60">Drive Photos Link</label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/..."
                          value={editingInventory.photo_drive_link || ""}
                          onChange={(e) => setEditingInventory({ ...editingInventory, photo_drive_link: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-saffron hover:bg-saffron/90 text-white rounded-lg font-bold text-xs shadow transition-all"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingInventoryCode(null);
                            setEditingInventory(null);
                          }}
                          className="px-4 py-2.5 bg-teal-deep/5 hover:bg-teal-deep/10 text-teal-deep rounded-lg font-bold text-xs transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={addInventoryItem} className="bg-teal-deep/5 p-6 rounded-2xl border border-teal-deep/5 space-y-4">
                      <h4 className="font-heading text-sm font-bold text-teal-deep flex items-center space-x-1.5">
                        <Plus className="w-4 h-4 text-rani-pink" />
                        <span>Register New SKU</span>
                      </h4>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-teal-deep/60">Product Code / SKU *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. SKU-101"
                          value={newInventory.product_code}
                          onChange={(e) => setNewInventory({ ...newInventory, product_code: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-teal-deep/60">Product Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. Handmade Silver Diya"
                          value={newInventory.name}
                          onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-teal-deep/60">Vendor Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. Jaipur Crafts Ltd"
                          value={newInventory.vendor_name}
                          onChange={(e) => setNewInventory({ ...newInventory, vendor_name: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-teal-deep/60">Purchase Cost *</label>
                          <input
                            type="number"
                            required
                            placeholder="650"
                            value={newInventory.purchase_price}
                            onChange={(e) => setNewInventory({ ...newInventory, purchase_price: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-teal-deep/60">Retail Price *</label>
                          <input
                            type="number"
                            required
                            placeholder="1200"
                            value={newInventory.selling_price}
                            onChange={(e) => setNewInventory({ ...newInventory, selling_price: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-teal-deep/60">Stock Qty *</label>
                          <input
                            type="number"
                            required
                            placeholder="15"
                            value={newInventory.stock_quantity}
                            onChange={(e) => setNewInventory({ ...newInventory, stock_quantity: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-teal-deep/60">Expected Margin</label>
                          <div className="w-full bg-teal-deep/5 border border-teal-deep/10 text-teal-deep font-bold rounded-lg px-3 py-2 text-xs">
                            {newInventory.selling_price && newInventory.purchase_price
                              ? `${(((Number(newInventory.selling_price) - Number(newInventory.purchase_price)) / Number(newInventory.purchase_price)) * 100).toFixed(0)}%`
                              : "0%"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-teal-deep/60">Google Drive Photos Link</label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/..."
                          value={newInventory.photo_drive_link}
                          onChange={(e) => setNewInventory({ ...newInventory, photo_drive_link: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-lg font-bold text-xs shadow transition-all"
                      >
                        Register SKU Item
                      </button>
                    </form>
                  )}
                </div>

                {/* Right Side: Tabular SKU database */}
                <div className="lg:col-span-8 overflow-x-auto border border-teal-deep/5 rounded-2xl bg-white/50 backdrop-blur-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-background uppercase font-bold text-teal-deep/60 border-b border-teal-deep/5">
                      <tr>
                        <th className="p-3">SKU / Name</th>
                        <th className="p-3">Vendor</th>
                        <th className="p-3 text-right">Purchase</th>
                        <th className="p-3 text-right">Selling</th>
                        <th className="p-3 text-center">Stock</th>
                        <th className="p-3 text-center">Photos</th>
                        <th className="p-3 text-center">Sync status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-deep/5">
                      {filteredInventory.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-teal-deep/45">
                            No matching offline inventory SKUs found.
                          </td>
                        </tr>
                      ) : (
                        filteredInventory.map((item) => (
                          <tr key={item.product_code} className="hover:bg-teal-deep/5 transition-colors">
                            <td className="p-3">
                              <span className="font-semibold block text-teal-deep">{item.name}</span>
                              <span className="text-[10px] text-teal-deep/45 font-mono uppercase">{item.product_code}</span>
                            </td>
                            <td className="p-3 text-teal-deep/75 font-medium">{item.vendor_name}</td>
                            <td className="p-3 text-right text-teal-deep/60">₹{item.purchase_price}</td>
                            <td className="p-3 text-right font-bold text-teal-deep">₹{item.selling_price}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                item.stock_quantity <= 3
                                  ? "bg-red-100 text-red-800"
                                  : "bg-teal-deep/5 text-teal-deep"
                              }`}>
                                {item.stock_quantity} units
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              {item.photo_drive_link ? (
                                <a
                                  href={item.photo_drive_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex p-1 bg-amber-50 hover:bg-amber-100 border border-gold/20 text-saffron rounded-lg shadow-sm"
                                  title="View Google Drive Photos"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <span className="text-[10px] text-teal-deep/30">-</span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {item.is_synced ? (
                                <span className="inline-flex items-center space-x-0.5 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase">
                                  <Globe className="w-2.5 h-2.5" />
                                  <span>{item.synced_type === "curated" ? "Curated" : "Bazaar"}</span>
                                </span>
                              ) : (
                                <span className="inline-block bg-teal-deep/5 text-teal-deep/50 px-2 py-0.5 rounded-full text-[9px]">
                                  Offline only
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex space-x-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingInventoryCode(item.product_code);
                                    setEditingInventory({ ...item });
                                  }}
                                  className="p-1.5 bg-teal-deep/5 hover:bg-teal-deep/10 text-teal-deep rounded-lg"
                                  title="Edit SKU Details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSyncingItem(item)}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg"
                                  title="Sync to Website"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteInventoryItem(item.product_code)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                  title="Delete SKU"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Website Sync Dialog Modal */}
      <AnimatePresence>
        {syncingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSyncingItem(null)}
              className="absolute inset-0 bg-teal-deep/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white border border-teal-deep/10 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10 text-left"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-saffron uppercase tracking-widest">Publish to Website</span>
                <h3 className="font-heading text-xl font-bold text-teal-deep">List "{syncingItem.name}"</h3>
                <p className="text-[10px] text-teal-deep/50 font-mono uppercase">SKU: {syncingItem.product_code}</p>
              </div>

              <div className="space-y-4">
                {/* Mode A: Curated Product */}
                <div className="p-4 bg-teal-deep/5 border border-teal-deep/10 rounded-2xl space-y-3">
                  <h4 className="font-bold text-xs text-teal-deep flex items-center space-x-1.5">
                    <ShoppingBag className="w-4 h-4 text-rani-pink" />
                    <span>Option 1: Sync as Pre-curated Box</span>
                  </h4>
                  <p className="text-[10px] text-teal-deep/70">Will list this item directly inside the collections catalogue at `/collections` under a chosen theme category.</p>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-teal-deep/50 uppercase">Category Tag</label>
                    <select
                      value={syncCategory}
                      onChange={(e) => setSyncCategory(e.target.value)}
                      className="w-full bg-background border border-teal-deep/15 rounded-lg px-2 py-1 text-xs text-teal-deep focus:outline-none"
                    >
                      <option value="Diwali">Diwali Celebrations</option>
                      <option value="Weddings">Wedding Ceremonies</option>
                      <option value="Anniversary">Anniversary Romance</option>
                      <option value="Corporate">Corporate Elite</option>
                      <option value="Housewarming">Housewarming Serenity</option>
                    </select>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => executeWebsiteSync("curated")}
                    className="w-full py-2 bg-teal-deep hover:bg-teal-deep/90 text-[#FAF4E8] rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm"
                  >
                    Publish Curated Listing (₹{syncingItem.selling_price})
                  </button>
                </div>

                {/* Mode B: Bazaar Custom treat */}
                <div className="p-4 bg-saffron/5 border border-saffron/10 rounded-2xl space-y-3">
                  <h4 className="font-bold text-xs text-teal-deep flex items-center space-x-1.5">
                    <Tag className="w-4 h-4 text-saffron" />
                    <span>Option 2: Sync as Hamper Studio Treat</span>
                  </h4>
                  <p className="text-[10px] text-teal-deep/70">Will register this treat inside the Build-a-Box configurator studio database. Users can choose it as a sub-item in custom gift baskets.</p>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-teal-deep/50 uppercase">Bazaar Section</label>
                    <select
                      value={syncBazaarCategory}
                      onChange={(e) => setSyncBazaarCategory(e.target.value as any)}
                      className="w-full bg-background border border-teal-deep/15 rounded-lg px-2 py-1 text-xs text-teal-deep focus:outline-none"
                    >
                      <option value="Sweets">Sweets (Mithai/Dry Fruits)</option>
                      <option value="Decor">Decor (Diyas/Toran)</option>
                      <option value="Wellness">Wellness (Candles/Mists)</option>
                      <option value="Gourmet">Gourmet (Tea/Flasks)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => executeWebsiteSync("bazaar")}
                    className="w-full py-2 bg-saffron hover:bg-saffron/90 text-white rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm"
                  >
                    Publish Custom Treat (₹{syncingItem.selling_price})
                  </button>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSyncingItem(null)}
                  className="w-full py-3 bg-teal-deep/5 hover:bg-teal-deep/10 text-teal-deep rounded-xl font-bold text-xs transition-all text-center"
                >
                  Cancel & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
