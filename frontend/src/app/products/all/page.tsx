import Link from "next/link";
import Image from "next/image";
import { shopifyClient } from "@/lib/shopify";
import styles from "./page.module.css";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  id: string;
  title: string;
  handle: string;
  createdAt: string;
  featuredImage: {
    url: string;
    altText: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    nodes: {
      id: string;
    }[];
  };
};

export default async function ShopPage({ searchParams }: { searchParams: { after?: string } }) {

  const { data, errors } = await shopifyClient.request<{
    products: { nodes: Product[], pageInfo: { hasNextPage: boolean, endCursor: string } };
  }>(
    `
      query ShopProducts($after: String) {
        products(first: 20, sortKey: CREATED_AT, reverse: true, after: $after) {
          nodes {
            id
            title
            handle
            createdAt
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              nodes {
                id
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    {
      variables: {
        after: searchParams.after || null,
      }
    }
  );

  const products: Product[] = data?.products?.nodes ?? [];
  const pageInfo = data?.products?.pageInfo;

  return (
    <main className={styles.main}>
        <div className={styles.shopRef}>
            <div className={styles.shopRefHeadings}>
                <div><h1>Sort</h1></div>
                <div><h1>Filter</h1></div>
            </div>
            <div className={styles.shopRefContent}>
                <div className={styles.shopRefContentGroup}>
                    <div>Latest Arrivals</div>
                    <div>Price: High to Low</div>
                    <div>Price: Low to High</div>
                </div>
                <div className={styles.shopRefContentGroup}>
                    <div>Clothing</div>
                    <div>Tools</div>
                    <div>Grooming</div>
                </div>
            </div>
        </div>
        
      <h1 className={styles.heading}>Latest</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className={styles.list}>
          {products.map((p) => (
            <li key={p.id} className={styles.item}>
              <Link href={`/products/${p.handle}`} className={styles.link}>
                {p.featuredImage && (
                  <Image
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText}
                    width={300}
                    height={300}
                    className={styles.image}
                  />
                )}
                <h2 className={styles.title}>{p.title}</h2>
                <p className={styles.price}>
                  ${p.priceRange.minVariantPrice.amount}
                </p>
              </Link>
              <AddToCartButton variantId={p.variants.nodes[0].id} />
            </li>
          ))}
        </ul>
      )}
      {pageInfo?.hasNextPage && (
        <Link href={`/shop?after=${pageInfo.endCursor}`} className={styles.link}>
          <p className={styles.loadMore}>Load more</p>
        </Link>
      )}
      <div>
        <h1>The Artisan Barber Store is the creative extension of our craft. Beyond the chair, we develop limited-run products in grooming, apparel, and lifestyle goods that reflect our values of quality, style, and care. Each release is something we believe in—pieces we’d personally use and want to share with our community. It’s our way of bringing the spirit of Artisan Barber into everyday life, offering tangible expressions of our culture and vision.</h1>
      </div>
    </main>
  );
}