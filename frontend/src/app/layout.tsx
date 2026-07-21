import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import SiteWidget from "@/components/SiteWidget";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.defaultDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    url: absoluteUrl("/"),
    siteName: siteConfig.siteName,
    images: [{ url: absoluteUrl(siteConfig.defaultOgImage) }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BarberShop",
        "@id": `${absoluteUrl("/")}#business`,
        name: siteConfig.siteName,
        url: absoluteUrl("/"),
        telephone: "+1-833-750-2760",
        image: absoluteUrl(siteConfig.defaultOgImage),
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "331 East 81st Street",
          addressLocality: "New York",
          addressRegion: "NY",
          postalCode: "10028",
          addressCountry: "US",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "11:00",
            closes: "19:00",
          },
        ],
        sameAs: [
          "https://www.instagram.com/artisanbarber/",
          "https://www.tiktok.com/@artisanbarber2017/",
          "https://www.youtube.com/@ARTISANBARBER",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: siteConfig.siteName,
        url: absoluteUrl("/"),
        publisher: { "@id": `${absoluteUrl("/")}#business` },
      },
    ],
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <CartProvider>
          {children}
          <SiteWidget />
        </CartProvider>
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        />
      </body>
    </html>
  );
}
