import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { shopifyClient } from "@/lib/shopify";
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

  const blog = Object.values(data ?? {}).find((item) => item?.articleByHandle);

  if (!blog?.articleByHandle) return null;

  return {
    ...blog.articleByHandle,
    source: blog.title,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const article = await getArticle(handle);

  if (!article) {
    return {
      title: "Article Not Found | Artisan Barber",
    };
  }

  return {
    title: `${article.seo?.title || article.title} | Artisan Barber`,
    description: article.seo?.description || article.excerpt,
    openGraph: {
      title: article.seo?.title || article.title,
      description: article.seo?.description || article.excerpt,
      images: article.image ? [{ url: article.image.url }] : undefined,
    },
  };
}

export default async function ReadArticlePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const article = await getArticle(handle);

  if (!article) notFound();

  return (
    <>
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
        </article>
      </main>
      <Footer />
    </>
  );
}
