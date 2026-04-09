"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";

type Review = {
  name: string;
  rating: number;
  comment: string;
};

export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);

  // 🕒 Auto-cycle through reviews
  useEffect(() => {
    if (!reviews.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  if (!reviews.length) return null;
  const review = reviews[index];

  return (
    <div className={styles.carousel}>
      {/* Animated Review Card */}
      <AnimatePresence initial={false}>
        <motion.div
          key={review.name + index}
          className={styles.reviewCard}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div>
            <p className={styles.reviewName}>{review.name}</p>
            <span className={styles.reviewStars}>
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
          </div>
          <p className={styles.comment}>{review.comment}</p>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className={styles.dots}>
        {reviews.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setIndex(i)}
            className={`${styles.dot} ${i === index ? styles.activeDot : ""}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
