import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personalized & Custom Gifts | The Box Story",
  description: "Engraved, monogrammed, and personalized keepsakes — build a one-of-a-kind gift with The Box Story.",
};

export default function CustomGiftsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
