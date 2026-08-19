import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Curated Gift Collections | The Box Story",
  description: "Browse ready-to-ship premium hampers for every occasion — Diwali, weddings, anniversaries, and more, curated by The Box Story.",
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
