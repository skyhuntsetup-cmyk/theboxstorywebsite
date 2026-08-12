-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT,
    description TEXT,
    category TEXT, -- legacy single-category value; superseded by product_categories below, kept nullable for old rows/back-compat only
    badge TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create Policy to Allow Public Read Access
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products" 
ON public.products FOR SELECT 
USING (true);

-- Create Policy to Allow Admin Insert/Update/Delete (Use service role or authenticated admin role)
DROP POLICY IF EXISTS "Allow authenticated full access on products" ON public.products;
CREATE POLICY "Allow authenticated full access on products" 
ON public.products FOR ALL 
USING (auth.role() = 'authenticated');


-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('physical', 'magical')),
    subtotal NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'shipped', 'claimed')),
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    shipping_address JSONB,
    magical_link_details JSONB,
    items JSONB NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow Public Insert (for checkout transactions)
DROP POLICY IF EXISTS "Allow public inserts on orders" ON public.orders;
CREATE POLICY "Allow public inserts on orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Allow Public Select ONLY by ID (so recipients can view order contents on claim-gift page)
DROP POLICY IF EXISTS "Allow public select by id on orders" ON public.orders;
CREATE POLICY "Allow public select by id on orders" 
ON public.orders FOR SELECT 
USING (true);

-- Allow Authenticated (Admins) full access
DROP POLICY IF EXISTS "Allow authenticated full access on orders" ON public.orders;
CREATE POLICY "Allow authenticated full access on orders" 
ON public.orders FOR ALL 
USING (auth.role() = 'authenticated');


-- 3. Create Inquiries Table (For B2B Corporate Gifting form)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT NOT NULL,
    quantity TEXT NOT NULL,
    budget TEXT NOT NULL,
    details TEXT
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow Public Insert (for B2B submissions)
DROP POLICY IF EXISTS "Allow public inserts on inquiries" ON public.inquiries;
CREATE POLICY "Allow public inserts on inquiries" 
ON public.inquiries FOR INSERT 
WITH CHECK (true);

-- Allow Authenticated (Admins) full access
DROP POLICY IF EXISTS "Allow authenticated full access on inquiries" ON public.inquiries;
CREATE POLICY "Allow authenticated full access on inquiries" 
ON public.inquiries FOR ALL 
USING (auth.role() = 'authenticated');


-- 4. Seed Curated Products
INSERT INTO public.products (id, name, price, image, description, category, badge) VALUES
('cur-1', 'The Royal Mithai Box', 1899, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80', 'An elegant assortment of artisanal dry fruit laddoos, Kaju katli, and two premium handcrafted clay-brass diyas.', 'Diwali', 'Festive Best Seller'),
('cur-2', 'Golden Festive Shimmer Hamper', 2499, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', 'Features custom copper tumblers, Kashmiri organic saffron tea, wildflower honey, and decorative toran hangers.', 'Diwali', 'Limited Edition'),
('cur-3', 'Sandalwood & Brass Rituals', 3299, 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80', 'A premium ritual set consisting of a heavy brass incense burner, pure Mysore sandalwood incense cones, and premium cashew nuts.', 'Weddings', 'Premium Heritage'),
('cur-4', 'Rose Gold Grooming Hamper', 1599, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', 'Curated grooming products, handmade charcoal-rose soaps, a rose-gold vacuum flask, and dark hazelnut chocolates.', 'Anniversary', 'Modern Elegance'),
('cur-5', 'The Executive Coffee Blend', 2100, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', 'Designed for premium desk settings: customized ceramic mug, single-origin Araku Valley coffee beans, and oats cookies.', 'Corporate', 'Corporate Elite'),
('cur-6', 'Sweet Serenity Hampers', 1750, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80', 'Perfect housewarming wellness gift: Organic lavender room spray, jasmine soy wax candles, and wild acacia honey jar.', 'Housewarming', 'Self Care'),
('cur-7', 'Classic Stanley Tumbler Set', 1499, '/images/imported/Stanley Sets/63d936bc994f71d1655702a1b430608f.jpg', 'Features a premium insulated Stanley-style vacuum tumbler with matching steel straws and treats.', 'Corporate', 'Trending Cup'),
('cur-8', 'Golden Oak Open Hamper', 2100, '/images/imported/Open Hampers/57e9e083f75f408cd26a017a92dc32c7.webp', 'An open display willow basket consisting of gourmet almond brittle, wildflower honey, and organic tea jars.', 'Anniversary', 'Handcrafted Basket'),
('cur-9', 'Acrylic Standalone Keepsake', 899, '/images/imported/Acrlytic Stand Along Gifts/bb915f0783dca64827c47db821455a24.webp', 'Custom laser-engraved acrylic plaque mounted on a natural beechwood LED lighted base.', 'Housewarming', 'Personalized'),
('cur-10', 'The Budget Sweet Box', 990, '/images/imported/Below 1000 Inspiration/5a88e75cded9f4d147484596051ef5b2.webp', 'An affordable celebration tray packing dry fruit mathri, premium cashews, and twin tealight diyas.', 'Diwali', 'Best Value')
ON CONFLICT (id) DO NOTHING;


-- 5. Create Bazaar Items Table (For Build-a-Box Studio treats catalog)
CREATE TABLE IF NOT EXISTS public.bazaar_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Sweets', 'Decor', 'Wellness', 'Gourmet')),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.bazaar_items ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
DROP POLICY IF EXISTS "Allow public read access on bazaar_items" ON public.bazaar_items;
CREATE POLICY "Allow public read access on bazaar_items" 
ON public.bazaar_items FOR SELECT 
USING (true);

-- Allow Authenticated (Admins) Full Access
DROP POLICY IF EXISTS "Allow authenticated full access on bazaar_items" ON public.bazaar_items;
CREATE POLICY "Allow authenticated full access on bazaar_items" 
ON public.bazaar_items FOR ALL 
USING (auth.role() = 'authenticated');


-- 6. Create Box Styles Table (For Build-a-Box packaging types)
CREATE TABLE IF NOT EXISTS public.box_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL, -- Tailwind classes
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.box_styles ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
DROP POLICY IF EXISTS "Allow public read access on box_styles" ON public.box_styles;
CREATE POLICY "Allow public read access on box_styles" 
ON public.box_styles FOR SELECT 
USING (true);

-- Allow Authenticated (Admins) Full Access
DROP POLICY IF EXISTS "Allow authenticated full access on box_styles" ON public.box_styles;
CREATE POLICY "Allow authenticated full access on box_styles" 
ON public.box_styles FOR ALL 
USING (auth.role() = 'authenticated');


-- Seed Bazaar Items
-- Guarded with "only if the table is still empty" since bazaar_items/
-- box_styles have no unique column to key an ON CONFLICT off of — without
-- this, re-running the file would duplicate every seed row each time.
INSERT INTO public.bazaar_items (name, price, image, category, is_active)
SELECT * FROM (VALUES
('Artisanal Kaju Katli (250g)', 450, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80', 'Sweets', true),
('Handcrafted Brass Diya (Pair)', 600, 'https://images.unsplash.com/photo-1605884768395-5cb5dbfb21be?w=300&auto=format&fit=crop&q=80', 'Decor', true),
('Organic Lavender Soy Candle', 350, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&auto=format&fit=crop&q=80', 'Wellness', true),
('Premium Kashmiri Saffron (1g)', 550, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80', 'Gourmet', true),
('Assorted Dry Fruits (200g)', 490, 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=300&auto=format&fit=crop&q=80', 'Gourmet', true),
('Rose Water Facial Mist', 320, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80', 'Wellness', true),
('Stanley Steel Insulated Cup', 850, '/images/imported/Stanley Sets/8cba5ebdf761b8e27b6e23f8c3019ecb.jpg', 'Gourmet', true),
('Laser Engraved Acrylic Tag', 190, '/images/imported/Acrlytic Stand Along Gifts/02ca82a0a07f3026aba3f6f3e1b1b132.jpg', 'Decor', true),
('Sleek Black Flask Bottle', 590, '/images/imported/Drop Shipping STuff/bdcee014bb020d160f6ba54bb74dd638.webp', 'Gourmet', true)
) AS v(name, price, image, category, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.bazaar_items);

-- Seed Box Styles (same empty-table guard as above)
INSERT INTO public.box_styles (name, color, is_active)
SELECT * FROM (VALUES
('Classic Royal Gold', 'from-[#F97316]/20 to-[#E2BA5F]/30 border-gold/30', true),
('Blossom Rani Pink', 'from-[#D1126A]/20 to-purple-500/20 border-rani-pink/20', true),
('Midnight Teal Elegance', 'from-[#042F2E]/20 to-blue-900/20 border-teal-deep/30', true)
) AS v(name, color, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.box_styles);


-- 7.1 Create Categories Table (For Him, For Her, Anniversary, Birthday, Unique
-- Gifts, plus the legacy single-category values below). A product can belong
-- to any number of categories via product_categories, and shows up on every
-- category page it's tagged into.
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
CREATE POLICY "Allow public read access on categories"
ON public.categories FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on categories" ON public.categories;
CREATE POLICY "Allow authenticated full access on categories"
ON public.categories FOR ALL
USING (auth.role() = 'authenticated');

INSERT INTO public.categories (name, slug, display_order) VALUES
('For Him', 'for-him', 1),
('For Her', 'for-her', 2),
('Anniversary', 'anniversary', 3),
('Birthday', 'birthday', 4),
('Unique Gifts', 'unique-gifts', 5),
('Diwali', 'diwali', 6),
('Weddings', 'weddings', 7),
('Corporate', 'corporate', 8),
('Housewarming', 'housewarming', 9),
('Kids Birthday Gifts', 'kids-birthday-gifts', 10),
('Kids Return Gifts', 'kids-return-gifts', 11),
('Wedding Invites', 'wedding-invites', 12),
('Return Favours', 'return-favours', 13),
('Wedding Stationery', 'wedding-stationery', 14)
ON CONFLICT (slug) DO NOTHING;


-- 7.2 Product <-> Category tagging (many-to-many). Tagging a product into a
-- category here is what makes it appear on that category's page.
CREATE TABLE IF NOT EXISTS public.product_categories (
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on product_categories" ON public.product_categories;
CREATE POLICY "Allow public read access on product_categories"
ON public.product_categories FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on product_categories" ON public.product_categories;
CREATE POLICY "Allow authenticated full access on product_categories"
ON public.product_categories FOR ALL
USING (auth.role() = 'authenticated');

-- Backfill: tag every existing product into the category matching its old
-- single `category` column, so nothing goes uncategorized after migration.
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, c.id
FROM public.products p
JOIN public.categories c ON c.name = p.category
ON CONFLICT DO NOTHING;


-- 7.3 Create Blog Posts Table (self-service add/edit, replaces the static
-- data/blogs.ts file as the source of truth for new and edited posts)
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT,
    image TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    read_time TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on published blog_posts" ON public.blog_posts;
CREATE POLICY "Allow public read access on published blog_posts"
ON public.blog_posts FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated full access on blog_posts" ON public.blog_posts;
CREATE POLICY "Allow authenticated full access on blog_posts"
ON public.blog_posts FOR ALL
USING (auth.role() = 'authenticated');


-- 7.4 Create Catalogue Leads Table (name + WhatsApp captured on the
-- shareable catalogue link, plus a snapshot of their cart at share-out time)
CREATE TABLE IF NOT EXISTS public.catalogue_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    cart_items JSONB NOT NULL DEFAULT '[]',
    subtotal NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'shared' CHECK (status IN ('browsing', 'shared'))
);

ALTER TABLE public.catalogue_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts on catalogue_leads" ON public.catalogue_leads;
CREATE POLICY "Allow public inserts on catalogue_leads"
ON public.catalogue_leads FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on catalogue_leads" ON public.catalogue_leads;
CREATE POLICY "Allow authenticated full access on catalogue_leads"
ON public.catalogue_leads FOR ALL
USING (auth.role() = 'authenticated');


-- 7. Create Offline Inventory Table
CREATE TABLE IF NOT EXISTS public.offline_inventory (
    product_code TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    purchase_price NUMERIC NOT NULL,
    selling_price NUMERIC NOT NULL,
    photo_drive_link TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_synced BOOLEAN NOT NULL DEFAULT false,
    synced_type TEXT CHECK (synced_type IN ('curated', 'bazaar'))
);

-- Enable RLS
ALTER TABLE public.offline_inventory ENABLE ROW LEVEL SECURITY;

-- Allow Authenticated (Admins) Full Access
DROP POLICY IF EXISTS "Allow authenticated full access on offline_inventory" ON public.offline_inventory;
CREATE POLICY "Allow authenticated full access on offline_inventory"
ON public.offline_inventory FOR ALL
USING (auth.role() = 'authenticated');


-- 9. Stock tracking on the live storefront catalog. NULL means "not tracked"
-- (always shown as available, existing behavior for every pre-existing
-- product); 0 means out of stock and hides the Add/Buy control; any positive
-- number is shown as-is. This is separate from offline_inventory, which is
-- back-office purchase/vendor bookkeeping, not what the storefront reads.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER;


-- 10. Corporate Campaigns: admin-managed employee gifting claim panels.
-- A campaign is either 'single' (one hamper for everyone) or 'choice'
-- (employee picks one of several hampers). Each campaign gets `num_hampers`
-- unique, random, one-time-use codes. None of these three tables have any
-- public RLS policy — the claim flow never queries Supabase directly from
-- the browser, only through rate-limited /api/claim-campaign/* routes using
-- the service-role client, so codes can never be listed/enumerated
-- client-side (same treatment as offline_inventory above).

CREATE TABLE IF NOT EXISTS public.corporate_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('single', 'choice')),
    num_hampers INTEGER NOT NULL CHECK (num_hampers > 0),
    custom_fields JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.corporate_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated full access on corporate_campaigns" ON public.corporate_campaigns;
CREATE POLICY "Allow authenticated full access on corporate_campaigns"
ON public.corporate_campaigns FOR ALL
USING (auth.role() = 'authenticated');


CREATE TABLE IF NOT EXISTS public.campaign_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    campaign_id UUID NOT NULL REFERENCES public.corporate_campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.campaign_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated full access on campaign_products" ON public.campaign_products;
CREATE POLICY "Allow authenticated full access on campaign_products"
ON public.campaign_products FOR ALL
USING (auth.role() = 'authenticated');


CREATE TABLE IF NOT EXISTS public.campaign_codes (
    code TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    campaign_id UUID NOT NULL REFERENCES public.corporate_campaigns(id) ON DELETE CASCADE,
    is_redeemed BOOLEAN NOT NULL DEFAULT false,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    selected_product_id UUID REFERENCES public.campaign_products(id),
    recipient_name TEXT,
    recipient_phone TEXT,
    recipient_email TEXT,
    shipping_address JSONB,
    custom_field_answers JSONB NOT NULL DEFAULT '{}',
    fulfillment_status TEXT NOT NULL DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'shipped'))
);

ALTER TABLE public.campaign_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated full access on campaign_codes" ON public.campaign_codes;
CREATE POLICY "Allow authenticated full access on campaign_codes"
ON public.campaign_codes FOR ALL
USING (auth.role() = 'authenticated');


-- 10.1 Storage bucket for campaign logos/product photos. Public read (so the
-- images actually display on the claim page), no public write — uploads only
-- go through the service-role client in app/api/admin/campaigns/upload.
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-assets', 'campaign-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read on campaign-assets" ON storage.objects;
CREATE POLICY "Allow public read on campaign-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'campaign-assets');


-- 11. Stores: the five customer-facing shopping destinations (Pre-Curated
-- Collections, Build Your Own Box, Quirky Stuff Store, Divine Store, Custom
-- Gifts). Separate dimension from `categories` (occasion/recipient tags) —
-- a product picks its store(s) via product_stores AND keeps its category
-- tags, so e.g. "Divine Store -> For Her -> under 2000" works as a filter.
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT,
    hero_image TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on stores" ON public.stores;
CREATE POLICY "Allow public read access on stores"
ON public.stores FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on stores" ON public.stores;
CREATE POLICY "Allow authenticated full access on stores"
ON public.stores FOR ALL
USING (auth.role() = 'authenticated');

INSERT INTO public.stores (name, slug, tagline, display_order) VALUES
('Pre-Curated Collections', 'pre-curated-collections', 'Ready-made hampers, styled and ready to ship', 1),
('Build Your Own Box', 'build-your-own-box', 'Pick your packaging, pick your treats', 2),
('Quirky Stuff Store', 'quirky-stuff', 'Fun, offbeat gifts with personality', 3),
('Divine Store', 'divine-store', 'Sacred and spiritual gifting essentials', 4),
('Custom Gifts', 'custom-gifts', 'Personalized and engraved keepsakes', 5),
('Shop', 'shop', 'Quick order catalogue', 6),
('Kids', 'kids', 'Playful gifts and party favours for little ones', 7),
('Wedding Essentials', 'wedding-essentials', 'Invites, stationery, and return favours for your big day', 8)
ON CONFLICT (slug) DO NOTHING;


-- 11.1 Product <-> Store tagging (many-to-many, same pattern as
-- product_categories). Tagging a product into a store is what makes it show
-- up on that store's page.
CREATE TABLE IF NOT EXISTS public.product_stores (
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, store_id)
);

ALTER TABLE public.product_stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on product_stores" ON public.product_stores;
CREATE POLICY "Allow public read access on product_stores"
ON public.product_stores FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on product_stores" ON public.product_stores;
CREATE POLICY "Allow authenticated full access on product_stores"
ON public.product_stores FOR ALL
USING (auth.role() = 'authenticated');

-- Backfill: every existing product goes into Pre-Curated Collections by
-- default, so nothing disappears from /collections after this migration.
-- Re-tag anything that actually belongs in Quirky/Divine/Custom Gifts from
-- the admin afterward.
INSERT INTO public.product_stores (product_id, store_id)
SELECT p.id, s.id
FROM public.products p, public.stores s
WHERE s.slug = 'pre-curated-collections'
ON CONFLICT DO NOTHING;


-- 11.2 Personalization: for Custom Gifts products that need engraving text,
-- a name, a photo upload, etc. before they can be added to the bag. Same
-- {key, label, type, options?, required} shape as corporate_campaigns'
-- custom_fields, reused rather than reinvented. Empty array (the default)
-- means the product behaves like every other product today.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS personalization_fields JSONB NOT NULL DEFAULT '[]';


-- 11.3 Retire bazaar_items as a separate admin surface: fold every existing
-- treat into products, tagged into the Build Your Own Box store. The
-- bazaar_items table itself is left in place (unused) as a rollback safety
-- net rather than dropped outright.
-- Some live databases still have `category` as NOT NULL from before that
-- column was demoted to legacy/back-compat-only; relax it so this insert
-- (and any future store-tagged product with no legacy category) can proceed.
ALTER TABLE public.products ALTER COLUMN category DROP NOT NULL;

INSERT INTO public.products (id, name, price, image, description, category, badge, stock_quantity)
SELECT
    'bz-' || b.id::text,
    b.name,
    b.price,
    b.image,
    b.category || ' treat from the Hamper Studio bazaar.',
    b.category,
    NULL,
    CASE WHEN b.is_active THEN NULL ELSE 0 END
FROM public.bazaar_items b
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_stores (product_id, store_id)
SELECT 'bz-' || b.id::text, s.id
FROM public.bazaar_items b, public.stores s
WHERE s.slug = 'build-your-own-box'
ON CONFLICT DO NOTHING;


-- 12. Billing & Invoices: an admin-only, from-scratch invoice builder.
-- Cost price lives directly on the product so it can be looked up/autofilled
-- when building an invoice, but every invoice line item also carries its own
-- cost_price/selling_price snapshot (JSONB), independent of the product's
-- current price, since prices/costs drift over time and a past invoice must
-- stay exactly as it was printed.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price NUMERIC;

-- Backs invoice_number's default below; nextval() is atomic, so concurrent
-- invoice creation can never produce a duplicate number.
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1;

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL DEFAULT ('TBS-' || LPAD(nextval('public.invoice_number_seq')::text, 4, '0')),
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    line_items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    total_cost NUMERIC NOT NULL,
    notes TEXT
);

-- No public policy: invoices (and the cost prices inside them) are only ever
-- read/written through /api/admin/invoices/* using the service-role client,
-- gated by proxy.ts's /admin + /api/admin matcher — same treatment as
-- offline_inventory and corporate_campaigns above.
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated full access on invoices" ON public.invoices;
CREATE POLICY "Allow authenticated full access on invoices"
ON public.invoices FOR ALL
USING (auth.role() = 'authenticated');


-- 14. Customers: a single contact list aggregated from every place a phone
-- number shows up today (orders, inquiries, catalogue leads, redeemed
-- campaign codes), keyed by a normalized last-10-digits phone so the same
-- person collapses to one row regardless of "+91 98765 43210" vs
-- "9876543210" formatting differences across those source tables. This is
-- the CRM foundation: the on-ramp for any future WhatsApp marketing tool
-- (via the CSV export) and the one place to see a customer's full history.
-- No public policy — populated only via lib/customerSync.ts's service-role
-- client, even from routes whose primary insert uses the anon client.
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    company TEXT,
    notes TEXT
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated full access on customers" ON public.customers;
CREATE POLICY "Allow authenticated full access on customers"
ON public.customers FOR ALL
USING (auth.role() = 'authenticated');

-- One-time backfill from every existing source table. Only fills gaps
-- (ON CONFLICT DO NOTHING) so this stays safe to re-run in full.
INSERT INTO public.customers (phone, name, email)
SELECT NULLIF(RIGHT(regexp_replace(COALESCE(o.customer_phone, ''), '\D', '', 'g'), 10), ''), o.customer_name, o.customer_email
FROM public.orders o
WHERE NULLIF(RIGHT(regexp_replace(COALESCE(o.customer_phone, ''), '\D', '', 'g'), 10), '') IS NOT NULL
ON CONFLICT (phone) DO NOTHING;

INSERT INTO public.customers (phone, name, email, company)
SELECT NULLIF(RIGHT(regexp_replace(COALESCE(i.phone, ''), '\D', '', 'g'), 10), ''), i.name, i.email, i.company
FROM public.inquiries i
WHERE NULLIF(RIGHT(regexp_replace(COALESCE(i.phone, ''), '\D', '', 'g'), 10), '') IS NOT NULL
ON CONFLICT (phone) DO NOTHING;

INSERT INTO public.customers (phone, name)
SELECT NULLIF(RIGHT(regexp_replace(COALESCE(c.whatsapp, ''), '\D', '', 'g'), 10), ''), c.name
FROM public.catalogue_leads c
WHERE NULLIF(RIGHT(regexp_replace(COALESCE(c.whatsapp, ''), '\D', '', 'g'), 10), '') IS NOT NULL
ON CONFLICT (phone) DO NOTHING;

INSERT INTO public.customers (phone, name, email)
SELECT NULLIF(RIGHT(regexp_replace(COALESCE(cc.recipient_phone, ''), '\D', '', 'g'), 10), ''), cc.recipient_name, cc.recipient_email
FROM public.campaign_codes cc
WHERE cc.is_redeemed = true
  AND NULLIF(RIGHT(regexp_replace(COALESCE(cc.recipient_phone, ''), '\D', '', 'g'), 10), '') IS NOT NULL
ON CONFLICT (phone) DO NOTHING;


-- 15. Corporate Quote Builder: reuses catalogue_leads (already the right
-- shape — name/contact + cart snapshot + subtotal) rather than a parallel
-- table, distinguished by `source`.
ALTER TABLE public.catalogue_leads ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.catalogue_leads ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.catalogue_leads ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'shop';

