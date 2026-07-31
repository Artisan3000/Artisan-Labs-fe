import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { businessConfig } from "@/lib/businessConfig";

export const metadata: Metadata = buildPageMetadata({
  title: "About Our Upper East Side Barbershop Since 2017",
  description: `Discover Artisan Barber's story, from its 2017 New York founding to its current Upper East Side shop at ${businessConfig.address.street}.`,
  path: "/about",
});

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
