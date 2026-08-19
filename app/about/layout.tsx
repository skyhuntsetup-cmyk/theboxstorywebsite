import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | The Box Story",
  description: "Learn about The Box Story's mission to turn gifting into a meaningful, curated experience — our values, craftsmanship, and story.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
