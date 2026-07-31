import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { buildPageMetadata } from "@/lib/metadata";
import { shopifyClient } from "@/lib/shopify";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import { buildBreadcrumbJsonLd } from "@/lib/structuredData";
import styles from "./page.module.css";

const blogHandles = [
  "grooming",
  "local",
  "journal",
  "team",
  "lifestyle",
  "learn",
];

type ShopifyArticle = {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  image?: {
    url: string;
    altText: string | null;
  } | null;
  authorV2?: {
    name: string;
  } | null;
  seo?: {
    title: string | null;
    description: string | null;
  } | null;
};

type ShopifyBlogArticle = {
  title: string;
  articleByHandle: ShopifyArticle | null;
};

type ArticleWithSource = ShopifyArticle & {
  source: string;
  sourceHandle: string;
};

type RecommendedArticle = {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  publishedAt: string;
  source: string;
  image?: {
    url: string;
    altText: string | null;
  } | null;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function articleQuery() {
  const blogQueries = blogHandles
    .map(
      (blogHandle, index) => `
        blog${index}: blog(handle: "${blogHandle}") {
          title
          articleByHandle(handle: $handle) {
            id
            title
            handle
            excerpt
            contentHtml
            publishedAt
            image {
              url
              altText
            }
            authorV2 {
              name
            }
            seo {
              title
              description
            }
          }
        }
      `
    )
    .join("\n");

  return `
    query ReadArticleByHandle($handle: String!) {
      ${blogQueries}
    }
  `;
}

async function getArticle(handle: string): Promise<ArticleWithSource | null> {
  const { data } = await shopifyClient.request<
    Record<string, ShopifyBlogArticle | null>
  >(articleQuery(), {
    variables: { handle },
  });

  const blogEntry = Object.entries(data ?? {}).find(
    ([, item]) => item?.articleByHandle
  );
  const blog = blogEntry?.[1];
  const blogIndex = blogEntry?.[0].replace("blog", "");
  const sourceHandle =
    blogIndex !== undefined ? blogHandles[Number(blogIndex)] : undefined;

  if (!blog?.articleByHandle || !sourceHandle) return null;

  return {
    ...blog.articleByHandle,
    source: blog.title,
    sourceHandle,
  };
}

function recommendationArticlesQuery() {
  const fallbackBlogs = blogHandles
    .map(
      (blogHandle, index) => `
        fallbackBlog${index}: blog(handle: "${blogHandle}") {
          title
          articles(first: 4, sortKey: PUBLISHED_AT, reverse: true) {
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
    query RecommendedReadArticles($sourceHandle: String!) {
      sourceBlog: blog(handle: $sourceHandle) {
        title
        articles(first: 4, sortKey: PUBLISHED_AT, reverse: true) {
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
      ${fallbackBlogs}
    }
  `;
}

type RecommendationBlog = {
  title: string;
  articles: {
    nodes: Omit<RecommendedArticle, "source">[];
  };
};

function addRecommendation(
  recommendations: RecommendedArticle[],
  seen: Set<string>,
  article: Omit<RecommendedArticle, "source">,
  source: string,
  currentArticle: ArticleWithSource
) {
  if (
    article.id === currentArticle.id ||
    article.handle === currentArticle.handle ||
    seen.has(article.id) ||
    seen.has(article.handle) ||
    recommendations.length >= 3
  ) {
    return;
  }

  recommendations.push({ ...article, source });
  seen.add(article.id);
  seen.add(article.handle);
}

async function getRecommendedArticles(
  currentArticle: ArticleWithSource
): Promise<RecommendedArticle[]> {
  try {
    const { data } = await shopifyClient.request<
      Record<string, RecommendationBlog | null>
    >(recommendationArticlesQuery(), {
      variables: { sourceHandle: currentArticle.sourceHandle },
    });

    const recommendations: RecommendedArticle[] = [];
    const seen = new Set<string>();
    const sourceArticles = data?.sourceBlog?.articles?.nodes ?? [];

    sourceArticles.forEach((article) => {
      addRecommendation(
        recommendations,
        seen,
        article,
        data?.sourceBlog?.title || currentArticle.source,
        currentArticle
      );
    });

    if (recommendations.length >= 3) return recommendations;

    const fallbackArticles = Object.entries(data ?? {})
      .filter(([key]) => key.startsWith("fallbackBlog"))
      .flatMap(([, blog]) =>
        (blog?.articles?.nodes ?? []).map((article) => ({
          ...article,
          source: blog?.title || "",
        }))
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );

    fallbackArticles.forEach((article) => {
      addRecommendation(
        recommendations,
        seen,
        article,
        article.source,
        currentArticle
      );
    });

    return recommendations;
  } catch (error) {
    console.error("Recommended reading request failed:", error);
    return [];
  }
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function RecommendedReading({ articles }: { articles: RecommendedArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className={styles.recommended} aria-labelledby="recommended-title">
      <div className={styles.recommendedHeader}>
        <p>Keep Reading</p>
        <h2 id="recommended-title">Recommended Reading</h2>
      </div>

      <div className={styles.recommendedGrid}>
        {articles.map((article) => (
          <Link
            href={`/read/${article.handle}`}
            key={article.id}
            className={styles.recommendedCard}
          >
            <div className={styles.recommendedImageWrapper}>
              {article.image ? (
                <Image
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                  className={styles.recommendedImage}
                />
              ) : (
                <div className={styles.recommendedImageFallback}>
                  <span>{article.source}</span>
                </div>
              )}
            </div>

            <div className={styles.recommendedMeta}>
              <div className={styles.recommendedTopline}>
                <span>{article.source}</span>
                <time dateTime={article.publishedAt}>
                  {formatShortDate(article.publishedAt)}
                </time>
              </div>
              <h3>{article.title}</h3>
              {article.excerpt && <p>{article.excerpt}</p>}
              <span className={styles.recommendedLink}>Read article</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const article = await getArticle(handle);

  if (!article) {
    return buildPageMetadata({
      title: "Article Not Found",
      path: `/read/${handle}`,
    });
  }

  return buildPageMetadata({
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt,
    path: `/read/${article.handle}`,
    image: article.image?.url,
    type: "article",
    publishedTime: article.publishedAt,
    authors: article.authorV2?.name ? [article.authorV2.name] : undefined,
  });
}

export default async function ReadArticlePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const article = await getArticle(handle);

  if (!article) notFound();

  const recommendedArticles = await getRecommendedArticles(article);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    image: article.image?.url,
    author: article.authorV2?.name
      ? { "@type": "Person", name: article.authorV2.name }
      : { "@type": "Organization", name: siteConfig.siteName },
    publisher: { "@type": "Organization", name: siteConfig.siteName },
    mainEntityOfPage: absoluteUrl(`/read/${article.handle}`),
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Read", path: "/read" },
    { name: article.title, path: `/read/${article.handle}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
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
        <Link href="/read" className={styles.backLink}>
          Back to Read
        </Link>

        <article className={styles.article}>
          <header className={styles.header}>
            <p className={styles.source}>{article.source}</p>
            <h1>{article.title}</h1>
            <div className={styles.meta}>
              {article.authorV2?.name && <span>{article.authorV2.name}</span>}
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            {article.excerpt && (
              <p className={styles.excerpt}>{article.excerpt}</p>
            )}
          </header>

          {article.image && (
            <div className={styles.imageWrapper}>
              <Image
                src={article.image.url}
                alt={article.image.altText || article.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 1100px"
                className={styles.image}
              />
            </div>
          )}

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          <RecommendedReading articles={recommendedArticles} />
        </article>
      </main>
      <Footer />
    </>
  );
}
