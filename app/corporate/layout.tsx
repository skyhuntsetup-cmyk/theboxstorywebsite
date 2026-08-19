import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Gifting Solutions | The Box Story",
  description: "Bulk corporate gifting, branded employee kits, and automated address-collection portals for onboarding, appreciation, and festive campaigns.",
};

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
