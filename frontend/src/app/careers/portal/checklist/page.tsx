import type { Metadata } from "next";
import ChecklistForm from "@/components/onboarding/ChecklistForm";
import styles from "@/components/onboarding/portal.module.css";
import { loadPortal, PortalBoundary, resolvePreview } from "../_shared";

export const metadata: Metadata = { title: "Onboarding Checklist", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ChecklistPage({ searchParams }: { searchParams: Promise<{ preview?: string | string[] }> }) {
  const previewProfileId = await resolvePreview(searchParams); const { session, result } = await loadPortal(previewProfileId);
  return <PortalBoundary session={session} result={result} previewProfileId={previewProfileId}>
    <header className={styles.pageHeader}><p className={styles.kicker}>My onboarding</p><h1>Checklist</h1><p>Work through the details that help you feel ready for the floor. Meeting steps update automatically.</p></header>
    {result.checklistGroups.length ? result.checklistGroups.map((group) => <section className={styles.checkGroup} key={group.id}><header><div><h2>{group.title}</h2>{group.subtitle && <p>{group.subtitle}</p>}</div><span>{group.items.filter((item) => item.completed).length} / {group.items.length}</span></header>{group.items.map((item) => <ChecklistForm key={item.id} item={item} disabled={result.isPreview} />)}</section>) : <p>No checklist items have been assigned.</p>}
  </PortalBoundary>;
}
