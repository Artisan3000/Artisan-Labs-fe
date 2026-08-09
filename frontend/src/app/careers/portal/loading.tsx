import Navigation from "@/components/Navigation";
import styles from "@/components/onboarding/portal.module.css";

export default function PortalLoading() {
  return <><Navigation /><main className={styles.portal}><section className={styles.state} aria-busy="true" aria-live="polite"><p className={styles.kicker}>Employee onboarding</p><h1>Preparing your portal…</h1><p>We’re gathering your checklist, meetings, and resources.</p></section></main></>;
}
