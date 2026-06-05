import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

type PageMetadataConfig = {
  title?: string;
  description?: string | null;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
};

function imageUrl(image?: string | null) {
  if (!image) return absoluteUrl(siteConfig.defaultOgImage);
  return image.startsWith("http") ? image : absoluteUrl(image);
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
}: PageMetadataConfig = {}): Metadata {
  const pageTitle = title || siteConfig.defaultTitle;
  const pageDescription = description || siteConfig.defaultDescription;
  const url = absoluteUrl(path);
  const images = [{ url: imageUrl(image) }];

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.siteName,
      images,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: images.map((item) => item.url),
    },
  };
}
