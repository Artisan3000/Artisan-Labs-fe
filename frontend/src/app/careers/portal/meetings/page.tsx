import type { Metadata } from "next";
import styles from "@/components/onboarding/portal.module.css";
import { loadPortal, PortalBoundary, resolvePreview } from "../_shared";

export const metadata: Metadata = { title: "Onboarding Meetings", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function MeetingsPage({ searchParams }: { searchParams: Promise<{ preview?: string | string[] }> }) {
  const previewProfileId = await resolvePreview(searchParams); const { session, result } = await loadPortal(previewProfileId);
  return <PortalBoundary session={session} result={result} previewProfileId={previewProfileId}>
    <header className={styles.pageHeader}><p className={styles.kicker}>Your journey</p><h1>Meetings</h1><p>Your onboarding team schedules each conversation. Come back here for the latest date, time, host, and completion status.</p></header>
    <div className={styles.meetingList}>{result.meetings.length ? result.meetings.map((meeting) => <article className={styles.meetingCard} key={meeting.id}><header className={styles.meetingHeader}><span className={styles.ordinal}>{meeting.ordinal}</span><div><span className={styles.tag}>{meeting.status.replaceAll("_", " ")}</span><h2>{meeting.title}</h2><p>{meeting.description}</p></div><dl className={styles.meetingDetails}><div><dt>Duration</dt><dd>{meeting.durationMinutes} minutes</dd></div><div><dt>Date and time</dt><dd>{meeting.scheduledAt ? new Date(meeting.scheduledAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "To be assigned"}</dd></div><div><dt>Host</dt><dd>{meeting.hostName || "To be assigned"}</dd></div></dl></header></article>) : <p>No meetings have been assigned.</p>}</div>
  </PortalBoundary>;
}
