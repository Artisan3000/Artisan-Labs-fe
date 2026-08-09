import Link from "next/link";
import styles from "./portal.module.css";

export default function PortalState({ kind, name }: { kind: "pending" | "inactive" | "empty" | "error"; name?: string }) {
  const copy = {
    pending: ["Your onboarding is being prepared", `Welcome${name ? `, ${name}` : ""}. An administrator still needs to assign your employment classification before your onboarding journey can begin.`],
    inactive: ["Onboarding is unavailable", "This onboarding profile is inactive. Please speak with an Artisan administrator if you believe this is a mistake."],
    empty: ["Nothing here yet", "Your onboarding content has not been assigned yet. Check back soon or contact an administrator."],
    error: ["We couldn’t load onboarding", "Please refresh the page. If the problem continues, contact an Artisan administrator."],
  }[kind];
  return <section className={styles.state}><p className={styles.kicker}>Employee onboarding</p><h1>{copy[0]}</h1><p>{copy[1]}</p><Link className={styles.primaryButton} href="/careers">Return to Careers</Link></section>;
}
