"use client";

import styles from "./styles.module.css";
import ReviewSummary from "../ReviewSummary";
import { motion } from "framer-motion";
import ReviewCarousel from "../ReviewCarousel";

type Review = {
  name: string;
  rating: number;
  comment: string;
};

type Props = {
  reviews: Review[];
};

export default function ProductReviews({ reviews }: Props) {
  if (!reviews || reviews.length === 0) {
    return <p className={styles.noReviews}>No reviews yet.</p>;
  }

  const average =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  // compute distribution (counts per rating)
  const distribution = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });

  const fullStars = Math.floor(average);
  const hasHalfStar = average % 1 >= 0.5;

  return (
    <div className={styles.reviewsSection}>
      <div className={styles.averageRow}>
        <ReviewSummary
          average={average}
          totalReviews={reviews.length}
          distribution={distribution}
        />
      </div>

      <ReviewCarousel reviews={reviews} />

      {/* <ul className={styles.list}>
        {reviews.map((r, i) => (
          <motion.li
            key={i}
            className={styles.review}
            initial={{ opacity: 0, y: 40, rotateX: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.15,
              type: "spring",
              stiffness: 60,
            }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className={styles.reviewHeader}>
              <p className={styles.reviewName}>{r.name}</p>
              <span className={styles.reviewStars}>
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
            </div>
            <p className={styles.comment}>{r.comment}</p>
          </motion.li>
        ))}
      </ul> */}
    </div>
  );
}
