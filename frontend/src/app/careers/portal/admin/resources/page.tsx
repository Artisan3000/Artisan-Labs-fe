import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminResourceManager from "@/components/onboarding/AdminResourceManager";
import PortalShell from "@/components/onboarding/PortalShell";
import styles from "@/components/onboarding/portal.module.css";
import { loadPortal, PortalBoundary } from "../../_shared";

export const metadata: Metadata = { title: "Manage Onboarding Resources", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const { session, result } = await loadPortal();
  if (session.role !== "ADMIN") redirect("/careers/portal");
  if (result.status === "disabled") return <PortalBoundary session={session} result={result}>{null}</PortalBoundary>;
  return <PortalShell identity={result.profile} viewerRole="ADMIN"><header className={styles.pageHeader}><p className={styles.kicker}>Administration</p><h1>Resource library</h1><p>Add and publish private PDF resources. Forms can collect one current employee submission; reference documents use explicit completion.</p></header><AdminResourceManager /></PortalShell>;
}
