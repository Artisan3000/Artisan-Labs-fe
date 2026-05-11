import type { Metadata } from "next";
import { shopifyClient } from "@/lib/shopify";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductDetails from "@/components/ProductDetails";
import ProductRecommendations from "@/components/ProductRecommendations";
import ProductReviews from "@/components/ProductReviews";
import { mockReviewsByProductHandle } from "@/lib/mockReviews";
import Image from "next/image";

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
    return {
      title: "Product Not Found | Artisan Barber",
    };
  }

  const title = product.seo?.title || product.title;
  const description = product.seo?.description || product.description;

  return {
    title: `${title} | Artisan Barber`,
    description,
    openGraph: {
      title,
      description,
      images: product.featuredImage
        ? [{ url: product.featuredImage.url }]
        : undefined,
    },
  };
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
    return <p>Product not found</p>;
  }

  const product: Product = normalizeProduct(rawProduct);
  const mockReviews = mockReviewsByProductHandle[handle] ?? [];

  return (
    <>
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
