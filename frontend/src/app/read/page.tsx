import type { Metadata } from "next";
import { shopifyClient } from "@/lib/shopify";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FilterBar from "@/components/ReadFilter";
import ReadHero from "@/components/ReadHero";
import styles from "./page.module.css";
import { Article } from "@/lib/types/article";

export const metadata: Metadata = {
  title: "Read | Artisan Barber",
  description:
    "Read grooming notes, local stories, team updates, and lifestyle pieces from Artisan Barber.",
};

/* ------------------ RAW TYPES ------------------ */

type ShopifyArticle = {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  publishedAt: string;
  image?: { url: string; altText: string | null } | null;
  authorV2?: { name: string } | null;
};

type ShopifyBlog = {
  title: string;
  articles: {
    nodes: ShopifyArticle[];
  };
};

type ShopifyResponse = {
  grooming?: ShopifyBlog;
  local?: ShopifyBlog;
  journal?: ShopifyBlog;
  team?: ShopifyBlog;
  lifestyle?: ShopifyBlog;
  learn?: ShopifyBlog;
};

/* ------------------ PAGE ------------------ */

export default async function ReadPage() {
  const { data } = await shopifyClient.request<ShopifyResponse>(`
    query {
      grooming: blog(handle: "grooming") {
        title
        articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            excerpt
            publishedAt
            image { url altText }
            authorV2 { name }
          }
        }
      }
      local: blog(handle: "local") {
        title
        articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {
          nodes { id title handle excerpt publishedAt image { url altText } authorV2 { name } }
        }
      }
      journal: blog(handle: "journal") {
        title
        articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {
          nodes { id title handle excerpt publishedAt image { url altText } authorV2 { name } }
        }
      }
      team: blog(handle: "team") {
        title
        articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {
          nodes { id title handle excerpt publishedAt image { url altText } authorV2 { name } }
        }
      }
      lifestyle: blog(handle: "lifestyle") {
        title
        articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {
          nodes { id title handle excerpt publishedAt image { url altText } authorV2 { name } }
        }
      }
      learn: blog(handle: "learn") {
        title
        articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {
          nodes { id title handle excerpt publishedAt image { url altText } authorV2 { name } }
        }
      }
    }
  `);

  const allBlogs = [
    { key: "Grooming", data: data?.grooming },
    { key: "Local", data: data?.local },
    { key: "Journal", data: data?.journal },
    { key: "Team", data: data?.team },
    { key: "Lifestyle", data: data?.lifestyle },
    { key: "Learn", data: data?.learn },
  ];

  const allArticles: Article[] = allBlogs
    .flatMap((blog) =>
      (blog.data?.articles?.nodes ?? []).map((a) => ({
        ...a,
        source: blog.key,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );

  const counts = Object.fromEntries(
    allBlogs.map((b) => [b.key, b.data?.articles?.nodes?.length ?? 0])
  );

  return (
    <>
      <Navigation />

      <main className={styles.main}>
        <ReadHero />

        <FilterBar
          blogs={Object.keys(counts)}
          counts={counts}
          articles={allArticles}
        />
      </main>

      <Footer />
    </>
  );
}
