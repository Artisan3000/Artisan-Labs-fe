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
              Walk ins welcomed. Come in Monday - Friday from 11am to 7pm. We're closed on Saturdays. Sundays are appointment only.
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
