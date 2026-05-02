import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import SiteWidget from "@/components/SiteWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artisan Barber",
  description: "A barbershop located in the Upper East Side of Manhattan, New York City.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CartProvider>
          {children}
          <SiteWidget />
        </CartProvider>
      </body>
    </html>
  );
}
