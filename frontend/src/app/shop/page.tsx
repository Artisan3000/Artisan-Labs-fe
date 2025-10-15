import Link from "next/link";
import Image from "next/image";
import { shopifyClient } from "@/lib/shopify";
import styles from "./page.module.css";
import AddToCartButton from "@/components/AddToCartButton";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type Product = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  createdAt: string;
  images: {
    nodes: {
      url: string;
      altText: string | null;
    }[];
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
      availableForSale: boolean;
      price: {
        amount: string;
      };
      compareAtPrice?: {
        amount: string;
      } | null;
    }[];
  };
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ after?: string }>;
}) {
  const params = await searchParams;

  const { data } = await shopifyClient.request<{
    products: {
      nodes: Product[];
      pageInfo: { hasNextPage: boolean; endCursor: string };
    };
  }>(
    `
      query ShopProducts($after: String) {
        products(first: 20, sortKey: CREATED_AT, reverse: true, after: $after) {
          nodes {
            id
            title
            handle
            vendor
            createdAt
            images(first: 2) {
              nodes {
                url
                altText
              }
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
                availableForSale
                price {
                  amount
                }
                compareAtPrice {
                  amount
                }
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
        after: params.after || null,
      },
    }
  );

  const products: Product[] = data?.products?.nodes ?? [];
  const pageInfo = data?.products?.pageInfo;

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.shopSettings}>
          <div className={styles.shopSettingsCat}>
            <h1>Category</h1>
            <Link href="/shop/all">All</Link>
            <Link href="/shop/wardrobe">Clothing</Link>
            <Link href="/shop/tools">Tools</Link>
            <Link href="/shop/grooming">Grooming</Link>
            <Link href="/shop/sale">Sale</Link>
          </div>
          <div className={styles.shopSettingsCol}>
            <h1>Collections</h1>
            <Link href="/shop/duke-hyde">Duke & Hyde</Link>
            <Link href="/shop/artisan-barber">Artisan Merch</Link>
            <Link href="/shop/vintage">Vintage</Link>
            <Link href="/shop/jewelry">Jewelry</Link>
            <Link href="/shop/sale">Sale</Link>
          </div>

        </div>
        <h1 className={styles.heading}>Latest</h1>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul className={styles.list}>
            {products.map((p) => {
              const variant = p.variants.nodes[0];
              const price = parseFloat(variant.price.amount).toFixed(2);
              const compareAt = variant.compareAtPrice
                ? parseFloat(variant.compareAtPrice.amount).toFixed(2)
                : null;
              const isAvailable = variant.availableForSale;

              const firstImage = p.images.nodes[0];
              const secondImage = p.images.nodes[1];

              return (
                <li key={p.id} className={styles.item}>
                  <Link href={`/products/${p.handle}`} className={styles.link}>
                    {firstImage && (
                      <div className={styles.imageWrapper}>
                        <Image
                          src={firstImage.url}
                          alt={firstImage.altText || p.title}
                          fill
                          className={styles.image}
                        />
                        <Image
                          src={(secondImage || firstImage).url}
                          alt={(secondImage || firstImage).altText || p.title}
                          fill
                          className={`${styles.image} ${styles.hoverImage}`}
                        />
                      </div>
                    )}
                    <h2 className={styles.title}>{p.title}</h2>
                    <p className={styles.vendor}>{p.vendor}</p>

                    <p
                      className={
                        !isAvailable
                          ? styles.priceSoldOut
                          : compareAt
                          ? styles.priceDiscounted
                          : styles.price
                      }
                    >
                      {compareAt && (
                        <span className={styles.priceCompare}>
                          ${compareAt}
                        </span>
                      )}
                      <span
                        className={
                          compareAt
                            ? styles.priceNew
                            : isAvailable
                            ? styles.price
                            : styles.priceSoldOut
                        }
                      >
                        ${price}
                        {!isAvailable && " (Sold Out)"}
                      </span>
                    </p>
                  </Link>

                  <AddToCartButton
                    variantId={variant.id}
                    disabled={!isAvailable}
                  />
                </li>
              );
            })}
          </ul>
        )}
        {pageInfo?.hasNextPage && (
          <Link
            href={`/shop?after=${pageInfo.endCursor}`}
            className={styles.link}
          >
            <p className={styles.loadMore}>Load more</p>
          </Link>
        )}
        <div>
          <h1>
            The Artisan Barber Store is the creative extension of our craft.
            Beyond the chair, we develop limited-run products in grooming,
            apparel, and lifestyle goods that reflect our values of quality,
            style, and care. Each release is something we believe in—pieces we’d
            personally use and want to share with our community. It’s our way of
            bringing the spirit of Artisan Barber into everyday life, offering
            tangible expressions of our culture and vision.
          </h1>
        </div>
      </main>
      <Footer />
    </>
  );
}
