import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Team",
  description:
    "Meet the Artisan Barber team of master barbers, stylists, and creative staff in New York City.",
  path: "/team",
});

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
