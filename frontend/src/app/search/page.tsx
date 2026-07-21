import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { shopifyClient } from "@/lib/shopify";
import styles from "./page.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Search",
  description:
    "Search Artisan Barber articles, grooming goods, and shop products.",
  path: "/search",
  robots: {
    index: false,
    follow: true,
  },
});

const blogHandles = [
  "grooming",
  "local",
  "journal",
  "team",
  "lifestyle",
  "learn",
];

type ProductResult = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  description: string;
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
};

type ArticleNode = {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  publishedAt: string;
  image?: {
    url: string;
    altText: string | null;
  } | null;
};

type ArticleResult = ArticleNode & {
  source: string;
};

type SearchResults = {
  products: ProductResult[];
  articles: ArticleResult[];
  productError: boolean;
  articleError: boolean;
};

type ShopifyBlog = {
  title: string;
  articles: {
    nodes: ArticleNode[];
  };
};

function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, " ");
}

function matchesQuery(value: string | null | undefined, terms: string[]) {
  const normalizedValue = (value ?? "").toLowerCase();
  return terms.some((term) => normalizedValue.includes(term));
}

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

async function getProductResults(query: string) {
  const { data, errors } = await shopifyClient.request<{
    products: {
      nodes: ProductResult[];
    };
  }>(
    `
      query SearchProducts($query: String!) {
        products(first: 12, query: $query, sortKey: RELEVANCE) {
          nodes {
            id
            title
            handle
            vendor
            description
            images(first: 1) {
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
          }
        }
      }
    `,
    { variables: { query } }
  );

  if (errors) throw new Error("Product search failed");

  return data?.products?.nodes ?? [];
}

function articlesQuery() {
  const blogQueries = blogHandles
    .map(
      (blogHandle, index) => `
        blog${index}: blog(handle: "${blogHandle}") {
          title
          articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {
            nodes {
              id
              title
              handle
              excerpt
              publishedAt
              image {
                url
                altText
              }
            }
          }
        }
      `
    )
    .join("\n");

  return `
    query SearchArticles {
      ${blogQueries}
    }
  `;
}

async function getArticleResults(query: string) {
  const terms = query.toLowerCase().split(" ").filter(Boolean);
  const { data, errors } = await shopifyClient.request<
    Record<string, ShopifyBlog | null>
  >(articlesQuery());

  if (errors) throw new Error("Article search failed");

  const articles = Object.values(data ?? {})
    .flatMap((blog) =>
      (blog?.articles?.nodes ?? []).map((article) => ({
        ...article,
        source: blog?.title ?? "Read",
      }))
    )
    .filter((article) =>
      [article.title, article.excerpt, article.source].some((value) =>
        matchesQuery(value, terms)
      )
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );

  return articles.slice(0, 12);
}

async function getSearchResults(query: string): Promise<SearchResults> {
  const [productResponse, articleResponse] = await Promise.allSettled([
    getProductResults(query),
    getArticleResults(query),
  ]);

  return {
    products:
      productResponse.status === "fulfilled" ? productResponse.value : [],
    articles:
      articleResponse.status === "fulfilled" ? articleResponse.value : [],
    productError: productResponse.status === "rejected",
    articleError: articleResponse.status === "rejected",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = normalizeQuery(params.q ?? "");
  const hasQuery = query.length > 0;
  const results = hasQuery
    ? await getSearchResults(query)
    : {
        products: [],
        articles: [],
        productError: false,
        articleError: false,
      };
  const totalResults = results.products.length + results.articles.length;
  const bothFailed = results.productError && results.articleError;

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <header className={styles.header}>
          <p>Search</p>
          <h1>{hasQuery ? `Results for "${query}"` : "Search Artisan"}</h1>
          <span>
            {hasQuery
              ? `${totalResults} result${totalResults === 1 ? "" : "s"}`
              : "Use the search icon to find articles and products."}
          </span>
        </header>

        {!hasQuery && (
          <section className={styles.emptyState}>
            <h2>Search articles and products.</h2>
            <p>
              Open search from the navigation, type a grooming topic, product,
              or brand, and press Enter.
            </p>
          </section>
        )}

        {hasQuery && bothFailed && (
          <section className={styles.emptyState}>
            <h2>Search is unavailable right now.</h2>
            <p>Please try again in a moment.</p>
          </section>
        )}

        {hasQuery && !bothFailed && totalResults === 0 && (
          <section className={styles.emptyState}>
            <h2>No results for &ldquo;{query}&rdquo;.</h2>
            <p>Try a product, brand, service, or grooming topic.</p>
          </section>
        )}

        {hasQuery && !bothFailed && totalResults > 0 && (
          <div className={styles.results}>
            {results.articles.length > 0 && (
              <section className={styles.section}>
                <h2>Articles</h2>
                <div className={styles.grid}>
                  {results.articles.map((article) => (
                    <Link
                      href={`/read/${article.handle}`}
                      key={article.id}
                      className={styles.card}
                    >
                      <div className={styles.imageWrapper}>
                        {article.image ? (
                          <Image
                            src={article.image.url}
                            alt={article.image.altText || article.title}
                            fill
                            sizes="(max-width: 700px) 100vw, 33vw"
                            className={styles.image}
                          />
                        ) : (
                          <div className={styles.imageFallback}>
                            <span>{article.source}</span>
                          </div>
                        )}
                      </div>
                      <div className={styles.cardMeta}>
                        <div className={styles.topline}>
                          <span>{article.source}</span>
                          <time dateTime={article.publishedAt}>
                            {formatDate(article.publishedAt)}
                          </time>
                        </div>
                        <h3>{article.title}</h3>
                        {article.excerpt && <p>{article.excerpt}</p>}
                        <span className={styles.cardLink}>Read article</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.products.length > 0 && (
              <section className={styles.section}>
                <h2>Products</h2>
                <div className={styles.grid}>
                  {results.products.map((product) => {
                    const image = product.images.nodes[0];
                    const price = product.priceRange.minVariantPrice;

                    return (
                      <Link
                        href={`/products/${product.handle}`}
                        key={product.id}
                        className={styles.card}
                      >
                        <div className={styles.imageWrapper}>
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.altText || product.title}
                              fill
                              sizes="(max-width: 700px) 100vw, 33vw"
                              className={styles.image}
                            />
                          ) : (
                            <div className={styles.imageFallback}>
                              <span>{product.vendor}</span>
                            </div>
                          )}
                        </div>
                        <div className={styles.cardMeta}>
                          <div className={styles.topline}>
                            <span>{product.vendor}</span>
                            <span>
                              {formatMoney(price.amount, price.currencyCode)}
                            </span>
                          </div>
                          <h3>{product.title}</h3>
                          {product.description && <p>{product.description}</p>}
                          <span className={styles.cardLink}>View product</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {(results.productError || results.articleError) && (
              <p className={styles.partialError}>
                Some results could not be loaded. Please try again in a moment.
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
