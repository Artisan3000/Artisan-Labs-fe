import type { Metadata } from "next";
import { shopifyClient } from "@/lib/shopify";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductDetails from "@/components/ProductDetails";
import ProductRecommendations from "@/components/ProductRecommendations";
import ProductReviews from "@/components/ProductReviews";
import { mockReviewsByProductHandle } from "@/lib/mockReviews";
import { buildPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/siteConfig";
import { buildBreadcrumbJsonLd } from "@/lib/structuredData";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  ShopifyProduct,
  normalizeProduct,
  Product,
} from "@/lib/transformers/product";

type ProductMetadata = {
  title: string;
  description: string;
  featuredImage?: {
    url: string;
  } | null;
  seo?: {
    title: string | null;
    description: string | null;
  } | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;

  const { data } = await shopifyClient.request<{
    product: ProductMetadata | null;
  }>(
    `
      query ProductMetadata($handle: String!) {
        product(handle: $handle) {
          title
          description
          featuredImage {
            url
          }
          seo {
            title
            description
          }
        }
      }
    `,
    { variables: { handle } }
  );

  const product = data?.product;

  if (!product) {
    return buildPageMetadata({
      title: "Product Not Found",
      path: `/products/${handle}`,
    });
  }

  const title = product.seo?.title || product.title;
  const description = product.seo?.description || product.description;

  return buildPageMetadata({
    title,
    description,
    path: `/products/${handle}`,
    image: product.featuredImage?.url,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const { data } = await shopifyClient.request<{
    product: ShopifyProduct | null;
  }>(
    `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        vendor
        descriptionHtml
        options { name values }
        images(first: 10) {
          edges { node { url altText } }
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions { name value }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
    `,
    { variables: { handle } }
  );

  const rawProduct = data?.product;

  if (!rawProduct) {
    notFound();
  }

  const product: Product = normalizeProduct(rawProduct);
  const mockReviews = mockReviewsByProductHandle[handle] ?? [];
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.descriptionHtml.replace(/<[^>]*>/g, " ").trim(),
    image: product.images.map((image) => image.url),
    brand: { "@type": "Brand", name: product.vendor },
    url: absoluteUrl(`/products/${handle}`),
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      price: variant.price.amount,
      priceCurrency: variant.price.currencyCode,
      availability: variant.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/products/${handle}`),
    })),
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: product.title, path: `/products/${handle}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navigation />

      <main className={styles.main}>
        <div className={styles.productContainer}>
          <div>
            <div className={styles.imageGallery}>
              {product.images.map((img) => (
                <Image
                  key={img.url}
                  src={img.url}
                  alt={img.altText || product.title}
                  width={600}
                  height={600}
                  className={styles.image}
                />
              ))}
            </div>
          </div>

          <div className={styles.productInfo}>
            <ProductDetails
              product={product}
              variants={product.variants}
            />
          </div>
        </div>
        <br />
        <br />

        {mockReviews.length > 0 && (
          <div className={styles.productPref}>
            <div>
              <h1>Ratings & Reviews</h1>
              <ProductReviews reviews={mockReviews} />
            </div>
          </div>
        )}

        <div className={styles.productRecs}>
          <ProductRecommendations productId={product.id} />
        </div>
      </main>

      <Footer />
    </>
  );
}
