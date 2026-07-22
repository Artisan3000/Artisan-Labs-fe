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
        <div className={styles.sportsKicker}>
          <p className={styles.kicker}>Sports</p>
          {/* TODO: Add a ticker/marquee of sports scores or highlights */}
        </div>
      </div>

      <div className={styles.dashboard} aria-label="Market, weather, and time">
        <div className={`${styles.panel} ${styles.stocksPanel}`}>
          <div className={styles.panelLabel}>Markets</div>
          <Stocks />
        </div>
        <div className={styles.panel}>
          <WorldClock />
          <Weather />
        </div>
        <div className={styles.panel}>
          {/* TODO: Add a panel for the latest article or featured content */}
          
        </div>
        
      </div>
    </section>
  );
}
