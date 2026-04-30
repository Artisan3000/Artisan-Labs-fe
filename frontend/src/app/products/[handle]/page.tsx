import { shopifyClient } from "@/lib/shopify";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductDetails from "@/components/ProductDetails";
import ProductRecommendations from "@/components/ProductRecommendations";
import ProductReviews from "@/components/ProductReviews";
import Image from "next/image";

import {
  ShopifyProduct,
  normalizeProduct,
  Product,
} from "@/lib/transformers/product";

type Review = {
  name: string;
  rating: number;
  comment: string;
};

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

  const mockReviews: Review[] = [
    {
      name: "Camila",
      rating: 5,
      comment:
        "Amazing quality and color. The fit is perfect — definitely worth it!",
    },
    {
      name: "Jonas",
      rating: 4,
      comment:
        "Really nice material. Slightly oversized, but looks great overall.",
    },
    {
      name: "Zoe",
      rating: 5,
      comment: "Bought this at the concert — nostalgia overload!",
    },
  ];

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

        <div className={styles.productPref}>
          <div>
            <h1>Ratings & Reviews</h1>
            <ProductReviews reviews={mockReviews} />
          </div>
        </div>

        <div className={styles.productRecs}>
          <ProductRecommendations productId={product.id} />
        </div>
      </main>

      <Footer />
    </>
  );
}