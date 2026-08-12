"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  BarChart3, ShoppingBag, MessageSquare, Package, Loader,
  CheckCircle, Mail, Phone, Calendar, Search, RefreshCw,
  Eye, EyeOff, Plus, Trash2, ExternalLink, Edit3, Globe, Tag, X, LogOut, Copy, Link2, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Order, Inquiry, BoxStyleRow, OfflineInventoryItem, OrderItem, CategoryRow, StoreRow, ProductWithCategories, BlogPostRow, CustomFieldDef } from "../../lib/types";
import type { SiteContentField } from "../../lib/siteContent";
import CampaignsTab from "./CampaignsTab";
import StoresTab from "./StoresTab";
import BillingTab from "./BillingTab";
import BulkImportPanel from "./BulkImportPanel";
import CustomersTab from "./CustomersTab";
import LeadsTab from "./LeadsTab";

type AdminTab = "orders" | "inquiries" | "products" | "categories" | "stores" | "blog" | "packaging" | "inventory" | "portfolio" | "catalog" | "content" | "campaigns" | "billing" | "customers" | "leads";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostRow[]>([]);
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [boxStyles, setBoxStyles] = useState<BoxStyleRow[]>([]);
  const [offlineInventory, setOfflineInventory] = useState<OfflineInventoryItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [catalogueLinkCopied, setCatalogueLinkCopied] = useState(false);

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
  const [editingInventory, setEditingInventory] = useState<OfflineInventoryItem | null>(null);

  // Categories tab state
  const [newCategory, setNewCategory] = useState({ name: "", description: "", image: "" });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Products tab state (full CRUD, multi-category tagging)
  const emptyProductForm = {
    id: "", name: "", price: "", image: "", description: "", badge: "", stock_quantity: "", cost_price: "",
    categoryIds: [] as string[],
    storeIds: [] as string[],
    personalization_fields: [] as CustomFieldDef[],
  };
  const [newProduct, setNewProduct] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<(ProductWithCategories & { priceInput?: string }) | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Blog tab state
  const emptyBlogForm = { title: "", excerpt: "", content: "", category: "", image: "", tags: "", is_published: true };
  const [newBlogPost, setNewBlogPost] = useState(emptyBlogForm);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<(BlogPostRow & { tagsInput?: string }) | null>(null);
  const [isSavingBlog, setIsSavingBlog] = useState(false);
  const [showAddBlog, setShowAddBlog] = useState(false);

  // Sync to website modal state
  const [syncingItem, setSyncingItem] = useState<OfflineInventoryItem | null>(null);
  const [syncCategory, setSyncCategory] = useState<string>("Diwali"); // Default for products

  // Website Content Config states
  const [catalogConfig, setCatalogConfig] = useState<{ totalPages: number; sections: any[] } | null>(null);
  const [portfolioConfig, setPortfolioConfig] = useState<{ projects: any[] } | null>(null);
  const [siteContentConfig, setSiteContentConfig] = useState<{ fields: SiteContentField[] } | null>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchConfigs = async () => {
    try {
      const catRes = await fetch("/api/admin/get-config?type=catalog");
      const catData = await catRes.json();
      if (catData.success) setCatalogConfig(catData.config);

      const portRes = await fetch("/api/admin/get-config?type=past-work");
      const portData = await portRes.json();
      if (portData.success) setPortfolioConfig(portData.config);

      const contentRes = await fetch("/api/admin/get-config?type=site-content");
      const contentData = await contentRes.json();
      if (contentData.success) setSiteContentConfig(contentData.config);
    } catch (err) {
      console.error("Error loading configs:", err);
    }
  };

  const saveConfig = async (type: "catalog" | "past-work" | "site-content", config: any) => {
    setIsSavingConfig(true);
    try {
      const res = await fetch("/api/admin/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, config }),
      });
      const data = await res.json();
      if (data.success) {
        // Reload configurations to sync state
        const catRes = await fetch("/api/admin/get-config?type=catalog");
        const catData = await catRes.json();
        if (catData.success) setCatalogConfig(catData.config);

        const portRes = await fetch("/api/admin/get-config?type=past-work");
        const portData = await portRes.json();
        if (portData.success) setPortfolioConfig(portData.config);

        const contentRes = await fetch("/api/admin/get-config?type=site-content");
        const contentData = await contentRes.json();
        if (contentData.success) setSiteContentConfig(contentData.config);
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      alert("Error saving: " + err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "catalog" | "past-work",
    folder?: string,
    projectIdx?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    if (folder) formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload-photo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === "past-work" && projectIdx !== undefined && portfolioConfig) {
          const updatedProjects = [...portfolioConfig.projects];
          updatedProjects[projectIdx].images.push(data.url);
          const newConfig = { ...portfolioConfig, projects: updatedProjects };
          setPortfolioConfig(newConfig);
          await saveConfig("past-work", newConfig);
        } else if (type === "catalog" && catalogConfig) {
          // If uploading page_XX.png, update totalPages
          const match = file.name.match(/page_(\d+)/i);
          if (match) {
            const pageNum = parseInt(match[1]);
            if (pageNum > catalogConfig.totalPages) {
              const newConfig = { ...catalogConfig, totalPages: pageNum };
              setCatalogConfig(newConfig);
              await saveConfig("catalog", newConfig);
            }
          }
        }
        alert("Image uploaded and linked successfully!");
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Upload error: " + err);
    } finally {
      setIsUploading(false);
    }
  };

  const updateContentField = (key: string, value: string) => {
    if (!siteContentConfig) return;
    const updated = {
      ...siteContentConfig,
      fields: siteContentConfig.fields.map((f) => (f.key === key ? { ...f, value } : f)),
    };
    setSiteContentConfig(updated);
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file || !siteContentConfig) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "site-content");
    formData.append("fieldKey", fieldKey);

    try {
      const res = await fetch("/api/admin/upload-photo", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        const updated = {
          ...siteContentConfig,
          fields: siteContentConfig.fields.map((f) => (f.key === fieldKey ? { ...f, value: data.url } : f)),
        };
        setSiteContentConfig(updated);
        await saveConfig("site-content", updated);
        alert("Image uploaded and saved!");
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Upload error: " + err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchConfigs();
        // 1. Fetch Orders
        const { data: oData } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        // 2-6. Fetch Inquiries, Products (+tagged categories/stores),
        // Categories, Stores, Blog Posts, Box Styles, and Offline Inventory,
        // all via service-role admin API routes. Inquiries and
        // offline_inventory have no public-read RLS policy at all (anon
        // reads returned nothing silently); products/categories/stores/blog/
        // box_styles are publicly readable but also need admin writes here,
        // which the anon-key client can't do against
        // `auth.role() = 'authenticated'` policies without a real Supabase
        // Auth session.
        const [iRes, prodRes, catRes, storesRes, blogRes, bsRes, invRes] = await Promise.all([
          fetch("/api/admin/inquiries").then(r => r.json()).catch(() => null),
          fetch("/api/admin/products").then(r => r.json()).catch(() => null),
          fetch("/api/admin/categories").then(r => r.json()).catch(() => null),
          fetch("/api/admin/stores").then(r => r.json()).catch(() => null),
          fetch("/api/admin/blog").then(r => r.json()).catch(() => null),
          fetch("/api/admin/box-styles").then(r => r.json()).catch(() => null),
          fetch("/api/admin/inventory").then(r => r.json()).catch(() => null),
        ]);
        const iData = iRes?.success ? iRes.inquiries : null;
        if (prodRes?.success) setProducts(prodRes.products);
        if (catRes?.success) setCategories(catRes.categories);
        if (storesRes?.success) setStores(storesRes.stores);
        if (blogRes?.success) setBlogPosts(blogRes.posts);
        const bsData = bsRes?.success ? bsRes.styles : null;
        const invData = invRes?.success ? invRes.items : null;

        if (oData) {
          setOrders(oData);
          
          // Calculate Stats
          const revenue = oData.reduce((acc: number, curr: Order) => acc + Number(curr.subtotal || 0), 0);
          const paid = oData.filter(o => o.status === "paid").length;
          const claimed = oData.filter(o => o.status === "claimed").length;

          // Calculate Offline Inventory Value
          const invValue = invData
            ? invData.reduce((acc: number, curr: OfflineInventoryItem) => acc + (Number(curr.purchase_price || 0) * Number(curr.stock_quantity || 0)), 0)
            : 0;
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
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) setRefreshTrigger(prev => prev + 1);
      else alert("Failed to update status: " + data.error);
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const toggleBoxActive = async (boxId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/box-styles/${boxId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) setRefreshTrigger(prev => prev + 1);
      else alert("Failed to toggle status: " + data.error);
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const addBoxStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBox.name || !newBox.color) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const res = await fetch("/api/admin/box-styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBox),
      });
      const data = await res.json();
      if (data.success) {
        setNewBox({ name: "", color: "from-[#F97316]/20 to-[#E2BA5F]/30 border-gold/30" });
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to add: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const addInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInventory.product_code || !newInventory.name || !newInventory.vendor_name || !newInventory.purchase_price || !newInventory.selling_price) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInventory),
      });
      const data = await res.json();
      if (data.success) {
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
      } else {
        alert("Failed to add: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const deleteInventoryItem = async (code: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      const res = await fetch(`/api/admin/inventory/${encodeURIComponent(code)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setRefreshTrigger(prev => prev + 1);
      else alert("Failed to delete: " + data.error);
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const updateInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInventory) return;
    try {
      const res = await fetch(`/api/admin/inventory/${encodeURIComponent(editingInventory.product_code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingInventory.name,
          vendor_name: editingInventory.vendor_name,
          purchase_price: Number(editingInventory.purchase_price),
          selling_price: Number(editingInventory.selling_price),
          photo_drive_link: editingInventory.photo_drive_link || null,
          stock_quantity: Number(editingInventory.stock_quantity || 0),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingInventoryCode(null);
        setEditingInventory(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to update: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // ─── Categories CRUD ───────────────────────────────────────────────────────

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) { alert("Category name is required."); return; }
    setIsSavingCategory(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCategory, display_order: categories.length }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCategory({ name: "", description: "", image: "" });
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to add category: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSavingCategory(false);
    }
  };

  const updateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsSavingCategory(true);
    try {
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingCategory.name,
          description: editingCategory.description,
          image: editingCategory.image,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingCategoryId(null);
        setEditingCategory(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to update category: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSavingCategory(false);
    }
  };

  const toggleCategoryActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) setRefreshTrigger(prev => prev + 1);
      else alert("Failed to toggle status: " + data.error);
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products tagged into it will lose that tag (they stay tagged into any other categories).`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setRefreshTrigger(prev => prev + 1);
      else alert("Failed to delete: " + data.error);
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // ─── Products CRUD ─────────────────────────────────────────────────────────

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.id.trim() || !newProduct.name.trim() || !newProduct.price) {
      alert("Product ID, name, and price are required."); return;
    }
    if (newProduct.categoryIds.length === 0) {
      alert("Select at least one category."); return;
    }
    if (newProduct.storeIds.length === 0) {
      alert("Select at least one store."); return;
    }
    setIsSavingProduct(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (data.success) {
        setNewProduct(emptyProductForm);
        setShowAddProduct(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to add product: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSavingProduct(false);
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (editingProduct.categoryIds.length === 0) {
      alert("Select at least one category."); return;
    }
    if (editingProduct.storeIds.length === 0) {
      alert("Select at least one store."); return;
    }
    setIsSavingProduct(true);
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingProduct.name,
          price: editingProduct.price,
          image: editingProduct.image,
          description: editingProduct.description,
          badge: editingProduct.badge,
          stock_quantity: editingProduct.stock_quantity,
          cost_price: editingProduct.cost_price,
          categoryIds: editingProduct.categoryIds,
          storeIds: editingProduct.storeIds,
          personalization_fields: editingProduct.personalization_fields,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProductId(null);
        setEditingProduct(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to update product: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSavingProduct(false);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This removes it from the shop and every category page immediately.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setRefreshTrigger(prev => prev + 1);
      else alert("Failed to delete: " + data.error);
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // ─── Blog CRUD ──────────────────────────────────────────────────────────────

  const addBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogPost.title.trim() || !newBlogPost.content.trim()) {
      alert("Title and content are required."); return;
    }
    setIsSavingBlog(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBlogPost,
          tags: newBlogPost.tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewBlogPost(emptyBlogForm);
        setShowAddBlog(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to add post: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSavingBlog(false);
    }
  };

  const updateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlogPost) return;
    setIsSavingBlog(true);
    try {
      const res = await fetch(`/api/admin/blog/${editingBlogPost.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingBlogPost.title,
          excerpt: editingBlogPost.excerpt,
          content: editingBlogPost.content,
          category: editingBlogPost.category,
          image: editingBlogPost.image,
          tags: (editingBlogPost.tagsInput ?? editingBlogPost.tags.join(", ")).split(",").map(t => t.trim()).filter(Boolean),
          is_published: editingBlogPost.is_published,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingBlogId(null);
        setEditingBlogPost(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert("Failed to update post: " + data.error);
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSavingBlog(false);
    }
  };

  const deleteBlogPost = async (id: string, title: string) => {
    if (!confirm(`Delete blog post "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setRefreshTrigger(prev => prev + 1);
      else alert("Failed to delete: " + data.error);
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const executeWebsiteSync = async (type: "curated" | "bazaar") => {
    if (!syncingItem) return;
    try {
      const categoryId = categories.find((c) => c.name === syncCategory)?.id;
      if (!categoryId) {
        alert(`No "${syncCategory}" category found — create it under the Categories tab first.`);
        return;
      }
      const storeSlug = type === "curated" ? "pre-curated-collections" : "build-your-own-box";
      const storeId = stores.find((s) => s.slug === storeSlug)?.id;
      if (!storeId) {
        alert(`Store setup incomplete — seed the "${storeSlug}" store under the Stores tab first.`);
        return;
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: syncingItem.product_code,
          name: syncingItem.name,
          price: Number(syncingItem.selling_price),
          image: syncingItem.photo_drive_link || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80",
          description: `Offline Store exclusive catalog item by ${syncingItem.vendor_name}. Code: ${syncingItem.product_code}`,
          badge: type === "curated" ? "Offline Treasure" : undefined,
          categoryIds: [categoryId],
          storeIds: [storeId],
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Failed to sync: " + data.error);
        return;
      }

      // Update sync flag on offline_inventory
      const flagRes = await fetch(`/api/admin/inventory/${encodeURIComponent(syncingItem.product_code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_synced: true, synced_type: type }),
      });
      const flagData = await flagRes.json();
      if (!flagData.success) {
        console.error("Warning: Sync succeeded but flag update failed:", flagData.error);
      }

      setSyncingItem(null);
      alert("Successfully listed item on the website!");
      setRefreshTrigger(prev => prev + 1);

    } catch (err) {
      alert("Error during sync: " + (err instanceof Error ? err.message : String(err)));
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
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-teal-deep/10 pb-6">
        <div>
          <h1 className="font-heading text-3xl font-black text-teal-deep">Admin Studio</h1>
          <p className="text-xs text-teal-deep/60">Configure checkout stats, orders, B2B briefs, and Hamper Studio items.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 border border-teal-deep/15 hover:bg-teal-deep/5 rounded-full text-teal-deep transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Refresh Console</span>
          </button>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-full transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Shareable Catalogue Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-deep text-white rounded-2xl px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <Link2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xs font-bold block">Shareable Gift Catalogue</span>
            <span className="text-[13px] text-white/60">Drop this link on WhatsApp — customers browse, add to cart, and send their order back to you.</span>
          </div>
        </div>
        <button
          onClick={() => {
            const url = typeof window !== "undefined" ? `${window.location.origin}/catalogue` : "https://theboxstory.co.in/catalogue";
            navigator.clipboard.writeText(url);
            setCatalogueLinkCopied(true);
            setTimeout(() => setCatalogueLinkCopied(false), 2000);
          }}
          className="flex items-center justify-center space-x-1.5 text-xs font-bold bg-white text-teal-deep px-4 py-2.5 rounded-full hover:bg-white/90 transition-colors flex-shrink-0"
        >
          {catalogueLinkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{catalogueLinkCopied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[12px] uppercase font-bold tracking-wider">Total Sales</span>
            <BarChart3 className="w-4 h-4 text-rani-pink" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">₹{stats.totalRevenue}</p>
          <span className="text-[12px] text-teal-deep/40">From orders database</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[12px] uppercase font-bold tracking-wider">Paid Orders</span>
            <ShoppingBag className="w-4 h-4 text-saffron" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">{stats.paidOrders}</p>
          <span className="text-[12px] text-teal-deep/40">Awaiting dispatch</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[12px] uppercase font-bold tracking-wider">Claimed Gifts</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">{stats.claimedGifts}</p>
          <span className="text-[12px] text-teal-deep/40">Addresses filled by recipient</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[12px] uppercase font-bold tracking-wider">B2B Inquiries</span>
            <MessageSquare className="w-4 h-4 text-teal-deep" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">{stats.totalInquiries}</p>
          <span className="text-[12px] text-teal-deep/40">Corporate submissions</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[12px] uppercase font-bold tracking-wider">Inventory Value</span>
            <Tag className="w-4 h-4 text-saffron" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">₹{stats.totalInventoryValue}</p>
          <span className="text-[12px] text-teal-deep/40">Total cost of offline stock</span>
        </div>

        <div className="bg-white border border-teal-deep/5 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-teal-deep/50 mb-3">
            <span className="text-[12px] uppercase font-bold tracking-wider">Total SKUs</span>
            <Package className="w-4 h-4 text-rani-pink" />
          </div>
          <p className="font-heading text-2xl font-black text-teal-deep">{stats.totalSKUs}</p>
          <span className="text-[12px] text-teal-deep/40">Offline product codes</span>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-teal-deep/5 p-2 rounded-2xl">
        <div className="flex space-x-1 flex-wrap gap-1">
          {["orders", "inquiries", "products", "categories", "stores", "blog", "packaging", "inventory", "campaigns", "billing", "customers", "leads", "portfolio", "catalog", "content"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as AdminTab);
                setSearchQuery("");
              }}
              className={`text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "bg-teal-deep text-white shadow-sm"
                  : "text-teal-deep/60 hover:text-teal-deep hover:bg-teal-deep/5"
              }`}
            >
              {tab === "packaging"
                ? "Packaging Styles"
                : tab === "stores"
                  ? "Stores"
                  : tab === "inventory"
                    ? "Offline Inventory"
                    : tab === "portfolio"
                      ? "Past Projects"
                      : tab === "catalog"
                        ? "Catalog Sections"
                        : tab === "content"
                          ? "Site Content"
                          : tab === "campaigns"
                            ? "Corporate Campaigns"
                            : tab}
            </button>
          ))}
        </div>

        {activeTab !== "packaging" && activeTab !== "categories" && activeTab !== "stores" && activeTab !== "blog" && activeTab !== "campaigns" && activeTab !== "billing" && activeTab !== "customers" && activeTab !== "leads" && (
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
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
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
                          <span className="text-[12px] text-teal-deep/45 flex items-center mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          {order.delivery_mode === "physical" ? (
                            <div>
                              <span className="font-semibold block">{order.customer_name}</span>
                              <span className="text-[12px] text-teal-deep/60">{order.customer_phone}</span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-semibold block text-rani-pink">{order.magical_link_details?.recipientName} (Recipient)</span>
                              <span className="text-[12px] text-teal-deep/60">{order.magical_link_details?.recipientContact}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase inline-block mb-1 ${
                            order.delivery_mode === "magical" ? "bg-rani-pink/10 text-rani-pink" : "bg-teal-deep/10 text-teal-deep"
                          }`}>
                            {order.delivery_mode}
                          </span>
                          <span className="block font-bold text-teal-deep">₹{order.subtotal}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 max-w-[220px]">
                            {order.items?.map((item: OrderItem, idx: number) => (
                              <div key={idx} className="space-y-0.5">
                                <span className="bg-teal-deep/5 px-2 py-0.5 rounded text-[12px] block w-fit">
                                  {item.name} x{item.quantity}
                                </span>
                                {item.giftMessage && (
                                  <span className="block text-[11px] italic text-rani-pink/80 pl-1">&quot;{item.giftMessage}&quot;</span>
                                )}
                                {item.personalization && Object.keys(item.personalization).length > 0 && (
                                  <span className="block text-[11px] text-saffron pl-1">
                                    {Object.entries(item.personalization).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[12px] font-extrabold uppercase ${
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
                              className="px-2.5 py-1.5 bg-teal-deep text-white rounded-lg hover:bg-teal-deep/90 font-bold text-[12px] transition-colors"
                            >
                              Ship Order
                            </button>
                          )}
                          {order.status === "claimed" && (
                            <button
                              onClick={() => updateOrderStatus(order.id, "shipped")}
                              className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold text-[12px] transition-colors"
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
                          <span className="text-[12px] text-teal-deep/45">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4 space-y-1">
                          <span className="font-semibold block">{inq.name}</span>
                          <span className="text-[12px] text-teal-deep/65 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {inq.email}
                          </span>
                          <span className="text-[12px] text-teal-deep/65 flex items-center">
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
                          <p className="text-xs text-teal-deep/75 max-w-sm italic line-clamp-2" title={inq.details ?? undefined}>
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
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-teal-deep/50">{products.length} products in the shop.</p>
                <button
                  onClick={() => setShowAddProduct(v => !v)}
                  className="px-4 py-2 bg-teal-deep text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-teal-deep/90 shadow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddProduct ? "Cancel" : "Add Product"}</span>
                </button>
              </div>

              <BulkImportPanel onImported={() => setRefreshTrigger(prev => prev + 1)} />

              {showAddProduct && (
                <form onSubmit={addProduct} className="bg-slate-50/50 p-6 rounded-2xl border border-teal-deep/5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-teal-deep/60">Product ID (unique, e.g. &quot;cur-11&quot;)</label>
                      <input type="text" required value={newProduct.id} onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                        className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-teal-deep/60">Name</label>
                      <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-teal-deep/60">Price (INR)</label>
                      <input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-teal-deep/60">Cost Price (internal, optional)</label>
                      <input type="number" min={0} placeholder="For invoices" value={newProduct.cost_price} onChange={(e) => setNewProduct({ ...newProduct, cost_price: e.target.value })}
                        className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-teal-deep/60">Badge (optional)</label>
                      <input type="text" placeholder="Best Seller" value={newProduct.badge} onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                        className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Stock Quantity (leave blank for unlimited/not tracked; 0 hides &quot;Add to Bag&quot; and shows Sold Out)</label>
                    <input type="number" min={0} placeholder="e.g. 12" value={newProduct.stock_quantity} onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Image URL</label>
                    <input type="text" placeholder="https://..." value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Description</label>
                    <textarea rows={2} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-teal-deep/60">Categories — tag into any number; it&apos;ll show on every one automatically</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => {
                        const checked = newProduct.categoryIds.includes(cat.id);
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setNewProduct({
                              ...newProduct,
                              categoryIds: checked ? newProduct.categoryIds.filter(id => id !== cat.id) : [...newProduct.categoryIds, cat.id],
                            })}
                            className={`text-[13px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                              checked ? "bg-teal-deep text-white border-teal-deep" : "bg-white text-teal-deep/70 border-teal-deep/15 hover:border-teal-deep/40"
                            }`}
                          >
                            {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-teal-deep/60">Stores — which shelves this product appears on</label>
                    <div className="flex flex-wrap gap-2">
                      {stores.map((store) => {
                        const checked = newProduct.storeIds.includes(store.id);
                        return (
                          <button
                            type="button"
                            key={store.id}
                            onClick={() => setNewProduct({
                              ...newProduct,
                              storeIds: checked ? newProduct.storeIds.filter(id => id !== store.id) : [...newProduct.storeIds, store.id],
                            })}
                            className={`text-[13px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                              checked ? "bg-rani-pink text-white border-rani-pink" : "bg-white text-teal-deep/70 border-teal-deep/15 hover:border-teal-deep/40"
                            }`}
                          >
                            {store.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[12px] font-bold text-teal-deep/60">Personalization fields — for Custom Gifts; asked at Add to Bag (engraving text, name, etc.)</label>
                      <button type="button" onClick={() => setNewProduct({
                        ...newProduct,
                        personalization_fields: [...newProduct.personalization_fields, { key: "", label: "", type: "text", required: false }],
                      })} className="text-[12px] font-bold text-teal-deep flex items-center space-x-1 flex-shrink-0">
                        <Plus className="w-3 h-3" /><span>Add Field</span>
                      </button>
                    </div>
                    {newProduct.personalization_fields.map((field, idx) => (
                      <div key={idx} className="bg-white border border-teal-deep/10 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                        <input value={field.label} onChange={(e) => {
                          const fields = [...newProduct.personalization_fields];
                          fields[idx] = { ...fields[idx], label: e.target.value, key: e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "") || `field_${idx}` };
                          setNewProduct({ ...newProduct, personalization_fields: fields });
                        }} placeholder="Field label, e.g. Engraving Text"
                          className="sm:col-span-6 bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                        <select value={field.type} onChange={(e) => {
                          const fields = [...newProduct.personalization_fields];
                          fields[idx] = { ...fields[idx], type: e.target.value as "text" | "dropdown" };
                          setNewProduct({ ...newProduct, personalization_fields: fields });
                        }} className="sm:col-span-3 bg-slate-50 border border-teal-deep/10 rounded-lg px-2 py-2 text-xs focus:outline-none">
                          <option value="text">Text</option>
                          <option value="dropdown">Dropdown</option>
                        </select>
                        <label className="sm:col-span-2 flex items-center space-x-1 text-[12px] text-teal-deep/60">
                          <input type="checkbox" checked={field.required} onChange={(e) => {
                            const fields = [...newProduct.personalization_fields];
                            fields[idx] = { ...fields[idx], required: e.target.checked };
                            setNewProduct({ ...newProduct, personalization_fields: fields });
                          }} />
                          <span>Required</span>
                        </label>
                        <button type="button" onClick={() => setNewProduct({
                          ...newProduct,
                          personalization_fields: newProduct.personalization_fields.filter((_, i) => i !== idx),
                        })} className="sm:col-span-1 text-teal-deep/30 hover:text-rani-pink justify-self-end">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {field.type === "dropdown" && (
                          <input
                            value={(field.options || []).join(", ")}
                            onChange={(e) => {
                              const fields = [...newProduct.personalization_fields];
                              fields[idx] = { ...fields[idx], options: e.target.value.split(",").map(s => s.trim()) };
                              setNewProduct({ ...newProduct, personalization_fields: fields });
                            }}
                            placeholder="Options, comma separated"
                            className="sm:col-span-12 bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="submit" disabled={isSavingProduct}
                    className="px-6 py-2.5 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-60">
                    {isSavingProduct ? "Saving..." : "Create Product"}
                  </button>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-background border-b border-teal-deep/5 uppercase font-bold text-teal-deep/60">
                    <tr>
                      <th className="p-4">Product ID / Name</th>
                      <th className="p-4">Categories</th>
                      <th className="p-4">Badge</th>
                      <th className="p-4 text-right">Price</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-deep/5">
                    {products.map((prod) => (
                      <React.Fragment key={prod.id}>
                        <tr className="hover:bg-teal-deep/5 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-teal-deep/5 border border-teal-deep/10 flex items-center justify-center flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={prod.image || ""}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80";
                                }}
                              />
                            </div>
                            <div>
                              <span className="font-semibold block">{prod.name}</span>
                              <span className="text-[12px] text-teal-deep/45 font-mono">{prod.id}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {prod.categoryIds.map(cid => {
                                const cat = categories.find(c => c.id === cid);
                                return cat ? (
                                  <span key={cid} className="text-[11px] font-bold bg-teal-deep/5 text-teal-deep/70 px-2 py-0.5 rounded-full">{cat.name}</span>
                                ) : null;
                              })}
                            </div>
                          </td>
                          <td className="p-4">
                            {prod.badge ? (
                              <span className="bg-saffron/10 border border-saffron/20 text-saffron font-bold px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide">
                                {prod.badge}
                              </span>
                            ) : (
                              <span className="text-teal-deep/30">-</span>
                            )}
                          </td>
                          <td className="p-4 text-right font-bold text-teal-deep text-sm">₹{prod.price}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setEditingProductId(editingProductId === prod.id ? null : prod.id);
                                  setEditingProduct({ ...prod });
                                }}
                                className="p-1.5 rounded-lg hover:bg-teal-deep/10 text-teal-deep/60 hover:text-teal-deep transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(prod.id, prod.name)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-teal-deep/60 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {editingProductId === prod.id && editingProduct && (
                          <tr>
                            <td colSpan={5} className="p-4 bg-slate-50/50">
                              <form onSubmit={updateProduct} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[12px] font-bold text-teal-deep/60">Name</label>
                                    <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[12px] font-bold text-teal-deep/60">Price</label>
                                    <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[12px] font-bold text-teal-deep/60">Cost Price</label>
                                    <input type="number" min={0} value={editingProduct.cost_price ?? ""} onChange={(e) => setEditingProduct({ ...editingProduct, cost_price: e.target.value === "" ? null : Number(e.target.value) })}
                                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[12px] font-bold text-teal-deep/60">Badge</label>
                                    <input type="text" value={editingProduct.badge || ""} onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[12px] font-bold text-teal-deep/60">Stock (blank = unlimited)</label>
                                    <input type="number" min={0} value={editingProduct.stock_quantity ?? ""} onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: e.target.value === "" ? null : Number(e.target.value) })}
                                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[12px] font-bold text-teal-deep/60">Image URL</label>
                                  <input type="text" value={editingProduct.image || ""} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                    className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[12px] font-bold text-teal-deep/60">Description</label>
                                  <textarea rows={2} value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[12px] font-bold text-teal-deep/60">Categories</label>
                                  <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => {
                                      const checked = editingProduct.categoryIds.includes(cat.id);
                                      return (
                                        <button
                                          type="button"
                                          key={cat.id}
                                          onClick={() => setEditingProduct({
                                            ...editingProduct,
                                            categoryIds: checked ? editingProduct.categoryIds.filter(id => id !== cat.id) : [...editingProduct.categoryIds, cat.id],
                                          })}
                                          className={`text-[13px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                                            checked ? "bg-teal-deep text-white border-teal-deep" : "bg-white text-teal-deep/70 border-teal-deep/15 hover:border-teal-deep/40"
                                          }`}
                                        >
                                          {cat.name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[12px] font-bold text-teal-deep/60">Stores</label>
                                  <div className="flex flex-wrap gap-2">
                                    {stores.map((store) => {
                                      const checked = editingProduct.storeIds.includes(store.id);
                                      return (
                                        <button
                                          type="button"
                                          key={store.id}
                                          onClick={() => setEditingProduct({
                                            ...editingProduct,
                                            storeIds: checked ? editingProduct.storeIds.filter(id => id !== store.id) : [...editingProduct.storeIds, store.id],
                                          })}
                                          className={`text-[13px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                                            checked ? "bg-rani-pink text-white border-rani-pink" : "bg-white text-teal-deep/70 border-teal-deep/15 hover:border-teal-deep/40"
                                          }`}
                                        >
                                          {store.name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[12px] font-bold text-teal-deep/60">Personalization fields</label>
                                    <button type="button" onClick={() => setEditingProduct({
                                      ...editingProduct,
                                      personalization_fields: [...editingProduct.personalization_fields, { key: "", label: "", type: "text", required: false }],
                                    })} className="text-[12px] font-bold text-teal-deep flex items-center space-x-1 flex-shrink-0">
                                      <Plus className="w-3 h-3" /><span>Add Field</span>
                                    </button>
                                  </div>
                                  {editingProduct.personalization_fields.map((field, idx) => (
                                    <div key={idx} className="bg-white border border-teal-deep/10 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                      <input value={field.label} onChange={(e) => {
                                        const fields = [...editingProduct.personalization_fields];
                                        fields[idx] = { ...fields[idx], label: e.target.value, key: e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "") || `field_${idx}` };
                                        setEditingProduct({ ...editingProduct, personalization_fields: fields });
                                      }} placeholder="Field label"
                                        className="sm:col-span-6 bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                                      <select value={field.type} onChange={(e) => {
                                        const fields = [...editingProduct.personalization_fields];
                                        fields[idx] = { ...fields[idx], type: e.target.value as "text" | "dropdown" };
                                        setEditingProduct({ ...editingProduct, personalization_fields: fields });
                                      }} className="sm:col-span-3 bg-slate-50 border border-teal-deep/10 rounded-lg px-2 py-2 text-xs focus:outline-none">
                                        <option value="text">Text</option>
                                        <option value="dropdown">Dropdown</option>
                                      </select>
                                      <label className="sm:col-span-2 flex items-center space-x-1 text-[12px] text-teal-deep/60">
                                        <input type="checkbox" checked={field.required} onChange={(e) => {
                                          const fields = [...editingProduct.personalization_fields];
                                          fields[idx] = { ...fields[idx], required: e.target.checked };
                                          setEditingProduct({ ...editingProduct, personalization_fields: fields });
                                        }} />
                                        <span>Required</span>
                                      </label>
                                      <button type="button" onClick={() => setEditingProduct({
                                        ...editingProduct,
                                        personalization_fields: editingProduct.personalization_fields.filter((_, i) => i !== idx),
                                      })} className="sm:col-span-1 text-teal-deep/30 hover:text-rani-pink justify-self-end">
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                      {field.type === "dropdown" && (
                                        <input
                                          value={(field.options || []).join(", ")}
                                          onChange={(e) => {
                                            const fields = [...editingProduct.personalization_fields];
                                            fields[idx] = { ...fields[idx], options: e.target.value.split(",").map(s => s.trim()) };
                                            setEditingProduct({ ...editingProduct, personalization_fields: fields });
                                          }}
                                          placeholder="Options, comma separated"
                                          className="sm:col-span-12 bg-slate-50 border border-teal-deep/10 rounded-lg px-3 py-2 text-xs focus:outline-none"
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex space-x-2">
                                  <button type="submit" disabled={isSavingProduct}
                                    className="px-5 py-2 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-60">
                                    {isSavingProduct ? "Saving..." : "Save Changes"}
                                  </button>
                                  <button type="button" onClick={() => { setEditingProductId(null); setEditingProduct(null); }}
                                    className="px-5 py-2 border border-teal-deep/15 text-teal-deep rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-teal-deep/5 transition-all">
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "stores" && <StoresTab />}

          {activeTab === "categories" && (
            <div className="p-6 space-y-6">
              <form onSubmit={addCategory} className="bg-slate-50/50 p-6 rounded-2xl border border-teal-deep/5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[12px] font-bold text-teal-deep/60">New Category Name</label>
                  <input type="text" required placeholder="e.g. Housewarming" value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[12px] font-bold text-teal-deep/60">Description (optional)</label>
                  <input type="text" value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                </div>
                <button type="submit" disabled={isSavingCategory}
                  className="px-4 py-2 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-60 flex items-center justify-center space-x-1.5">
                  <Plus className="w-4 h-4" />
                  <span>{isSavingCategory ? "Adding..." : "Add"}</span>
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const count = products.filter(p => p.categoryIds.includes(cat.id)).length;
                  const isEditing = editingCategoryId === cat.id;
                  return (
                    <div key={cat.id} className="bg-white border border-teal-deep/10 rounded-2xl p-5 space-y-3">
                      {isEditing && editingCategory ? (
                        <form onSubmit={updateCategory} className="space-y-3">
                          <input type="text" value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                          <input type="text" placeholder="Description" value={editingCategory.description || ""} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                          <div className="flex space-x-2">
                            <button type="submit" disabled={isSavingCategory} className="px-3 py-1.5 bg-teal-deep text-white rounded-lg font-bold text-[12px] uppercase disabled:opacity-60">Save</button>
                            <button type="button" onClick={() => { setEditingCategoryId(null); setEditingCategory(null); }} className="px-3 py-1.5 border border-teal-deep/15 text-teal-deep rounded-lg font-bold text-[12px] uppercase">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-heading text-sm font-bold text-teal-deep">{cat.name}</h4>
                              <span className="text-[12px] text-teal-deep/50">/{cat.slug} · {count} product{count === 1 ? "" : "s"}</span>
                            </div>
                            {!cat.is_active && (
                              <span className="text-[11px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full uppercase">Hidden</span>
                            )}
                          </div>
                          {cat.description && <p className="text-xs text-teal-deep/60">{cat.description}</p>}
                          <div className="flex items-center space-x-2 pt-1">
                            <button onClick={() => { setEditingCategoryId(cat.id); setEditingCategory(cat); }}
                              className="p-1.5 rounded-lg hover:bg-teal-deep/10 text-teal-deep/60 hover:text-teal-deep transition-colors">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => toggleCategoryActive(cat.id, cat.is_active)}
                              className="p-1.5 rounded-lg hover:bg-teal-deep/10 text-teal-deep/60 hover:text-teal-deep transition-colors">
                              {cat.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => deleteCategory(cat.id, cat.name)}
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
          )}

          {activeTab === "blog" && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-teal-deep/50">{blogPosts.length} posts.</p>
                <button
                  onClick={() => setShowAddBlog(v => !v)}
                  className="px-4 py-2 bg-teal-deep text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-teal-deep/90 shadow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddBlog ? "Cancel" : "Add Post"}</span>
                </button>
              </div>

              {showAddBlog && (
                <form onSubmit={addBlogPost} className="bg-slate-50/50 p-6 rounded-2xl border border-teal-deep/5 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Title</label>
                    <input type="text" required value={newBlogPost.title} onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Excerpt</label>
                    <input type="text" value={newBlogPost.excerpt} onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-teal-deep/60">Content — use # / ## for headings, * or - for bullets, **bold**, {'>'} for a quote block, one blank line between paragraphs</label>
                    <textarea rows={8} required value={newBlogPost.content} onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                      className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none resize-y font-mono" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-teal-deep/60">Category</label>
                      <input type="text" placeholder="Diwali" value={newBlogPost.category} onChange={(e) => setNewBlogPost({ ...newBlogPost, category: e.target.value })}
                        className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-teal-deep/60">Image URL</label>
                      <input type="text" value={newBlogPost.image} onChange={(e) => setNewBlogPost({ ...newBlogPost, image: e.target.value })}
                        className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-teal-deep/60">Tags (comma separated)</label>
                      <input type="text" placeholder="gifting, diwali" value={newBlogPost.tags} onChange={(e) => setNewBlogPost({ ...newBlogPost, tags: e.target.value })}
                        className="w-full bg-white border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                    </div>
                  </div>
                  <label className="flex items-center space-x-2 text-xs text-teal-deep/70">
                    <input type="checkbox" checked={newBlogPost.is_published} onChange={(e) => setNewBlogPost({ ...newBlogPost, is_published: e.target.checked })} />
                    <span>Publish immediately</span>
                  </label>
                  <button type="submit" disabled={isSavingBlog}
                    className="px-6 py-2.5 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-60">
                    {isSavingBlog ? "Saving..." : "Create Post"}
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {blogPosts.map((post) => {
                  const isEditing = editingBlogId === post.id;
                  return (
                    <div key={post.id} className="bg-white border border-teal-deep/10 rounded-2xl p-5">
                      {isEditing && editingBlogPost ? (
                        <form onSubmit={updateBlogPost} className="space-y-4">
                          <input type="text" value={editingBlogPost.title} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                          <input type="text" placeholder="Excerpt" value={editingBlogPost.excerpt || ""} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, excerpt: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                          <textarea rows={8} value={editingBlogPost.content} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none font-mono resize-y" />
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <input type="text" placeholder="Category" value={editingBlogPost.category || ""} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, category: e.target.value })}
                              className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                            <input type="text" placeholder="Image URL" value={editingBlogPost.image || ""} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, image: e.target.value })}
                              className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                            <input type="text" placeholder="Tags, comma separated" value={editingBlogPost.tagsInput ?? editingBlogPost.tags.join(", ")}
                              onChange={(e) => setEditingBlogPost({ ...editingBlogPost, tagsInput: e.target.value })}
                              className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none" />
                          </div>
                          <label className="flex items-center space-x-2 text-xs text-teal-deep/70">
                            <input type="checkbox" checked={editingBlogPost.is_published} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, is_published: e.target.checked })} />
                            <span>Published</span>
                          </label>
                          <div className="flex space-x-2">
                            <button type="submit" disabled={isSavingBlog} className="px-5 py-2 bg-teal-deep text-white rounded-xl font-bold text-xs uppercase disabled:opacity-60">
                              {isSavingBlog ? "Saving..." : "Save Changes"}
                            </button>
                            <button type="button" onClick={() => { setEditingBlogId(null); setEditingBlogPost(null); }} className="px-5 py-2 border border-teal-deep/15 text-teal-deep rounded-xl font-bold text-xs uppercase">
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-heading text-sm font-bold text-teal-deep">{post.title}</h4>
                              {!post.is_published && <span className="text-[11px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full uppercase">Draft</span>}
                            </div>
                            <p className="text-[12px] text-teal-deep/50">/{post.slug} · {post.category || "Uncategorized"} · {post.read_time}</p>
                            {post.excerpt && <p className="text-xs text-teal-deep/60 line-clamp-2">{post.excerpt}</p>}
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button onClick={() => { setEditingBlogId(post.id); setEditingBlogPost({ ...post }); }}
                              className="p-1.5 rounded-lg hover:bg-teal-deep/10 text-teal-deep/60 hover:text-teal-deep transition-colors">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteBlogPost(post.id, post.title)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-teal-deep/60 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: PACKAGING STYLES */}
          {activeTab === "packaging" && (
            <div className="p-6 space-y-10">
              {/* Box Styles configuration. Build-a-Box treats used to live here
                  too (as bazaar_items) but are now ordinary Products rows
                  tagged into the "Build Your Own Box" store — manage them from
                  the Products tab (filter by that store) instead. */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-teal-deep/5 pb-4">
                  <h3 className="font-heading text-lg font-bold text-teal-deep">Rigid Packaging Styles</h3>
                  <span className="text-[12px] text-teal-deep/50">Manage the rigid boxes offered in Hamper customizer.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Form to add box */}
                  <form onSubmit={addBoxStyle} className="md:col-span-4 bg-teal-deep/5 p-6 rounded-2xl border border-teal-deep/5 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-teal-deep flex items-center space-x-1">
                      <Plus className="w-4 h-4 text-rani-pink" />
                      <span>Add Box Style</span>
                    </h4>

                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-teal-deep/60">Box Name</label>
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
                      <label className="text-[12px] font-bold text-teal-deep/60">Tailwind Color Gradient Style</label>
                      <input
                        type="text"
                        required
                        placeholder="from-blue-900/20 to-blue-500/20 border-blue-500/20"
                        value={newBox.color}
                        onChange={(e) => setNewBox({ ...newBox, color: e.target.value })}
                        className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none font-mono"
                      />
                      <span className="text-[11px] text-teal-deep/50 block">Tailwind gradient class settings.</span>
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
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-bold text-[12px] transition-colors ${
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
                  <p className="text-[12px] text-teal-deep/50">Manage local stock parameters, margins, vendor listings, and publish directly to the website.</p>
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
                        <label className="text-[12px] font-bold text-teal-deep/60">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={editingInventory.name}
                          onChange={(e) => setEditingInventory({ ...editingInventory, name: e.target.value })}
                          className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[12px] font-bold text-teal-deep/60">Vendor Name *</label>
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
                          <label className="text-[12px] font-bold text-teal-deep/60">Purchase Cost *</label>
                          <input
                            type="number"
                            required
                            value={editingInventory.purchase_price}
                            onChange={(e) => setEditingInventory({ ...editingInventory, purchase_price: Number(e.target.value) })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-teal-deep/60">Retail Price *</label>
                          <input
                            type="number"
                            required
                            value={editingInventory.selling_price}
                            onChange={(e) => setEditingInventory({ ...editingInventory, selling_price: Number(e.target.value) })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-teal-deep/60">Stock Count *</label>
                          <input
                            type="number"
                            required
                            value={editingInventory.stock_quantity}
                            onChange={(e) => setEditingInventory({ ...editingInventory, stock_quantity: Number(e.target.value) })}
                            className="w-full bg-background border border-teal-deep/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-teal-deep/60">Markup Margin</label>
                          <div className="w-full bg-teal-deep/5 border border-teal-deep/10 text-teal-deep font-bold rounded-lg px-3 py-2 text-xs">
                            {editingInventory.selling_price && editingInventory.purchase_price
                              ? `${(((Number(editingInventory.selling_price) - Number(editingInventory.purchase_price)) / Number(editingInventory.purchase_price)) * 100).toFixed(0)}%`
                              : "0%"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[12px] font-bold text-teal-deep/60">Drive Photos Link</label>
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
                        <label className="text-[12px] font-bold text-teal-deep/60">Product Code / SKU *</label>
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
                        <label className="text-[12px] font-bold text-teal-deep/60">Product Name *</label>
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
                        <label className="text-[12px] font-bold text-teal-deep/60">Vendor Name *</label>
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
                          <label className="text-[12px] font-bold text-teal-deep/60">Purchase Cost *</label>
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
                          <label className="text-[12px] font-bold text-teal-deep/60">Retail Price *</label>
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
                          <label className="text-[12px] font-bold text-teal-deep/60">Stock Qty *</label>
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
                          <label className="text-[12px] font-bold text-teal-deep/60">Expected Margin</label>
                          <div className="w-full bg-teal-deep/5 border border-teal-deep/10 text-teal-deep font-bold rounded-lg px-3 py-2 text-xs">
                            {newInventory.selling_price && newInventory.purchase_price
                              ? `${(((Number(newInventory.selling_price) - Number(newInventory.purchase_price)) / Number(newInventory.purchase_price)) * 100).toFixed(0)}%`
                              : "0%"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[12px] font-bold text-teal-deep/60">Google Drive Photos Link</label>
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
                              <span className="text-[12px] text-teal-deep/45 font-mono uppercase">{item.product_code}</span>
                            </td>
                            <td className="p-3 text-teal-deep/75 font-medium">{item.vendor_name}</td>
                            <td className="p-3 text-right text-teal-deep/60">₹{item.purchase_price}</td>
                            <td className="p-3 text-right font-bold text-teal-deep">₹{item.selling_price}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[12px] ${
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
                                <span className="text-[12px] text-teal-deep/30">-</span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {item.is_synced ? (
                                <span className="inline-flex items-center space-x-0.5 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[11px] uppercase">
                                  <Globe className="w-2.5 h-2.5" />
                                  <span>{item.synced_type === "curated" ? "Curated" : "Bazaar"}</span>
                                </span>
                              ) : (
                                <span className="inline-block bg-teal-deep/5 text-teal-deep/50 px-2 py-0.5 rounded-full text-[11px]">
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

          {/* TAB 6: PAST PROJECTS EDITOR */}
          {activeTab === "campaigns" && (
            <div className="p-6">
              <CampaignsTab />
            </div>
          )}

          {activeTab === "billing" && (
            <div className="p-6">
              <BillingTab />
            </div>
          )}

          {activeTab === "customers" && (
            <div className="p-6">
              <CustomersTab />
            </div>
          )}

          {activeTab === "leads" && (
            <div className="p-6">
              <LeadsTab />
            </div>
          )}

          {activeTab === "portfolio" && portfolioConfig && (
            <div className="p-6 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-teal-deep/5 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-teal-deep">Past Gifting Projects Portfolio</h3>
                  <p className="text-[12px] text-teal-deep/50">Edit the B2B case studies, upload client product photos, and reorder card placements.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newProject = {
                      folder: `project_${Date.now()}`,
                      company: "New Partner",
                      title: "Campaign Showcase",
                      badge: "Custom",
                      context: "Client context or volume details.",
                      outcome: "100% on-time dispatch and premium satisfaction.",
                      images: []
                    };
                    const updated = { ...portfolioConfig, projects: [newProject, ...portfolioConfig.projects] };
                    setPortfolioConfig(updated);
                    saveConfig("past-work", updated);
                  }}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-teal-deep text-[#FAF4E8] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-teal-deep/90 shadow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gifting Campaign</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-10">
                {portfolioConfig.projects.map((project, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-teal-deep/5 rounded-3xl p-6 md:p-8 space-y-6 relative group">
                    {/* Controls Row */}
                    <div className="absolute top-6 right-6 flex items-center space-x-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const list = [...portfolioConfig.projects];
                          [list[idx], list[idx - 1]] = [list[idx - 1], list[idx]];
                          const updated = { ...portfolioConfig, projects: list };
                          setPortfolioConfig(updated);
                          saveConfig("past-work", updated);
                        }}
                        className="p-1.5 bg-white border border-teal-deep/5 rounded-lg text-teal-deep hover:bg-teal-deep/5 disabled:opacity-30 disabled:hover:bg-white"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === portfolioConfig.projects.length - 1}
                        onClick={() => {
                          const list = [...portfolioConfig.projects];
                          [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
                          const updated = { ...portfolioConfig, projects: list };
                          setPortfolioConfig(updated);
                          saveConfig("past-work", updated);
                        }}
                        className="p-1.5 bg-white border border-teal-deep/5 rounded-lg text-teal-deep hover:bg-teal-deep/5 disabled:opacity-30 disabled:hover:bg-white"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${project.company}?`)) {
                            const list = portfolioConfig.projects.filter((_: any, i: number) => i !== idx);
                            const updated = { ...portfolioConfig, projects: list };
                            setPortfolioConfig(updated);
                            saveConfig("past-work", updated);
                          }
                        }}
                        className="p-1.5 bg-red-50 border border-red-100 rounded-lg text-red-650 hover:bg-red-100"
                        title="Delete Gifting Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Text parameters */}
                      <div className="space-y-4 text-left">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold text-teal-deep/60 uppercase">Client Name</label>
                            <input
                              type="text"
                              value={project.company}
                              onChange={(e) => {
                                const list = [...portfolioConfig.projects];
                                list[idx].company = e.target.value;
                                setPortfolioConfig({ ...portfolioConfig, projects: list });
                              }}
                              className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs text-teal-deep focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[12px] font-bold text-teal-deep/60 uppercase">Category Badge</label>
                            <input
                              type="text"
                              value={project.badge}
                              onChange={(e) => {
                                const list = [...portfolioConfig.projects];
                                list[idx].badge = e.target.value;
                                setPortfolioConfig({ ...portfolioConfig, projects: list });
                              }}
                              className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs text-teal-deep focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-teal-deep/60 uppercase">Showcase Title</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => {
                              const list = [...portfolioConfig.projects];
                              list[idx].title = e.target.value;
                              setPortfolioConfig({ ...portfolioConfig, projects: list });
                            }}
                            className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs text-teal-deep focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-teal-deep/60 uppercase">Context Description</label>
                          <textarea
                            rows={2}
                            value={project.context}
                            onChange={(e) => {
                              const list = [...portfolioConfig.projects];
                              list[idx].context = e.target.value;
                              setPortfolioConfig({ ...portfolioConfig, projects: list });
                            }}
                            className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs text-teal-deep focus:outline-none resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-teal-deep/60 uppercase">Project Outcome</label>
                          <input
                            type="text"
                            value={project.outcome}
                            onChange={(e) => {
                              const list = [...portfolioConfig.projects];
                              list[idx].outcome = e.target.value;
                              setPortfolioConfig({ ...portfolioConfig, projects: list });
                            }}
                            className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs text-teal-deep focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => saveConfig("past-work", portfolioConfig)}
                          className="px-4 py-2 bg-saffron hover:bg-saffron/90 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                        >
                          Save Text Details
                        </button>
                      </div>

                      {/* Right: Images List & Uploader */}
                      <div className="space-y-4 text-left">
                        <div className="flex items-center justify-between">
                          <label className="text-[12px] font-bold text-teal-deep/60 uppercase">Gallery Photos</label>
                          
                          {/* File Upload Button */}
                          <label className="cursor-pointer px-3 py-1.5 bg-teal-deep/5 hover:bg-teal-deep/10 border border-teal-deep/10 text-teal-deep rounded-lg font-bold text-[12px] uppercase tracking-wider flex items-center space-x-1 transition-all">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "past-work", project.folder, idx)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {project.images.length === 0 ? (
                          <div className="border border-dashed border-teal-deep/15 rounded-2xl p-6 text-center text-teal-deep/40 text-xs">
                            No photos uploaded yet for this project.
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-teal-deep/5 p-3 rounded-2xl bg-white">
                            {project.images.map((imgUrl: string, imgIdx: number) => (
                              <div key={imgIdx} className="relative aspect-square rounded-xl overflow-hidden group/img bg-slate-100 border border-teal-deep/5 shadow-[inset_0_0_8px_rgba(0,0,0,0.02)]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={imgUrl}
                                  alt="Thumbnail"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm("Remove this image?")) {
                                      const updatedImages = project.images.filter((_: any, i: number) => i !== imgIdx);
                                      const list = [...portfolioConfig.projects];
                                      list[idx].images = updatedImages;
                                      const newConfig = { ...portfolioConfig, projects: list };
                                      setPortfolioConfig(newConfig);
                                      await saveConfig("past-work", newConfig);
                                    }
                                  }}
                                  className="absolute top-1 right-1 p-1 bg-red-650 hover:bg-red-700 text-white rounded-full shadow opacity-0 group-hover/img:opacity-100 transition-opacity"
                                  title="Delete Photo"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CATALOG SECTIONS EDITOR */}
          {activeTab === "catalog" && catalogConfig && (
            <div className="p-6 space-y-8 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-teal-deep/5 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-teal-deep">Diwali Catalog Sections Index</h3>
                  <p className="text-[12px] text-teal-deep/50">Edit page counts, section page ranges, and visual description tags.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newSection = {
                      title: "New Category",
                      startPage: catalogConfig.totalPages,
                      endPage: catalogConfig.totalPages,
                      description: "Enter category details."
                    };
                    const updated = { ...catalogConfig, sections: [...catalogConfig.sections, newSection] };
                    setCatalogConfig(updated);
                    saveConfig("catalog", updated);
                  }}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-teal-deep text-[#FAF4E8] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-teal-deep/90 shadow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Catalog Section</span>
                </button>
              </div>

              {/* Total Pages Config */}
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-teal-deep/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl">
                <div className="space-y-1">
                  <h4 className="font-heading text-sm font-bold text-teal-deep">Total Catalog Pages</h4>
                  <p className="text-[12px] text-teal-deep/50">Adjusting this updates the number of page PNGs rendered in the catalog scroll view.</p>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <input
                    type="number"
                    value={catalogConfig.totalPages}
                    onChange={(e) => {
                      const updated = { ...catalogConfig, totalPages: parseInt(e.target.value) || 1 };
                      setCatalogConfig(updated);
                    }}
                    className="w-24 bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-center text-xs font-bold text-teal-deep focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => saveConfig("catalog", catalogConfig)}
                    className="px-4 py-2 bg-saffron hover:bg-saffron/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    Save Pages count
                  </button>
                </div>
              </div>

              {/* Sections Table List */}
              <div className="border border-teal-deep/5 rounded-3xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-background border-b border-teal-deep/5 uppercase font-bold text-teal-deep/60">
                    <tr>
                      <th className="p-4 w-12">No.</th>
                      <th className="p-4">Section Title</th>
                      <th className="p-4 w-28">Start Page</th>
                      <th className="p-4 w-28">End Page</th>
                      <th className="p-4">Short Description</th>
                      <th className="p-4 w-32 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catalogConfig.sections.map((section, idx) => (
                      <tr key={idx} className="border-b border-teal-deep/5 hover:bg-teal-deep/[0.01] transition-colors">
                        <td className="p-4 font-mono font-bold text-teal-deep/50">{idx + 1}</td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                              const list = [...catalogConfig.sections];
                              list[idx].title = e.target.value;
                              setCatalogConfig({ ...catalogConfig, sections: list });
                            }}
                            className="bg-slate-50 border border-teal-deep/5 rounded-lg px-2.5 py-1.5 w-full text-xs font-bold text-teal-deep focus:outline-none focus:border-teal-deep/20"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="number"
                            value={section.startPage}
                            onChange={(e) => {
                              const list = [...catalogConfig.sections];
                              list[idx].startPage = parseInt(e.target.value) || 1;
                              setCatalogConfig({ ...catalogConfig, sections: list });
                            }}
                            className="bg-slate-50 border border-teal-deep/5 rounded-lg px-2.5 py-1.5 w-full text-center text-xs font-bold text-teal-deep focus:outline-none focus:border-teal-deep/20"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="number"
                            value={section.endPage}
                            onChange={(e) => {
                              const list = [...catalogConfig.sections];
                              list[idx].endPage = parseInt(e.target.value) || 1;
                              setCatalogConfig({ ...catalogConfig, sections: list });
                            }}
                            className="bg-slate-50 border border-teal-deep/5 rounded-lg px-2.5 py-1.5 w-full text-center text-xs font-bold text-teal-deep focus:outline-none focus:border-teal-deep/20"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={section.description}
                            onChange={(e) => {
                              const list = [...catalogConfig.sections];
                              list[idx].description = e.target.value;
                              setCatalogConfig({ ...catalogConfig, sections: list });
                            }}
                            className="bg-slate-50 border border-teal-deep/5 rounded-lg px-2.5 py-1.5 w-full text-xs text-teal-deep focus:outline-none focus:border-teal-deep/20"
                          />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const list = [...catalogConfig.sections];
                                [list[idx], list[idx - 1]] = [list[idx - 1], list[idx]];
                                const updated = { ...catalogConfig, sections: list };
                                setCatalogConfig(updated);
                                saveConfig("catalog", updated);
                              }}
                              className="p-1 bg-white border border-teal-deep/5 rounded hover:bg-teal-deep/5 text-teal-deep disabled:opacity-30"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === catalogConfig.sections.length - 1}
                              onClick={() => {
                                const list = [...catalogConfig.sections];
                                [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
                                const updated = { ...catalogConfig, sections: list };
                                setCatalogConfig(updated);
                                saveConfig("catalog", updated);
                              }}
                              className="p-1 bg-white border border-teal-deep/5 rounded hover:bg-teal-deep/5 text-teal-deep disabled:opacity-30"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete section "${section.title}"?`)) {
                                  const list = catalogConfig.sections.filter((_: any, i: number) => i !== idx);
                                  const updated = { ...catalogConfig, sections: list };
                                  setCatalogConfig(updated);
                                  saveConfig("catalog", updated);
                                }
                              }}
                              className="p-1 bg-red-50 hover:bg-red-100 text-red-650 rounded border border-red-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => saveConfig("catalog", catalogConfig)}
                  className="px-6 py-3 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  Save Section Indexes Config
                </button>
              </div>
            </div>
          )}

          {activeTab === "content" && siteContentConfig && (
            <div className="p-6 space-y-6 text-left">
              <div className="border-b border-teal-deep/5 pb-4">
                <h3 className="font-heading text-lg font-bold text-teal-deep">Site Text & Images</h3>
                <p className="text-[12px] text-teal-deep/50">
                  Edit copy and swap images used across the homepage, About page, and sitewide contact info.
                  Changes save to the site&apos;s content file — in local dev they show up immediately; once
                  deployed, they take effect on the next deploy (this writes to disk, not a live database).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {siteContentConfig.fields.map((field) => (
                  <div key={field.key} className="bg-slate-50/50 p-5 rounded-2xl border border-teal-deep/5 space-y-2">
                    <label className="text-[12px] font-bold text-teal-deep/60 uppercase tracking-wider block">
                      {field.label}
                    </label>

                    {field.type === "text" && (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateContentField(field.key, e.target.value)}
                        className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-deep/40"
                      />
                    )}

                    {field.type === "textarea" && (
                      <textarea
                        rows={3}
                        value={field.value}
                        onChange={(e) => updateContentField(field.key, e.target.value)}
                        className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-deep/40 resize-none"
                      />
                    )}

                    {field.type === "image" && (
                      <div className="space-y-2">
                        {field.value && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={field.value}
                            alt={field.label}
                            className="w-full h-32 object-cover rounded-xl border border-teal-deep/10"
                          />
                        )}
                        <label className="flex items-center justify-center space-x-1.5 text-[12px] font-bold px-3 py-2 border border-teal-deep/15 rounded-lg text-teal-deep hover:bg-teal-deep/5 cursor-pointer transition-all">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isUploading ? "Uploading..." : "Replace Image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => handleContentImageUpload(e, field.key)}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={isSavingConfig}
                  onClick={() => saveConfig("site-content", siteContentConfig)}
                  className="px-6 py-3 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-60"
                >
                  {isSavingConfig ? "Saving..." : "Save Text Changes"}
                </button>
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
                <span className="text-[12px] font-bold text-saffron uppercase tracking-widest">Publish to Website</span>
                <h3 className="font-heading text-xl font-bold text-teal-deep">List &quot;{syncingItem.name}&quot;</h3>
                <p className="text-[12px] text-teal-deep/50 font-mono uppercase">SKU: {syncingItem.product_code}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-teal-deep/50 uppercase">Category Tag</label>
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

                {/* Mode A: Pre-Curated Collections store */}
                <div className="p-4 bg-teal-deep/5 border border-teal-deep/10 rounded-2xl space-y-3">
                  <h4 className="font-bold text-xs text-teal-deep flex items-center space-x-1.5">
                    <ShoppingBag className="w-4 h-4 text-rani-pink" />
                    <span>Option 1: Sync to Pre-Curated Collections</span>
                  </h4>
                  <p className="text-[12px] text-teal-deep/70">Lists this item at `/collections`, tagged with the category above.</p>
                  <button
                    type="button"
                    onClick={() => executeWebsiteSync("curated")}
                    className="w-full py-2 bg-teal-deep hover:bg-teal-deep/90 text-[#FAF4E8] rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm"
                  >
                    Publish Curated Listing (₹{syncingItem.selling_price})
                  </button>
                </div>

                {/* Mode B: Build Your Own Box store */}
                <div className="p-4 bg-saffron/5 border border-saffron/10 rounded-2xl space-y-3">
                  <h4 className="font-bold text-xs text-teal-deep flex items-center space-x-1.5">
                    <Tag className="w-4 h-4 text-saffron" />
                    <span>Option 2: Sync as Build Your Own Box Treat</span>
                  </h4>
                  <p className="text-[12px] text-teal-deep/70">Registers this as a treat selectable inside the Build-a-Box studio.</p>
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
