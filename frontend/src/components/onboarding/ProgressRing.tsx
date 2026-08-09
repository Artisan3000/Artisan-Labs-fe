import styles from "./portal.module.css";

export default function ProgressRing({ percent }: { percent: number }) {
  const safe = Math.max(0, Math.min(100, percent));
  return <div className={styles.progressRing} style={{ "--progress": `${safe * 3.6}deg` } as React.CSSProperties} role="img" aria-label={`${safe}% complete`}><span>{safe}%</span><small>complete</small></div>;
}
