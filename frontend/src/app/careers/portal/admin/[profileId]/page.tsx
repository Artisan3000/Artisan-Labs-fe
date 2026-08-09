import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdminProfileForm from "@/components/onboarding/AdminProfileForm";
import AdminChecklistControls from "@/components/onboarding/AdminChecklistControls";
import AdminMeetingControls from "@/components/onboarding/AdminMeetingControls";
import AdminEmployeeResources from "@/components/onboarding/AdminEmployeeResources";
import styles from "@/components/onboarding/portal.module.css";
import PortalShell from "@/components/onboarding/PortalShell";
import { listAdminProfiles } from "@/lib/onboarding/data";
import { loadPortal, PortalBoundary } from "../../_shared";

export const metadata: Metadata = { title: "Manage Onboarding Profile", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminProfilePage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = await params; const { session, result } = await loadPortal(profileId); if (session.role !== "ADMIN") redirect("/careers/portal");
  if (result.status === "disabled") return <PortalBoundary session={session} result={result}>{null}</PortalBoundary>;
  const profiles = await listAdminProfiles(session); const profile = profiles.find((candidate) => candidate.profileId === profileId); if (!profile) notFound();
  return <PortalShell identity={result.profile} viewerRole="ADMIN"><header className={styles.pageHeader}><p className={styles.kicker}>Administration</p><h1>{profile.name}</h1><p>{profile.email}</p></header><section className={styles.adminSection}><h2>Profile setup</h2><AdminProfileForm profile={profile} /></section><section className={styles.adminSection}><h2>Checklist state</h2><AdminChecklistControls profileId={profileId} groups={result.checklistGroups} /></section><section className={styles.adminSection}><h2>Meeting assignments</h2><p className={styles.sectionIntro}>Record the Google Calendar appointment here. Employees see these details but cannot change them.</p><AdminMeetingControls profileId={profileId} /></section><section className={styles.adminSection}><h2>Form submissions</h2><p className={styles.sectionIntro}>Completed forms are private to Admins. Upload or replace the employee’s current submission when paperwork arrives outside the portal.</p><AdminEmployeeResources profileId={profileId} /></section></PortalShell>;
}
