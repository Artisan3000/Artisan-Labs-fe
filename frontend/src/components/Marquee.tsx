"use client";
import Image from "next/image";
import styles from "./Marquee.module.css";
import { businessConfig } from "@/lib/businessConfig";

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
              Walk-ins welcome. Come in Monday - Friday from{" "}
              {businessConfig.hours.weekdays.display}. Saturday:{" "}
              {businessConfig.hours.saturday}. Sunday:{" "}
              {businessConfig.hours.sunday}.
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
