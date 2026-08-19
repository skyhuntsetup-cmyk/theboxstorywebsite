import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gifting Inspiration & Blog | The Box Story",
  description: "Ideas, guides, and inspiration for thoughtful gifting, from The Box Story's editorial team.",
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
