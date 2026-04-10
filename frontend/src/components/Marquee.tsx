"use client";
import Image from "next/image";
import styles from "./Marquee.module.css";

export default function Marquee() {
  return (
    <div className={styles.container}>
      <div className={styles.track}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className={styles.content}>
            <Image
              src="/artisan-diag-blk.svg"
              alt="Artisan icon"
              width={35}
              height={35}
              className={styles.icon}
            />
            <span className={styles.text}>
              Try our Volume Hero - Free shipping over $75
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
