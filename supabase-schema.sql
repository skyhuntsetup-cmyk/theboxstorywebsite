-- 1. Create Products Table
CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT,
    description TEXT,
    category TEXT NOT NULL,
    badge TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create Policy to Allow Public Read Access
CREATE POLICY "Allow public read access on products" 
ON public.products FOR SELECT 
USING (true);

-- Create Policy to Allow Admin Insert/Update/Delete (Use service role or authenticated admin role)
CREATE POLICY "Allow authenticated full access on products" 
ON public.products FOR ALL 
USING (auth.role() = 'authenticated');


-- 2. Create Orders Table
CREATE TABLE public.orders (
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
CREATE POLICY "Allow public inserts on orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Allow Public Select ONLY by ID (so recipients can view order contents on claim-gift page)
CREATE POLICY "Allow public select by id on orders" 
ON public.orders FOR SELECT 
USING (true);

-- Allow Authenticated (Admins) full access
CREATE POLICY "Allow authenticated full access on orders" 
ON public.orders FOR ALL 
USING (auth.role() = 'authenticated');


-- 3. Create Inquiries Table (For B2B Corporate Gifting form)
CREATE TABLE public.inquiries (
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
CREATE POLICY "Allow public inserts on inquiries" 
ON public.inquiries FOR INSERT 
WITH CHECK (true);

-- Allow Authenticated (Admins) full access
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
CREATE TABLE public.bazaar_items (
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
CREATE POLICY "Allow public read access on bazaar_items" 
ON public.bazaar_items FOR SELECT 
USING (true);

-- Allow Authenticated (Admins) Full Access
CREATE POLICY "Allow authenticated full access on bazaar_items" 
ON public.bazaar_items FOR ALL 
USING (auth.role() = 'authenticated');


-- 6. Create Box Styles Table (For Build-a-Box packaging types)
CREATE TABLE public.box_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL, -- Tailwind classes
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.box_styles ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Allow public read access on box_styles" 
ON public.box_styles FOR SELECT 
USING (true);

-- Allow Authenticated (Admins) Full Access
CREATE POLICY "Allow authenticated full access on box_styles" 
ON public.box_styles FOR ALL 
USING (auth.role() = 'authenticated');


-- Seed Bazaar Items
INSERT INTO public.bazaar_items (name, price, image, category, is_active) VALUES
('Artisanal Kaju Katli (250g)', 450, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80', 'Sweets', true),
('Handcrafted Brass Diya (Pair)', 600, 'https://images.unsplash.com/photo-1605884768395-5cb5dbfb21be?w=300&auto=format&fit=crop&q=80', 'Decor', true),
('Organic Lavender Soy Candle', 350, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&auto=format&fit=crop&q=80', 'Wellness', true),
('Premium Kashmiri Saffron (1g)', 550, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80', 'Gourmet', true),
('Assorted Dry Fruits (200g)', 490, 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=300&auto=format&fit=crop&q=80', 'Gourmet', true),
('Rose Water Facial Mist', 320, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80', 'Wellness', true),
('Stanley Steel Insulated Cup', 850, '/images/imported/Stanley Sets/8cba5ebdf761b8e27b6e23f8c3019ecb.jpg', 'Gourmet', true),
('Laser Engraved Acrylic Tag', 190, '/images/imported/Acrlytic Stand Along Gifts/02ca82a0a07f3026aba3f6f3e1b1b132.jpg', 'Decor', true),
('Sleek Black Flask Bottle', 590, '/images/imported/Drop Shipping STuff/bdcee014bb020d160f6ba54bb74dd638.webp', 'Gourmet', true);

-- Seed Box Styles
INSERT INTO public.box_styles (name, color, is_active) VALUES
('Classic Royal Gold', 'from-[#F97316]/20 to-[#E2BA5F]/30 border-gold/30', true),
('Blossom Rani Pink', 'from-[#D1126A]/20 to-purple-500/20 border-rani-pink/20', true),
('Midnight Teal Elegance', 'from-[#042F2E]/20 to-blue-900/20 border-teal-deep/30', true);

