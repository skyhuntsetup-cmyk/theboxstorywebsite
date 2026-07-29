import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { GiftProvider } from "./context/GiftContext";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/CartDrawer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "The Box Story | Premium Gifting & Celebration Hampers",
  description: "Exquisite pre-curated collections, AI-powered gift matchers, and custom build-a-box hamper designs for weddings, corporate gifting, and celebrations.",
  keywords: "gifting, hampers, premium gifts, custom hampers, Diwali gifts, corporate gifting, The Box Story",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-teal-deep selection:bg-rani-pink selection:text-white cultural-pattern">
        <GiftProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1 pt-24">{children}</main>
          {/* Footer */}
          <footer className="bg-teal-deep text-[#FAF4E8] py-12 px-6 mt-20 border-t border-teal-deep/20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <span className="font-heading text-2xl font-bold">The Box Story</span>
                <p className="text-sm text-[#FAF4E8]/70 leading-relaxed">
                  Crafting sensory gifting experiences. Premium custom boxes designed to show thoughtfulness, celebration, and love.
                </p>
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold mb-4">Curations</h4>
                <ul className="space-y-2 text-sm text-[#FAF4E8]/70">
                  <li><a href="/collections/diwali" className="hover:text-rani-pink transition-colors">Diwali Collection</a></li>
                  <li><a href="/collections" className="hover:text-rani-pink transition-colors">Corporate Gifting</a></li>
                  <li><a href="/collections" className="hover:text-rani-pink transition-colors">Bridal & Weddings</a></li>
                  <li><a href="/build" className="hover:text-rani-pink transition-colors">Build Your Box</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold mb-4">Gifting AI</h4>
                <ul className="space-y-2 text-sm text-[#FAF4E8]/70">
                  <li><a href="/gift-genie" className="hover:text-rani-pink transition-colors">Gift Genie Suggestor</a></li>
                  <li><a href="/claim-gift" className="hover:text-rani-pink transition-colors">Claim Digital Gift Link</a></li>
                  <li><a href="/corporate" className="hover:text-rani-pink transition-colors">Bulk Ordering</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold mb-4">Contact</h4>
                <p className="text-sm text-[#FAF4E8]/70 leading-relaxed">
                  sayhi@theboxstory.co.in<br />
                  +91 78387 83488<br />
                  New Delhi, India
                </p>
              </div>
            </div>
            <div className="max-w-6xl mx-auto border-t border-[#FAF4E8]/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#FAF4E8]/50">
              <p>© {new Date().getFullYear()} The Box Story. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 sm:mt-0">
                <span className="hover:text-[#FAF4E8] cursor-pointer">Privacy Policy</span>
                <span className="hover:text-[#FAF4E8] cursor-pointer">Terms of Service</span>
              </div>
            </div>
          </footer>
        </GiftProvider>
      </body>
    </html>
  );
}
