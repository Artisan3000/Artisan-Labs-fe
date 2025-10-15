"use client";

import { useState } from "react";
import ArticleGrid from "../ArticleGrid/page";
import styles from "./styles.module.css";

export default function FilterBar({
  blogs,
  counts,
  articles,
}: {
  blogs: string[];
  counts: Record<string, number>;
  articles: any[];
}) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (blog: string) => {
    setActiveFilters((prev) =>
      prev.includes(blog)
        ? prev.filter((f) => f !== blog)
        : [...prev, blog]
    );
  };

  const filteredArticles =
    activeFilters.length === 0
      ? articles
      : articles.filter((a) => activeFilters.includes(a.source));

  return (
    <>
      <div className={styles.filterBar}>
        {blogs.map((blog) => (
          <button
            key={blog}
            onClick={() => toggleFilter(blog)}
            className={`${styles.tag} ${
              activeFilters.includes(blog) ? styles.active : ""
            }`}
          >
            {blog} <span className={styles.count}>({counts[blog]})</span>
          </button>
        ))}
      </div>

      <ArticleGrid articles={filteredArticles} />
    </>
  );
}
