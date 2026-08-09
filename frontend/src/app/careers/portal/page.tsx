import type { Metadata } from "next";
import Link from "next/link";
import ProgressRing from "@/components/onboarding/ProgressRing";
import styles from "@/components/onboarding/portal.module.css";
import { loadPortal, PortalBoundary, resolvePreview } from "./_shared";

export const metadata: Metadata = { title: "Employee Onboarding", robots: { index: false, follow: false, noarchive: true } };
export const dynamic = "force-dynamic";

export default async function PortalHome({ searchParams }: { searchParams: Promise<{ preview?: string | string[] }> }) {
  const previewProfileId = await resolvePreview(searchParams); const { session, result } = await loadPortal(previewProfileId);
  const suffix = result.isPreview && previewProfileId ? `?preview=${encodeURIComponent(previewProfileId)}` : "";
  return <PortalBoundary session={session} result={result} previewProfileId={previewProfileId}>
    <section className={styles.welcomeGrid}>
      <header className={styles.pageHeader}><p className={styles.kicker}>Artisan Barber · New hire</p><h1>Welcome to the shop, {result.profile.name.split(" ")[0]}.</h1><p>Your first weeks are about learning how Artisan works, meeting the people around you, and building confidence one step at a time.</p></header>
      <ProgressRing percent={result.progress.percent} />
    </section>
    <section className={styles.section}><div className={styles.sectionTitle}><h2>Up next</h2><Link href={`/careers/portal/meetings${suffix}`}>All meetings →</Link></div>{result.nextMeeting ? <article className={styles.nextCard}><span className={styles.ordinal}>{result.nextMeeting.ordinal}</span><div><p className={styles.meetingMeta}>{result.nextMeeting.status.replaceAll("_", " ")}</p><h2>{result.nextMeeting.title}</h2><p>{result.nextMeeting.scheduledAt ? `${new Date(result.nextMeeting.scheduledAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}${result.nextMeeting.hostName ? ` · ${result.nextMeeting.hostName}` : ""}` : result.nextMeeting.description}</p></div><Link className={styles.secondaryButton} href={`/careers/portal/meetings${suffix}`}>View details</Link></article> : <p>No meetings are currently assigned.</p>}</section>
    <section className={styles.section}><div className={styles.sectionTitle}><h2>Your progress</h2></div><div className={styles.summaryGrid}><article className={styles.summaryCard}><small>Meetings completed</small><strong>{result.progress.meetingsCompleted} / {result.progress.meetingsTotal}</strong></article><article className={styles.summaryCard}><small>Checklist complete</small><strong>{result.progress.checklistCompleted} / {result.progress.checklistTotal}</strong></article><article className={styles.summaryCard}><small>Required resources</small><strong>{result.progress.resourcesCompleted} / {result.progress.resourcesTotal}</strong></article></div></section>
    <section className={styles.section}><p className={styles.kicker}>Training access</p><h2>{result.profile.trainingAccess ? "Your Academy access is ready." : "Academy access is not assigned yet."}</h2><p>Onboarding, introductions, access, and readiness live here. Courses, modules, and assessments remain on the Artisan Academy site.</p>{result.profile.trainingAccess && !result.isPreview && <a className={styles.secondaryButton} href="https://academy.artisanbarber.com">Open the Academy</a>}</section>
  </PortalBoundary>;
}
