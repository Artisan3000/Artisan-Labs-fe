import Stocks from "./Stocks";
import Weather from "./Weather";
import WorldClock from "./WorldClock";
import styles from "./styles.module.css";

export default function ReadHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroHeader}>
        <p className={styles.kicker}>The Gentlemen&apos;s Brief</p>
        <h1>Read the Room</h1>
      </div>

      <div className={styles.dashboard} aria-label="Market, weather, and time">
        <div className={`${styles.panel} ${styles.stocksPanel}`}>
          <div className={styles.panelLabel}>Markets</div>
          <Stocks />
        </div>
        <div className={styles.panel}>
          <div className={styles.panelLabel}>Time</div>
          <WorldClock />
        </div>
        <div className={styles.panel}>
          <div className={styles.panelLabel}>Weather</div>
          <Weather />
        </div>
        
      </div>
    </section>
  );
}
