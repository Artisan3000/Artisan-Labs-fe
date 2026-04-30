"use client";

import styles from "./styles.module.css";

type ReviewSummaryProps = {
  average: number;
  totalReviews: number;
  distribution: { [key: number]: number };
};

export default function ReviewSummary({
  average,
  totalReviews,
  distribution,
}: ReviewSummaryProps) {

  return (
    <div className={styles.summaryContainer}>
      {/* large average */}
      <div className={styles.left}>
        <div className={styles.averageScore}>
          {average.toFixed(1)}
          <span className={styles.outOf}>of 5</span>
        </div>
        <p className={styles.reviewCount}>({totalReviews} Reviews)</p>
      </div>

      {/* distribution */}
      <div className={styles.right}>
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = distribution[star] || 0;
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={star} className={styles.barRow}>
              <span className={styles.starLabel}>★ {star}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
