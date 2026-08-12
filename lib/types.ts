// Row shapes for Supabase tables, matching supabase-schema.sql.

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isCustomBox?: boolean;
  boxItems?: { id: string; name: string; price: number; image: string }[];
  giftMessage?: string;
  personalization?: Record<string, string>;
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

export interface CategoryRow {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ProductRow {
  id: string;
  created_at: string;
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  category: string;
  badge: string | null;
  stock_quantity: number | null;
  personalization_fields: CustomFieldDef[];
  cost_price: number | null;
}

export interface StoreRow {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  hero_image: string | null;
  display_order: number;
  is_active: boolean;
}

/** A product joined with the categories and stores it's tagged into. */
export interface ProductWithCategories extends ProductRow {
  categoryIds: string[];
  storeIds: string[];
}

export interface BlogPostRow {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  image: string | null;
  tags: string[];
  read_time: string | null;
  is_published: boolean;
  published_at: string;
}

export interface CatalogueCartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CatalogueLead {
  id: string;
  created_at: string;
  name: string;
  whatsapp: string;
  cart_items: CatalogueCartItem[];
  subtotal: number;
  status: "browsing" | "shared";
  company: string | null;
  email: string | null;
  source: "shop" | "corporate";
}

export interface CustomFieldDef {
  key: string;
  label: string;
  type: "text" | "dropdown";
  options?: string[];
  required: boolean;
}

export type CampaignType = "single" | "choice";

export interface CampaignRow {
  id: string;
  created_at: string;
  name: string;
  logo_url: string | null;
  campaign_type: CampaignType;
  num_hampers: number;
  custom_fields: CustomFieldDef[];
  is_active: boolean;
}

export interface CampaignProductRow {
  id: string;
  created_at: string;
  campaign_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export type FulfillmentStatus = "pending" | "shipped";

export interface CampaignCodeRow {
  code: string;
  created_at: string;
  campaign_id: string;
  is_redeemed: boolean;
  redeemed_at: string | null;
  selected_product_id: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_email: string | null;
  shipping_address: Record<string, string> | null;
  custom_field_answers: Record<string, string>;
  fulfillment_status: FulfillmentStatus;
}

export interface CampaignDetail extends CampaignRow {
  products: CampaignProductRow[];
  codes: CampaignCodeRow[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
}

export interface InvoiceRow {
  id: string;
  created_at: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string | null;
  customer_address: string | null;
  line_items: InvoiceLineItem[];
  subtotal: number;
  total_cost: number;
  notes: string | null;
}

export interface CustomerRow {
  id: string;
  created_at: string;
  updated_at: string;
  phone: string;
  name: string | null;
  email: string | null;
  company: string | null;
  notes: string | null;
}

export interface CustomerWithStats extends CustomerRow {
  totalOrders: number;
  totalSpent: number;
}

export interface CustomerDetail extends CustomerWithStats {
  orders: Order[];
  inquiries: Inquiry[];
  catalogueLeads: CatalogueLead[];
}
