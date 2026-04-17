"use client";

import styles from "./styles.module.css";

export type HomeReview = {
  quote: string;
  name: string;
  detail: string;
  source: string;
};

type Props = {
  reviews: HomeReview[];
};

export default function HomeReviewCarousel({ reviews }: Props) {
  if (!reviews.length) return null;

  const repeatedReviews = [...reviews, ...reviews];

  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {repeatedReviews.map((review, index) => (
          <article
            key={`${review.name}-${index}`}
            className={styles.ticket}
            aria-hidden={index >= reviews.length}
          >
            <blockquote className={styles.quote}>
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <p className={styles.name}>— {review.name}</p>
            <p className={styles.detail}>{review.detail}</p>
            <p className={styles.source}>Review from Google</p>
          </article>
        ))}
      </div>
    </div>
  );
}
