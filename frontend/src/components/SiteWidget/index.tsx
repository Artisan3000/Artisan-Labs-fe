import Link from "next/link";
import styles from "./styles.module.css";

export default function SiteWidget() {
  return (
      <div className={styles.siteWidget}>
        <Link href="/" className={styles.btn}>
          Book Now
        </Link>
      </div>
  );
}
