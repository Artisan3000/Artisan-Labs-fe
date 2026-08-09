import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "@/components/onboarding/portal.module.css";
import PortalShell from "@/components/onboarding/PortalShell";
import { listAdminProfiles } from "@/lib/onboarding/data";
import { loadPortal, PortalBoundary } from "../_shared";

export const metadata: Metadata = { title: "Onboarding Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { session, result } = await loadPortal(); if (session.role !== "ADMIN") redirect("/careers/portal");
  if (result.status === "disabled") return <PortalBoundary session={session} result={result}>{null}</PortalBoundary>;
  const profiles = await listAdminProfiles(session);
  return <PortalShell identity={result.profile} viewerRole="ADMIN">
    <header className={styles.pageHeader}><p className={styles.kicker}>Administration</p><h1>Onboarding roster</h1><p>Assign employee setup details and preview the experience exactly as each person sees it.</p><Link className={styles.secondaryButton} href="/careers/portal/admin/resources">Manage resource library</Link></header>
    {profiles.length ? <table className={styles.adminTable}><thead><tr><th>Name</th><th>Classification</th><th>Status</th><th>Progress</th><th><span className={styles.visuallyHidden}>Actions</span></th></tr></thead><tbody>{profiles.map((profile) => <tr key={profile.profileId}><td><strong>{profile.name}</strong><br />{profile.email}</td><td>{profile.employmentType === "CONTRACTOR_1099" ? "1099 contractor" : profile.employmentType === "W2" ? "W-2" : "Pending"}</td><td>{profile.active ? "Active" : "Inactive"}</td><td>{profile.progressPercent === null ? "—" : `${profile.progressPercent}%`}</td><td><Link href={`/careers/portal/admin/${profile.profileId}`}>Manage</Link> · <Link href={`/careers/portal?preview=${encodeURIComponent(profile.profileId)}`}>Preview</Link></td></tr>)}</tbody></table> : <p>No employees have signed in yet.</p>}
  </PortalShell>;
}
