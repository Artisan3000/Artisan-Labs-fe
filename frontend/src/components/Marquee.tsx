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
              5% of all purchases go to our charity. Free shipping over $99
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
