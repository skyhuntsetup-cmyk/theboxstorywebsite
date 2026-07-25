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
('cur-6', 'Sweet Serenity Hampers', 1750, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80', 'Perfect housewarming wellness gift: Organic lavender room spray, jasmine soy wax candles, and wild acacia honey jar.', 'Housewarming', 'Self Care')
ON CONFLICT (id) DO NOTHING;
