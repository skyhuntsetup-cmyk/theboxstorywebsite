export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  badge?: string;
}

export interface BazaarItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const curatedProducts: Product[] = [
  {
    id: "cur-1",
    name: "The Royal Mithai Box",
    price: 1899,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    description: "An elegant assortment of artisanal dry fruit laddoos, Kaju katli, and two premium handcrafted clay-brass diyas.",
    category: "Diwali",
    badge: "Festive Best Seller"
  },
  {
    id: "cur-2",
    name: "Golden Festive Shimmer Hamper",
    price: 2499,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
    description: "Features custom copper tumblers, Kashmiri organic saffron tea, wildflower honey, and decorative toran hangers.",
    category: "Diwali",
    badge: "Limited Edition"
  },
  {
    id: "cur-3",
    name: "Sandalwood & Brass Rituals",
    price: 3299,
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80",
    description: "A premium ritual set consisting of a heavy brass incense burner, pure Mysore sandalwood incense cones, and premium cashew nuts.",
    category: "Weddings",
    badge: "Premium Heritage"
  },
  {
    id: "cur-4",
    name: "Rose Gold Grooming Hamper",
    price: 1599,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    description: "Curated grooming products, handmade charcoal-rose soaps, a rose-gold vacuum flask, and dark hazelnut chocolates.",
    category: "Anniversary",
    badge: "Modern Elegance"
  },
  {
    id: "cur-5",
    name: "The Executive Coffee Blend",
    price: 2100,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    description: "Designed for premium desk settings: customized ceramic mug, single-origin Araku Valley coffee beans, and oats cookies.",
    category: "Corporate",
    badge: "Corporate Elite"
  },
  {
    id: "cur-6",
    name: "Sweet Serenity Hampers",
    price: 1750,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    description: "Perfect housewarming wellness gift: Organic lavender room spray, jasmine soy wax candles, and wild acacia honey jar.",
    category: "Housewarming",
    badge: "Self Care"
  }
];

export const bazaarItems: BazaarItem[] = [
  {
    id: "bz-1",
    name: "Artisanal Kaju Katli (250g)",
    price: 450,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80",
    category: "Sweets"
  },
  {
    id: "bz-2",
    name: "Handcrafted Brass Diya (Pair)",
    price: 600,
    image: "https://images.unsplash.com/photo-1605884768395-5cb5dbfb21be?w=300&auto=format&fit=crop&q=80",
    category: "Decor"
  },
  {
    id: "bz-3",
    name: "Organic Lavender Soy Candle",
    price: 350,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&auto=format&fit=crop&q=80",
    category: "Wellness"
  },
  {
    id: "bz-4",
    name: "Premium Kashmiri Saffron (1g)",
    price: 399,
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=300&auto=format&fit=crop&q=80",
    category: "Gourmet"
  },
  {
    id: "bz-5",
    name: "Copper Tumbler (Engraved)",
    price: 750,
    image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=300&auto=format&fit=crop&q=80",
    category: "Gourmet"
  },
  {
    id: "bz-6",
    name: "Gourmet Almond Brittle",
    price: 299,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop&q=80",
    category: "Sweets"
  },
  {
    id: "bz-7",
    name: "Rose & Cardamom Tea Blend",
    price: 320,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=300&auto=format&fit=crop&q=80",
    category: "Gourmet"
  },
  {
    id: "bz-8",
    name: "Handmade Sandalwood Soap Bar",
    price: 180,
    image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=300&auto=format&fit=crop&q=80",
    category: "Wellness"
  },
  {
    id: "bz-9",
    name: "Luxury Playing Cards (Gold Foil)",
    price: 450,
    image: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=300&auto=format&fit=crop&q=80",
    category: "Decor"
  },
  {
    id: "bz-10",
    name: "Dark Chocolate Truffles",
    price: 250,
    image: "https://images.unsplash.com/photo-1548907040-4d42b52145ca?w=300&auto=format&fit=crop&q=80",
    category: "Sweets"
  }
];
