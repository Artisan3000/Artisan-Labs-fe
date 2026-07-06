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

type ShopifyProductNode = {
  handle: string;
  updatedAt?: string | null;
};

type ShopifyCollectionNode = {
  handle: string;
};

type ShopifyArticleNode = {
  handle: string;
  publishedAt?: string | null;
};

type ShopifyBlogArticles = {
  articles?: {
    nodes?: ShopifyArticleNode[];
  } | null;
};

function cleanStoreDomain(domain: string) {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

async function shopifyRequest<T>(query: string): Promise<T | null> {
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
        body: JSON.stringify({ query }),
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
  return {
    url: absoluteUrl(path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
  };
}

async function getProductEntries() {
  const data = await shopifyRequest<{
    products?: {
      nodes?: ShopifyProductNode[];
    } | null;
  }>(`
    query SitemapProducts {
      products(first: 250, sortKey: UPDATED_AT, reverse: true) {
        nodes {
          handle
          updatedAt
        }
      }
    }
  `);

  return (data?.products?.nodes ?? []).map((product) =>
    sitemapEntry(`/products/${product.handle}`, product.updatedAt)
  );
}

async function getCollectionEntries() {
  const data = await shopifyRequest<{
    collections?: {
      nodes?: ShopifyCollectionNode[];
    } | null;
  }>(`
    query SitemapCollections {
      collections(first: 250) {
        nodes {
          handle
        }
      }
    }
  `);

  return (data?.collections?.nodes ?? []).map((collection) =>
    sitemapEntry(`/shop/${collection.handle}`)
  );
}

async function getArticleEntries() {
  const blogQueries = ARTICLE_BLOG_HANDLES.map(
    (handle, index) => `
      blog${index}: blog(handle: "${handle}") {
        articles(first: 250, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            handle
            publishedAt
          }
        }
      }
    `
  ).join("\n");

  const data = await shopifyRequest<Record<string, ShopifyBlogArticles | null>>(
    `
      query SitemapArticles {
        ${blogQueries}
      }
    `
  );

  return Object.values(data ?? {}).flatMap((blog) =>
    (blog?.articles?.nodes ?? []).map((article) =>
      sitemapEntry(`/read/${article.handle}`, article.publishedAt)
    )
  );
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
    sitemapEntry("/team"),
    sitemapEntry("/policy"),
    sitemapEntry("/read"),
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
