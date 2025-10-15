import { shopifyClient } from "@/lib/shopify";
import Link from "next/link";
import styles from "./styles.module.css";

type ProductRec = {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: { node: { url: string; altText: string | null } }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

export default async function ProductRecommendations({
  productId,
}: {
  productId: string;
}) {
  const { data } = await shopifyClient.request<{
    productRecommendations: ProductRec[];
  }>(
    `
    query ProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
        id
        title
        handle
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
    `,
    { variables: { productId } }
  );

  const recs = (data?.productRecommendations || []).slice(0, 4);

  if (!recs.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>You May Also Like</h2>
      <div className={styles.grid}>
        {recs.map((rec) => {
          const img = rec.images.edges[0]?.node;
          const { amount, currencyCode } = rec.priceRange.minVariantPrice;

          const price = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode,
          }).format(parseFloat(amount));

          return (
            <Link
              key={rec.id}
              href={`/products/${rec.handle}`}
              className={styles.card}
            >
              <img
                src={img?.url || "/placeholder.jpg"}
                alt={img?.altText || rec.title}
                className={styles.image}
              />
              <p className={styles.title}>{rec.title}</p>
              <p className={styles.price}>{price}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
