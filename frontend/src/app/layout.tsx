import type { Metadata } from "next";
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
      <body>
        {children}
      </body>
    </html>
  );
}
