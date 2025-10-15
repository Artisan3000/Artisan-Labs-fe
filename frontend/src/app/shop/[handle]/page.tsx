import Link from "next/link";
import Image from "next/image";
import { shopifyClient } from "@/lib/shopify";
import styles from "../page.module.css";
import AddToCartButton from "@/components/AddToCartButton";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ShopControls from "@/components/ShopSorting";

type Product = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  images: { nodes: { url: string; altText: string | null }[] };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      price: { amount: string };
      compareAtPrice?: { amount: string } | null;
    }[];
  };
};

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { after?: string; sort?: string };
}) {
  const { handle } = params;
  const sortParam = (searchParams.sort || "LATEST").toUpperCase();

  // Map URL sort → Shopify sortKey + reverse
  // For collection.products, sortKey is ProductCollectionSortKeys (common values below)
  type SortConfig = { sortKey: "CREATED" | "PRICE" | "TITLE" | "BEST_SELLING" | "UPDATED" | "ID" | "MANUAL" | "COLLECTION_DEFAULT"; reverse: boolean };
  const sortMap: Record<string, SortConfig> = {
    LATEST: { sortKey: "CREATED", reverse: true },
    OLDEST: { sortKey: "CREATED", reverse: false },
    PRICE_HIGH: { sortKey: "PRICE", reverse: true },
    PRICE_LOW: { sortKey: "PRICE", reverse: false },
    ALPHA: { sortKey: "TITLE", reverse: false },
  };
  const { sortKey, reverse } = sortMap[sortParam] || sortMap.LATEST;

  const { data } = await shopifyClient.request<{
    collection: {
      title: string;
      description: string;
      products: {
        nodes: Product[];
        pageInfo: { hasNextPage: boolean; endCursor: string };
      };
    } | null;
  }>(
    `
    query CollectionByHandle($handle: String!, $after: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
      collection(handle: $handle) {
        title
        description
        products(first: 20, after: $after, sortKey: $sortKey, reverse: $reverse) {
          nodes {
            id
            title
            handle
            vendor
            images(first: 2) {
              nodes { url altText }
            }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) {
              nodes {
                id
                availableForSale
                price { amount }
                compareAtPrice { amount }
              }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
    `,
    {
      variables: {
        handle,
        after: searchParams.after || null,
        sortKey,
        reverse,
      },
    }
  );

  const collection = data?.collection;
  const products = collection?.products?.nodes ?? [];
  const pageInfo = collection?.products?.pageInfo;

  if (!collection) return <p>Collection not found.</p>;

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <ShopControls />

        <h1 className={styles.heading}>{collection.title}</h1>
        {collection.description && (
          <p
            className={styles.collectionDescription}
            dangerouslySetInnerHTML={{ __html: collection.description }}
          />
        )}

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
                        <span className={styles.priceCompare}>${compareAt}</span>
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
                  <AddToCartButton variantId={variant.id} disabled={!isAvailable} />
                </li>
              );
            })}
          </ul>
        )}

        {pageInfo?.hasNextPage && (
          <Link
            href={`/shop/${handle}?after=${pageInfo.endCursor}&sort=${sortParam}`}
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
