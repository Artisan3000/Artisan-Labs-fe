import type { MetadataRoute } from "next";
import { SHOPIFY_STOREFRONT_API_VERSION } from "@/lib/shopifyApiVersion";
import { absoluteUrl } from "@/lib/siteConfig";

const ARTICLE_BLOG_HANDLES = [
  "grooming",
  "local",
  "journal",
  "team",
  "lifestyle",
  "learn",
];

type ShopifyResponse<T> = {
  data?: T;
  errors?: unknown;
};

type ShopifyPageInfo = {
  hasNextPage: boolean;
  endCursor?: string | null;
};

type ShopifyConnection<T> = {
  nodes?: T[];
  pageInfo: ShopifyPageInfo;
};

type ShopifyProductNode = {
  handle: string;
  updatedAt?: string | null;
};

type ShopifyCollectionNode = {
  handle: string;
  updatedAt?: string | null;
};

type ShopifyArticleNode = {
  handle: string;
  publishedAt?: string | null;
};

type ShopifyBlogArticles = {
  articles?: ShopifyConnection<ShopifyArticleNode> | null;
};

type ShopifyProductsResponse = {
  products?: ShopifyConnection<ShopifyProductNode> | null;
};

type ShopifyCollectionsResponse = {
  collections?: ShopifyConnection<ShopifyCollectionNode> | null;
};

type ShopifyBlogResponse = {
  blog?: ShopifyBlogArticles | null;
};

function cleanStoreDomain(domain: string) {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

async function shopifyRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

  if (!storeDomain || !token) return null;

  try {
    const response = await fetch(
      `https://${cleanStoreDomain(
        storeDomain
      )}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return null;

    const result = (await response.json()) as ShopifyResponse<T>;

    if (result.errors) return null;

    return result.data ?? null;
  } catch (error) {
    console.error("Sitemap Shopify request failed:", error);
    return null;
  }
}

function sitemapEntry(
  path: string,
  lastModified?: string | null
): MetadataRoute.Sitemap[number] {
  const entry: MetadataRoute.Sitemap[number] = { url: absoluteUrl(path) };

  if (lastModified) entry.lastModified = new Date(lastModified);

  return entry;
}

async function getProductEntries() {
  const entries: MetadataRoute.Sitemap = [];
  let after: string | null = null;

  do {
    const data: ShopifyProductsResponse | null =
      await shopifyRequest<ShopifyProductsResponse>(
        `
          query SitemapProducts($after: String) {
            products(
              first: 250
              after: $after
              sortKey: UPDATED_AT
              reverse: true
            ) {
              nodes {
                handle
                updatedAt
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        { after }
      );

    const connection: ShopifyConnection<ShopifyProductNode> | null | undefined =
      data?.products;
    if (!connection) break;

    entries.push(
      ...(connection.nodes ?? []).map((product) =>
        sitemapEntry(`/products/${product.handle}`, product.updatedAt)
      )
    );

    after = connection.pageInfo.hasNextPage
      ? connection.pageInfo.endCursor ?? null
      : null;
  } while (after);

  return entries;
}

async function getCollectionEntries() {
  const entries: MetadataRoute.Sitemap = [];
  let after: string | null = null;

  do {
    const data: ShopifyCollectionsResponse | null =
      await shopifyRequest<ShopifyCollectionsResponse>(
        `
          query SitemapCollections($after: String) {
            collections(first: 250, after: $after) {
              nodes {
                handle
                updatedAt
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        { after }
      );

    const connection:
      | ShopifyConnection<ShopifyCollectionNode>
      | null
      | undefined = data?.collections;
    if (!connection) break;

    entries.push(
      ...(connection.nodes ?? []).map((collection) =>
        sitemapEntry(`/shop/${collection.handle}`, collection.updatedAt)
      )
    );

    after = connection.pageInfo.hasNextPage
      ? connection.pageInfo.endCursor ?? null
      : null;
  } while (after);

  return entries;
}

async function getBlogArticleEntries(blogHandle: string) {
  const entries: MetadataRoute.Sitemap = [];
  let after: string | null = null;

  do {
    const data: ShopifyBlogResponse | null =
      await shopifyRequest<ShopifyBlogResponse>(
        `
          query SitemapArticles($blogHandle: String!, $after: String) {
            blog(handle: $blogHandle) {
              articles(
                first: 250
                after: $after
                sortKey: PUBLISHED_AT
                reverse: true
              ) {
                nodes {
                  handle
                  publishedAt
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        `,
        { blogHandle, after }
      );

    const connection:
      | ShopifyConnection<ShopifyArticleNode>
      | null
      | undefined = data?.blog?.articles;
    if (!connection) break;

    entries.push(
      ...(connection.nodes ?? []).map((article) =>
        sitemapEntry(
          `/read/${article.handle}`,
          article.publishedAt
        )
      )
    );

    after = connection.pageInfo.hasNextPage
      ? connection.pageInfo.endCursor ?? null
      : null;
  } while (after);

  return entries;
}

async function getArticleEntries() {
  const entries = await Promise.all(
    ARTICLE_BLOG_HANDLES.map(getBlogArticleEntries)
  );

  return entries.flat();
}

function dedupeEntries(entries: MetadataRoute.Sitemap) {
  return Array.from(
    entries
      .reduce((map, entry) => {
        if (!map.has(entry.url)) map.set(entry.url, entry);
        return map;
      }, new Map<string, MetadataRoute.Sitemap[number]>())
      .values()
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = [
    sitemapEntry("/"),
    sitemapEntry("/about"),
    sitemapEntry("/about/gallery"),
    sitemapEntry("/careers"),
    sitemapEntry("/team"),
    sitemapEntry("/policy"),
    sitemapEntry("/read"),
    sitemapEntry("/services"),
    sitemapEntry("/shop"),
  ];

  const [productEntries, collectionEntries, articleEntries] = await Promise.all(
    [getProductEntries(), getCollectionEntries(), getArticleEntries()]
  );

  return dedupeEntries([
    ...staticEntries,
    ...productEntries,
    ...collectionEntries,
    ...articleEntries,
  ]);
}
