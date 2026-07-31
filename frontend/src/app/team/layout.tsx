import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Our Upper East Side Barbers & Stylists",
  description:
    "Meet Artisan Barber's Upper East Side team, including specialists in fades, scissor cuts, curly hair, children's cuts, and precision styling.",
  path: "/team",
});

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
