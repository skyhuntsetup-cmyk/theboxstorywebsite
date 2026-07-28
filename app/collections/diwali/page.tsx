"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Gift, ArrowRight, X, ArrowLeft, BookOpen, 
  MapPin, Clock, Star, Calendar, CheckCircle2, ChevronRight, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function DiwaliCollection() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Bulk Gifting Form states inside detail modal
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "50-100",
    details: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const diwaliProducts = [
    {
      id: "diwali-1",
      name: "Swarna Kalash",
      price: 535,
      tagline: "A tray of prosperity that glows beyond Diwali.",
      description: "The Swarna Kalash is a luxurious brass-finished tray with a delicately designed jar that carries the essence of celebration. Inspired by timeless Indian artistry, its golden detailing and bird-top handle evoke heritage charm, making it not just a gift but a keepsake. Perfect for festive gifting, this hamper seamlessly blends elegance with thoughtful indulgence.",
      detailPage: 5,
      photoPage: 6,
      inclusions: [
        "Ornamental brass tray with intricate jaali work",
        "Designer dry fruit jar with golden bird-top lid",
        "250gm Premium Dry Fruits (Almonds, Cashews, Raisins, or Mixed Nuts)",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "250gm of Chocodips", price: 535 },
        { name: "250gm of Raisins", price: 535 },
        { name: "250gm of Seeds, Nuts & Berries Mix", price: 560 },
        { name: "250gm of Cashew", price: 635 },
        { name: "250gm of Almond", price: 660 },
        { name: "250gm of Hazelnuts", price: 735 }
      ]
    },
    {
      id: "diwali-2",
      name: "Yugam",
      price: 680,
      tagline: "Two jars, one thoughtful gesture.",
      description: "A minimal yet elegant 2-jar hamper crafted for timeless gifting — compact, classy, and versatile. This floral-patterned keepsake box with its golden clasp handle is more than just packaging—it’s a statement of class and elegance. Designed to add a touch of heritage charm, the hamper makes an impression that lasts beyond the festival. Perfect for corporate or personal gifting, it holds premium dry fruits in glass jars, symbolizing health and prosperity for the season.",
      detailPage: 8,
      photoPage: 9,
      inclusions: [
        "Reusable MDF Decorative Box with golden handle",
        "2 Premium Jars of 200gm Dry Fruits each",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "200gm Seeds Nuts & Berries + 200gm Raisins", price: 680 },
        { name: "200gm Almonds + 200gm Cashew", price: 850 }
      ]
    },
    {
      id: "diwali-3",
      name: "Patra Shobha",
      price: 760,
      tagline: "Gift wrapped in nature's grace.",
      description: "A graceful floral-leaf patterned box with golden detailing and a regal handle, this hamper captures timeless sophistication. Designed for Diwali gifting, it beautifully balances tradition and luxury while keeping the goodness of dry fruits at its heart.",
      detailPage: 10,
      photoPage: 11,
      inclusions: [
        "Reusable MDF Decorative Box with golden handle & gold foiled detailing",
        "2 Premium Jars of 200gm Dry Fruits",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "200gm Almonds + 200gm Raisins", price: 760 },
        { name: "200gm Almonds + 200gm Cashew", price: 850 }
      ]
    },
    {
      id: "diwali-4",
      name: "Swarna Jugalbandi",
      price: 830,
      tagline: "A golden pairing of elegance and taste.",
      description: "The Swarna Jugalbandi hamper brings together tradition and modern elegance in a reusable brass-finish serving tray with two finely designed jars. Perfect for corporate and festive gifting, this box symbolizes prosperity, sharing, and togetherness. The golden motifs paired with premium dry fruits inside make it a luxurious yet thoughtful gesture.",
      detailPage: 12,
      photoPage: 13,
      inclusions: [
        "Reusable Brass-finish Serving Tray (with intricate cutwork design)",
        "2 Premium Ceramic Jars with Golden Floral Lids",
        "2 X 200gm Assorted Dry Fruits",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "200gm each of Chocodips + Seeds Nuts & Berries Mix", price: 860 },
        { name: "200gm each of Cashews + Almonds", price: 1030 },
        { name: "200gm each of Pistachios + Hazelnut Choco-dips", price: 1180 }
      ]
    },
    {
      id: "diwali-5",
      name: "Rajsi",
      price: 960,
      tagline: "Minimal. Elegant. Royal.",
      description: "A golden-brown textured 2-jar box, sophisticated yet compact — ideal for corporate Diwali gifting. The Rajsi is a timeless 2-jar gift box crafted with a rich golden-brown leatherette finish and intricate embossed lid. Its minimal yet regal design makes it an ideal choice for corporate as well as personal gifting. Compact yet classy, this box ensures your Diwali wishes are wrapped in luxury.",
      detailPage: 15,
      photoPage: 16,
      inclusions: [
        "Reusable Luxurious textured leatherette box with metallic clasp closure",
        "2 Premium Jars of 200gm Dry Fruits each",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "200gm Almonds + 200gm Cashew", price: 960 },
        { name: "200gm Chocodips Hazelnuts + 200gm Panchrattan Dry Fruit Mix", price: 1040 }
      ]
    },
    {
      id: "diwali-6",
      name: "Rajwada",
      price: 900,
      tagline: "A royal ensemble of taste and tradition.",
      description: "The Rajwada hamper is crafted for those who value elegance with a cultural soul. The royal blue box adorned with golden motifs reflects timeless artistry, making it perfect for Diwali or corporate gifting. Inside, each element is curated to blend tradition with indulgence—whether it’s sweets, snacks, or artisanal keepsakes, every inclusion adds to the festive delight. The box not only gifts flavors but also symbols of prosperity, ensuring it leaves a lasting impression.",
      detailPage: 33,
      photoPage: 34,
      inclusions: [
        "Diwali themed Premium Paper reusable hamper box",
        "2 Crunchy Chocolate Brittle Packs",
        "2 X 100gm Dry Fruit Jars in luxurious Potli (Flavoured Almonds & Roasted Seeds Mix)",
        "Laxmi Ganesh Moorti in potli for auspicious beginnings",
        "Eat Better - Millet Snacks Pack",
        "Brass Urli bowl",
        "Personalized Diwali Message Card"
      ],
      variants: [
        { name: "Standard Set", price: 900 }
      ]
    },
    {
      id: "diwali-7",
      name: "Gau Sanidhya",
      price: 1100,
      tagline: "Sacred blessings wrapped in elegance.",
      description: "The Gau Sanidhya hamper brings together the sanctity of tradition and the warmth of thoughtful gifting. Featuring a reusable golden tray paired with a pichwai-inspired jar and festive essentials, this box is designed to resonate with both cultural richness and everyday usability. Perfect for festive gifting, it makes a graceful statement of respect and prosperity.",
      detailPage: 17,
      photoPage: 18,
      inclusions: [
        "Golden finish tray with intricate cutwork, elegant for serving or décor",
        "Pichwai Print Jar",
        "1 X 200gm Dry Fruit Jar (Almonds/Cashew/Seeds Mix)",
        "Incense Cone Box",
        "2 X Brass Diya",
        "All posh-wrapped in festive potli",
        "Shredded Paper Base & Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1100 }
      ]
    },
    {
      id: "diwali-8",
      name: "Annapurna",
      price: 1165,
      tagline: "A wholesome gift of taste, health, and festivity.",
      description: "The Annapurna is a thoughtfully curated hamper that blends the richness of traditional flavors with the warmth of festive essentials. With nutritious millet namkeen, divine incense cones, and festive sweets, it carries a perfect mix of health and heritage. Designed with vibrant elements like Shubh-Labh decor and handcrafted touches, this hamper is meant to light up homes with joy, prosperity, and togetherness.",
      detailPage: 37,
      photoPage: 38,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "50gm Daily Nut Co.’s Almond Box in luxurious Potli",
        "Cracker-themed chocolate box (10 chocolates)",
        "Floranile Dhoop Cone Box",
        "Shubh Labh Hanging",
        "Eat Better Millet Snack",
        "Lotus Akhand Jyot Diya (3inch)",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1165 }
      ]
    },
    {
      id: "diwali-9",
      name: "Trishakti Uphaar",
      price: 1185,
      tagline: "A sacred blend of taste, tradition, and spirituality.",
      description: "The Trishakti Uphaar box beautifully unites the flavors of festive indulgence with the blessings of divinity. Designed in an elegant keepsake box, it combines premium sweets, artisanal dry fruits, and spiritual elements — creating a thoughtful hamper that delights both heart and soul. Each element is chosen to represent prosperity, protection, and positivity, making it the perfect festive gift for families, employees, or clients.",
      detailPage: 40,
      photoPage: 41,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 Crunchy Chocolate Brittle Packs",
        "50gm Daily Nut Co.’s Almond Box in luxurious Potli",
        "Honey Twigs Pack – Natural Honey",
        "HUG Dhoop Cone Box",
        "Shiva Trishul Idol – symbol of strength and blessings",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1185 }
      ]
    },
    {
      id: "diwali-10",
      name: "Shubh Deep",
      price: 1355,
      tagline: "A festive box that brings together light, tradition, and taste.",
      description: "The Shubh Deep Box is a carefully curated Diwali hamper that celebrates tradition with a modern touch. Designed to bring festive joy and auspicious beginnings, it beautifully blends sweets, dry fruits, and symbolic elements of prosperity like Shubh-Labh and candles. Each inclusion is selected to represent abundance, light, and heartfelt gifting.",
      detailPage: 49,
      photoPage: 50,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 X 100gm Dry Fruit Jars in luxurious Potli (Almonds & Cashews)",
        "OM Sweets Dhoda Box",
        "OM Sweets Chana Burfi Box",
        "Shubh Labh Pair",
        "HUG Dhoop Cone Box",
        "2 X Ladoo Candles",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1355 }
      ]
    },
    {
      id: "diwali-11",
      name: "Shri Ram Uphaar",
      price: 1430,
      tagline: "A divine gift box that carries blessings of Lord Ram.",
      description: "Celebrate Diwali with a spiritual and premium gifting experience. This curated box blends tradition with elegance, featuring auspicious keepsakes and festive essentials. From the grace of Ram Lalla moorti to the glow of an urli candle, every element is chosen to spread devotion, light, and happiness. Perfect as a sacred festive hamper for loved ones or colleagues.",
      detailPage: 51,
      photoPage: 52,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "शुभ लाभ (Shubh Labh) Pair",
        "Ram Lalla Moorti – A divine idol bringing blessings & positivity",
        "Cracker-themed chocolate box (10 chocolates)",
        "Urli Candle",
        "Floranile Dhoop Cone Box",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1430 }
      ]
    },
    {
      id: "diwali-12",
      name: "Hiranyam",
      price: 1530,
      tagline: "Where sweetness meets light this Diwali.",
      description: "The Hiranyam is a thoughtfully curated Diwali hamper that brings together taste, fragrance, and tradition. The elegant box carries the warmth of festive flavors and the light of prosperity, making it a perfect blend of indulgence and devotion.",
      detailPage: 54,
      photoPage: 55,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 Crunchy Chocolate Brittle Packs (2 X Pack of 3)",
        "Honey Twigs Pack – Cinnamon",
        "HUG Agarbatti Box",
        "Lotus Akhand Jyot Diya",
        "1 X 200gm Almond Jar packed in luxurious Potli",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1530 }
      ]
    },
    {
      id: "diwali-13",
      name: "Hawa Mahal",
      price: 1565,
      tagline: "A royal blend of devotion, sweetness, and light.",
      description: "This hamper captures the soul of Diwali with a regal mix of tradition and taste. From artisanal sweets to timeless brass accents, every element is chosen to symbolize prosperity and devotion. Perfect for family celebrations and corporate gifting, it’s a box that feels festive, sacred, and thoughtful.",
      detailPage: 57,
      photoPage: 58,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 X 100gm Dry Fruit Jars in luxurious Potli (Almonds & Cashews)",
        "HUG Agarbatti Box",
        "OM Sweets Dhoda Box",
        "OM Sweets Chana Burfi Box",
        "Shubh Labh Hanging Pair",
        "Brass Lotus Akhand Jyot (6 inch)",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1565 }
      ]
    },
    {
      id: "diwali-14",
      name: "Sampoorna Shubh",
      price: 1670,
      tagline: "A festive blend of taste, tradition, and tranquility.",
      description: "The Sampoorna Shubh Box is a thoughtfully curated Diwali hamper that celebrates the spirit of prosperity and peace. Designed to combine wellness, indulgence, and devotion, this box brings together premium dry fruits, calming teas, and festive essentials, making it a perfect gift for family, friends, or colleagues. Its elegant structure paired with meaningful inclusions ensures it resonates with both modern and traditional sentiments.",
      detailPage: 59,
      photoPage: 60,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 X Eat Better Dry Fruit Packs (Almonds & Cashew)",
        "Premium Green Tea",
        "2 Dhoop Cone Boxes",
        "Shubh Labh Pair",
        "Cracker-themed chocolate box (10 chocolates)",
        "Urli Candle",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1670 }
      ]
    },
    {
      id: "diwali-15",
      name: "Gyaan Deep",
      price: 1670,
      tagline: "Illuminate hearts with wisdom, sweetness, and light.",
      description: "The Gyaan Deep hamper beautifully combines tradition with thoughtfulness. Featuring the sacred essence of the Geeta Saar, paired with festive indulgences and soulful elements, this box is designed to spread not just joy but also knowledge and blessings. With a perfect balance of devotion, sweetness, and celebration, it makes for an unforgettable gift.",
      detailPage: 62,
      photoPage: 63,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "Geeta Saar – A spiritual touch for mindful living",
        "Eat Better - Ladoo Pack",
        "Rosier Natural Honey Jar",
        "Fairy Lights wrapped in festive potli",
        "HUG Agarbatti Box",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1670 }
      ]
    },
    {
      id: "diwali-16",
      name: "Anand Kalash",
      price: 1930,
      tagline: "A complete festive gift of sweetness, light, and tradition.",
      description: "The Anand Kalash is a thoughtfully designed Diwali hamper that brings together festive essentials with a touch of elegance. The box is structured to reflect prosperity, featuring nourishing dry fruits, divine décor, and indulgent treats. It’s a perfect balance of health, tradition, and luxury, making it a meaningful gift for employees, clients, or loved ones.",
      detailPage: 66,
      photoPage: 67,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "2 X 50gm Daily Nut Co.’s Dry Fruit Boxes in Paan Shots & Almonds",
        "Fairy Lights in luxurious Potli",
        "Honey Twigs Pack – Natural Honey",
        "Cracker-themed chocolate box (10 chocolates)",
        "Shubh Labh Hanging",
        "Water Bottle",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 1930 }
      ]
    },
    {
      id: "diwali-17",
      name: "Lakshmi",
      price: 2000,
      tagline: "Invoke blessings of wealth, health, and happiness.",
      description: "Bless your loved ones with good luck, health, and prosperity this Diwali with our luxurious Lakshmi hamper. This extravagant gift box includes a gold-plated Lakshmi Ji Charan Paduka to invoke blessings, along with soothing green tea and fragrant incense sticks to enhance the spiritual atmosphere. Carefully curated with traditional items that reflect the essence of Diwali, the Lakshmi hamper is a perfect offering for those you hold dear. A blend of health, tradition, and divine blessings, this hamper is designed to bring joy and abundance into their lives.",
      detailPage: 70,
      photoPage: 71,
      inclusions: [
        "Diwali themed Premium Kappa reusable hamper box",
        "Gold Plated Lakshmi Ji Charan Paduka Box",
        "Charles & Robert Green Tea",
        "HUG Incense Stick Box",
        "Handcrafted Terracotta Diyas",
        "Jar of Seeds, Nuts & Berries Trail in traditional potli",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 2000 }
      ]
    },
    {
      id: "diwali-18",
      name: "Sunehri Jhalak",
      price: 2250,
      tagline: "A golden glow of festivities in every bite.",
      description: "This hamper celebrates the warmth of Diwali with a golden Moroccan charm. Styled in an elegant gold wired basket, it brings together festive essentials and indulgent delights. From crunchy cookies and wholesome dry fruits to honey and incense, each element reflects abundance, prosperity, and joy. Fairy lights and the Moroccan lamp add an eternal sparkle, making this a perfect centerpiece for gifting.",
      detailPage: 72,
      photoPage: 73,
      inclusions: [
        "Golden wired basket, re-usable for decor, fruit-basket etc",
        "Fairy Lights in festive potlis",
        "2 X 200gm Dry Fruit Jars in luxurious Potli (Almonds & Raisins)",
        "Cookie box & Honey Twigs Pack - Natural Honey",
        "HUG Agarbatti box & Moroccan lamp",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 2250 }
      ]
    },
    {
      id: "diwali-19",
      name: "Aaradhana Peti",
      price: 2500,
      tagline: "A divine hamper to celebrate light, taste, and tradition.",
      description: "The Aaradhana Peti is a thoughtfully designed festive box that combines taste, devotion, and elegance. With premium dry fruits, artisanal chocolates, calming green tea, and symbolic elements like an agarbatti stand and Laxmi–Ganesh moorti, this hamper brings together everything needed to invoke positivity and festive joy. Perfect for gifting to families, clients, and colleagues as a complete Diwali blessing.",
      detailPage: 75,
      photoPage: 76,
      inclusions: [
        "Premium Pine-wood reusable hamper box",
        "3 X 100gms Premium Dry Fruit Jars in festive potlis (Almond, Raisins & Cashew)",
        "10pcs Assorted handcrafted chocolates in festive potli",
        "Laxmi–Ganesh / Ram Lala Moorti in festive potli",
        "Charles & Robert Green Tea & Lotus Akhand Jyot Diya",
        "Personalized Diwali Note"
      ],
      variants: [
        { name: "Standard Set", price: 2500 }
      ]
    }
  ];

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          details: `Diwali Box Request: "${selectedProduct?.name}" - ` + formData.details
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsSubmitted(true);
        confetti({
          particleCount: 50,
          spread: 40,
          colors: ["#B45309", "#9D174D", "#E2BA5F"],
        });
      } else {
        alert("Failed to submit inquiry: " + (data.error || "Please try again."));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Can we add custom laser-engraved corporate branding on these Diwali boxes?",
      a: "Yes! For all orders above 30 units, we offer custom gold foil logo stamping, engraved wooden lid plates, and matching branded satin ribbons."
    },
    {
      q: "What is the average shipping timeframe for Diwali bulk orders?",
      a: "Standard bulk processing takes 5-7 business days. Courier dispatch across tier-1 cities in India delivers in 2-4 days. We recommend booking early for the rush Diwali week."
    },
    {
      q: "Are the dry fruits and ceramic jars premium quality?",
      a: "Yes. All dry fruits are vacuum-sealed Grade A quality. Jars are double-glazed ceramic hand-painted by local Rajasthani artisans."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf4e7] py-16 px-6 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Banner Section */}
        <section className="relative rounded-[40px] overflow-hidden bg-white border border-teal-deep/5 p-8 md:p-16 shadow-lg text-left">
          <div className="absolute top-0 right-0 w-72 h-72 bg-saffron/5 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-2xl space-y-6">
            <span className="text-[10px] tracking-widest font-black uppercase text-saffron bg-saffron/10 px-3.5 py-1.5 rounded-full inline-block border border-saffron/20">
              Seasonal Releases 2026
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-teal-deep leading-tight">
              The Diwali <br />
              <span className="text-rani-pink font-serif italic font-normal">Celebration Catalog</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">
              Explore our new releases. Click any catalog product card below to view its extracted specifications, native inclusions list, price variants, and product photos.
            </p>
            <div className="pt-2">
              <Link
                href="/corporate/catalog"
                className="inline-flex items-center space-x-2 bg-teal-deep hover:bg-teal-deep/95 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Digital Lookbook</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-black text-teal-deep text-left border-b border-teal-deep/5 pb-2">Diwali Box Catalogue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {diwaliProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setIsSubmitted(false);
                  setFormData({ name: "", email: "", phone: "", company: "", quantity: "50-100", details: "" });
                }}
                className="group bg-white border border-teal-deep/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-[450px]"
              >
                {/* Photo Page thumbnail */}
                <div className="relative h-60 bg-teal-deep/5 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`/images/diwali-catalog/page_${p.photoPage}.png`} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-teal-deep/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/95 text-teal-deep font-bold text-xs px-4 py-2 rounded-full shadow-md flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Sparkles className="w-3.5 h-3.5 text-saffron" />
                      <span>View Inclusions & Price</span>
                    </span>
                  </div>
                </div>

                {/* Details info */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-saffron uppercase tracking-widest font-mono">Starts at</span>
                    <div className="flex justify-between items-center">
                      <h3 className="font-heading text-lg font-black text-teal-deep group-hover:text-rani-pink transition-colors">
                        {p.name}
                      </h3>
                      <span className="font-heading font-black text-teal-deep">₹{p.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic font-light line-clamp-2">
                      {p.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-teal-deep/5 mt-auto">
                    <span className="text-[9px] font-bold text-teal-deep/40 uppercase">Catalogue Photo Page {p.photoPage}</span>
                    <ChevronRight className="w-4 h-4 text-teal-deep/40 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Catalog Modal Overlay */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute inset-0 bg-teal-deep/80 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="bg-[#faf4e7] border border-teal-deep/15 w-full max-w-5xl rounded-[36px] overflow-hidden shadow-2xl relative z-10 grid grid-cols-1 lg:grid-cols-12 max-h-[92vh]"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-5 right-5 p-2 bg-white/20 hover:bg-white/30 text-teal-deep rounded-full transition-colors z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left Side: Product Photos Page (No details brochure page screenshot here!) */}
                <div className="lg:col-span-6 bg-white p-6 sm:p-10 flex flex-col justify-center items-center border-r border-teal-deep/10 max-h-[92vh] overflow-hidden">
                  <div className="w-full h-full relative group rounded-2xl overflow-hidden shadow-md aspect-[1/1.2]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`/images/diwali-catalog/page_${selectedProduct.photoPage}.png`} 
                      alt={`${selectedProduct.name} Showcase`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-3 right-3 bg-teal-deep/70 backdrop-blur-sm text-[8px] font-mono text-white px-2.5 py-1 rounded-md">
                      Brochure Plate {selectedProduct.photoPage}
                    </div>
                  </div>
                </div>

                {/* Right Side: Extracted Specifications, Inclusions & Inquiry Form */}
                <div className="lg:col-span-6 p-6 sm:p-10 overflow-y-auto max-h-[92vh] flex flex-col justify-between text-left space-y-6">
                  <div className="space-y-6">
                    {/* Native Header */}
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-widest font-black uppercase text-saffron bg-saffron/10 px-3 py-1 rounded-full inline-block border border-saffron/20">
                        Extracted Spec Sheet
                      </span>
                      <h2 className="font-heading text-3xl font-black text-teal-deep leading-none">{selectedProduct.name}</h2>
                      <p className="text-xs text-rani-pink font-semibold">{selectedProduct.tagline}</p>
                    </div>

                    {/* Extracted Description / Story */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-teal-deep/45 uppercase tracking-widest">Story & Details</span>
                      <p className="text-xs text-slate-650 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {/* Extracted Inclusions */}
                    <div className="space-y-2.5">
                      <span className="text-[9px] font-black text-teal-deep/45 uppercase tracking-widest">Hamper Inclusions</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/70 border border-teal-deep/5 p-4 rounded-2xl">
                        {selectedProduct.inclusions.map((inc: string, i: number) => (
                          <div key={i} className="flex items-start space-x-1.5 text-xs text-teal-deep/80 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-saffron mt-0.5 flex-shrink-0" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Extracted Price Tiers & Weights */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-teal-deep/45 uppercase tracking-widest">Pricing & Weights</span>
                      <div className="space-y-2 bg-[#FCFAF2]/60 border border-teal-deep/5 p-4 rounded-xl">
                        {selectedProduct.variants.map((v: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs border-b border-teal-deep/5 pb-1.5 last:border-b-0 last:pb-0">
                            <span className="font-bold text-teal-deep/80">{v.name}</span>
                            <span className="font-heading font-black text-saffron">₹{v.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Inquiry Form */}
                    <div className="border-t border-teal-deep/5 pt-6 space-y-4">
                      <span className="text-[10px] font-black text-saffron uppercase tracking-widest block">Quick Bulk Inquiry</span>
                      
                      <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                          <form onSubmit={handleInquirySubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="text"
                                required
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
                              />
                              <input 
                                type="text"
                                required
                                placeholder="Company / Family"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="email"
                                required
                                placeholder="Work Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
                              />
                              <input 
                                type="tel"
                                required
                                placeholder="Phone (WhatsApp)"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3 items-center">
                              <label className="text-[10px] font-bold text-teal-deep/60">Estimated Qty:</label>
                              <select 
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full bg-white border border-teal-deep/15 rounded-xl px-2 py-1.5 text-xs focus:outline-none text-teal-deep"
                              >
                                <option value="30-50">30 to 50 boxes</option>
                                <option value="50-100">50 to 100 boxes</option>
                                <option value="100-300">100 to 300 boxes</option>
                                <option value="300+">300+ boxes</option>
                              </select>
                            </div>
                            <textarea 
                              rows={2}
                              placeholder="Any custom instructions or modifications..."
                              value={formData.details}
                              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                              className="w-full bg-white border border-teal-deep/15 rounded-2xl px-3 py-2 text-xs focus:outline-none resize-none"
                            />
                            <button 
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3 bg-teal-deep hover:bg-teal-deep/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow"
                            >
                              {isSubmitting ? "Logging Inquiry..." : "Log Diwali Box Inquiry"}
                            </button>
                          </form>
                        ) : (
                          <div className="text-center py-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                            <span className="font-bold text-xs text-emerald-800 block">Inquiry Submitted!</span>
                            <span className="text-[10px] text-emerald-700 leading-relaxed block max-w-xs mx-auto px-4">
                              We have registered your request for "{selectedProduct.name}". Our Diwali consultant will WhatsApp you shortly!
                            </span>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="pt-6 border-t border-teal-deep/5 flex justify-between items-center text-[10px] text-teal-deep/45">
                    <span>GST & Shipping extra</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedProduct(null)} 
                      className="text-rani-pink font-bold hover:underline"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* FAQs accordion */}
        <section className="max-w-4xl mx-auto space-y-8 text-left pt-12 border-t border-teal-deep/5">
          <h2 className="font-heading text-2xl md:text-3xl font-black text-teal-deep text-center">Diwali Gifting Queries</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isFaqActive = activeFaq === idx;
              return (
                <div key={idx} className="bg-white border border-teal-deep/5 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setActiveFaq(isFaqActive ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-teal-deep focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-teal-deep/30 transition-transform duration-300 ${isFaqActive ? "transform rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isFaqActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-teal-deep/5 bg-[#FCFAF2]/50 p-5 text-xs text-slate-600 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
