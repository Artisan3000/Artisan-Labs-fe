"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/read/page.module.css";

type Article = {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  publishedAt: string;
  image?: { url: string; altText: string | null } | null;
  authorV2?: { name: string } | null;
};

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
            {article.image && (
              <div className={styles.imageWrapper}>
                <Image
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  fill
                  className={styles.image}
                />
              </div>
            )}
            <div className={styles.meta}>
              <h2>{article.title}</h2>
              <p className={styles.excerpt}>{article.excerpt}</p>
              <Link href={`/read/${article.handle}`} className={styles.link}>
                Read More
              </Link>
              <div className={styles.info}>
                {/* {article.authorV2?.name && <span>by {article.authorV2.name}</span>} */}
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
