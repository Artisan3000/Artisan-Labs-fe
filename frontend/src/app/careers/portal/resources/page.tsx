import type { Metadata } from "next";
import ResourceActions from "@/components/onboarding/ResourceActions";
import styles from "@/components/onboarding/portal.module.css";
import { loadPortal, PortalBoundary, resolvePreview } from "../_shared";

export const metadata: Metadata = { title: "Onboarding Resources", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ preview?: string | string[] }> }) {
  const previewProfileId = await resolvePreview(searchParams); const { session, result } = await loadPortal(previewProfileId);
  return <PortalBoundary session={session} result={result} previewProfileId={previewProfileId}>
    <header className={styles.pageHeader}><p className={styles.kicker}>Reference library</p><h1>Resources</h1><p>Shop documents and trusted references, collected in one place. Open a resource first, then mark it complete when you are finished.</p></header>
    <div className={styles.resourceList}>{result.resourceCategories.length ? result.resourceCategories.map((category) => <section className={styles.resourceCategory} key={category.id}>{category.eyebrow && <p className={styles.kicker}>{category.eyebrow}</p>}<h2>{category.title}</h2>{category.introduction && <p>{category.introduction}</p>}<div className={styles.articleSections}>{category.sections.map((section) => <article key={section.id}><h3>{section.heading}</h3><p>{section.body}</p></article>)}</div><div>{category.documents.map((document) => <article className={styles.document} key={document.id}><div><p className={styles.documentMeta}>{document.required ? "Required" : "Optional"} · Version {document.version}</p><h3>{document.title}</h3>{document.description && <p>{document.description}</p>}</div><ResourceActions document={document} disabled={result.isPreview} /></article>)}</div></section>) : <p>No resources are available for your onboarding profile.</p>}</div>
  </PortalBoundary>;
}
