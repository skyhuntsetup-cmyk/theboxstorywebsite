"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  BarChart3, ShoppingBag, MessageSquare, Package, Loader, 
  CheckCircle, ArrowRight, Truck, Mail, Phone, Calendar, Search, RefreshCw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "inquiries" | "products">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Statistics states
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidOrders: 0,
    claimedGifts: 0,
    totalInquiries: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Orders
        const { data: oData, error: oErr } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        // 2. Fetch Inquiries
        const { data: iData, error: iErr } = await supabase
          .from("inquiries")
          .select("*")
          .order("created_at", { ascending: false });

        // 3. Fetch Products
        const { data: pData, error: pErr } = await supabase
          .from("products")
          .select("*")
          .order("category");

        if (oData) {
          setOrders(oData);
          
          // Calculate Stats
          const revenue = oData.reduce((acc, curr) => acc + Number(curr.subtotal || 0), 0);
          const paid = oData.filter(o => o.status === "paid").length;
          const claimed = oData.filter(o => o.status === "claimed").length;

          setStats({
            totalRevenue: revenue,
            paidOrders: paid,
            claimedGifts: claimed,
            totalInquiries: iData ? iData.length : 0,
          });
        }
        
        if (iData) setInquiries(iData);
        if (pData) setProducts(pData);

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-teal-deep/10 pb-6">
        <div>
          <h1 className="font-heading text-3xl font-black text-teal-deep">Admin Studio</h1>
          <p className="text-xs text-teal-deep/60">Manage orders, B2B inquiries, and product curations from Supabase.</p>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-teal-deep/5 p-2 rounded-2xl">
        <div className="flex space-x-1">
          {["orders", "inquiries", "products"].map((tab) => (
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
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-teal-deep/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFDF5] border border-teal-deep/15 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-rani-pink/40"
          />
        </div>
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
                <thead className="bg-[#FFFDF5] border-b border-teal-deep/5 uppercase font-bold text-teal-deep/60">
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
                <thead className="bg-[#FFFDF5] border-b border-teal-deep/5 uppercase font-bold text-teal-deep/60">
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
                <thead className="bg-[#FFFDF5] border-b border-teal-deep/5 uppercase font-bold text-teal-deep/60">
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
        </div>
      )}
    </div>
  );
}
