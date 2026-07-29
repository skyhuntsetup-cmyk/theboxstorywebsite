// Row shapes for Supabase tables, matching supabase-schema.sql.

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isCustomBox?: boolean;
  boxItems?: { id: string; name: string; price: number; image: string }[];
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface MagicalLinkDetails {
  recipientSelects?: boolean;
  recipientName?: string;
  recipientContact?: string;
  giftNote?: string;
  budgetTier?: number;
  corporateToken?: boolean;
  companyName?: string;
  passcodeUsed?: string;
  [key: string]: unknown;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "claimed";
export type DeliveryMode = "physical" | "magical";

export interface Order {
  id: string;
  created_at: string;
  delivery_mode: DeliveryMode;
  subtotal: number;
  status: OrderStatus;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  shipping_address: ShippingAddress | null;
  magical_link_details: MagicalLinkDetails | null;
  items: OrderItem[];
}

export interface Inquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  quantity: string;
  budget: string;
  details: string | null;
}

export interface BazaarItemRow {
  id: string;
  created_at: string;
  name: string;
  price: number;
  image: string;
  category: "Sweets" | "Decor" | "Wellness" | "Gourmet";
  is_active: boolean;
}

export interface BoxStyleRow {
  id: string;
  created_at: string;
  name: string;
  color: string;
  is_active: boolean;
}

export interface OfflineInventoryItem {
  product_code: string;
  created_at: string;
  name: string;
  vendor_name: string;
  purchase_price: number;
  selling_price: number;
  photo_drive_link: string | null;
  stock_quantity: number;
  is_synced: boolean;
  synced_type: "curated" | "bazaar" | null;
}
