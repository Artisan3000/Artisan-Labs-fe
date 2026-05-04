"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/read/page.module.css";
import { Article } from "@/lib/types/article";

export default function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <section className={styles.grid}>
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.05,
            duration: 0.4,
            ease: "easeOut",
          }}
          whileHover={{
            y: -4,
            scale: 1.02,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
        >
          <Link href={`/read/${article.handle}`} className={styles.link}>
            <div className={styles.imageWrapper}>
              {article.image ? (
                <Image
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  fill
                  className={styles.image}
                />
              ) : (
                <div className={styles.imageFallback}>
                  <span>{article.source}</span>
                </div>
              )}
            </div>
            <div className={styles.meta}>
              <div className={styles.articleTopline}>
                <span>{article.source}</span>
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <h2>{article.title}</h2>
              <p className={styles.excerpt}>{article.excerpt}</p>
              <span className={styles.readMore}>Read article</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
