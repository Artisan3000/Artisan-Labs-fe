import { shopifyClient } from "@/lib/shopify";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FilterBar from "@/components/ReadFilter";
import styles from "./page.module.css";

export default async function ReadPage() {
  const { data } = await shopifyClient.request(`
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

  const allArticles = allBlogs
    .flatMap((blog) =>
      (blog.data?.articles?.nodes ?? []).map((a: any) => ({
        ...a,
        source: blog.key,
      }))
    )
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const counts = Object.fromEntries(
    allBlogs.map((b) => [b.key, b.data?.articles?.nodes?.length ?? 0])
  );

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <header className={styles.header}>
          <p>Stories, culture, and dispatches from Artisan Barber.</p>
        </header>

        <FilterBar blogs={Object.keys(counts)} counts={counts} articles={allArticles} />
      </main>
      <Footer />
    </>
  );
}
