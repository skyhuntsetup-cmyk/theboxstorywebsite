import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kids Gifting Section | The Box Story",
  description: "Playful birthday gifts and party return favours for little ones, from The Box Story.",
};

export default function KidsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
