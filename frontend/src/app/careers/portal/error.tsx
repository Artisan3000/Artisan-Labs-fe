"use client";

import Navigation from "@/components/Navigation";
import styles from "@/components/onboarding/portal.module.css";

export default function PortalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <><Navigation /><main className={styles.portal}><section className={styles.state}><p className={styles.kicker}>Employee onboarding</p><h1>We couldn’t load onboarding.</h1><p>Please try again. If the problem continues, contact an Artisan administrator.</p><button className={styles.primaryButton} onClick={reset}>Try again</button></section></main></>;
}
