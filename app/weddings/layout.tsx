import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Favours & Gifting | The Box Story",
  description: "Royal heritage packaging, personalized wedding stationery, and curated favours for your big day, from The Box Story.",
};

export default function WeddingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
