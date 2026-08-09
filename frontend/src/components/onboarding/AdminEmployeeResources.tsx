"use client";

import { useEffect, useState, useTransition } from "react";
import { upload as uploadToBlob } from "@vercel/blob/client";
import styles from "./portal.module.css";

type EmployeeResource = { id: string; title: string; submittedAt: string | null; resubmissionRequired: boolean; submissionDownloadHref: string | null };

export default function AdminEmployeeResources({ profileId }: { profileId: string }) {
  const [resources, setResources] = useState<EmployeeResource[]>([]);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function load() { fetch(`/api/onboarding/admin/profiles/${profileId}/resources`, { cache: "no-store" }).then(async (response) => { if (!response.ok) throw new Error(); return response.json() as Promise<{ resources: EmployeeResource[] }>; }).then((data) => setResources(data.resources)).catch(() => setMessage("Form submissions could not be loaded.")); }
  useEffect(load, [profileId]);
  function upload(documentId: string, file: File) {
    if (file.type !== "application/pdf") { setMessage("Choose a PDF file."); return; }
    if (file.size > 20 * 1024 * 1024) { setMessage("Choose a PDF smaller than 20 MB."); return; }
    startTransition(async () => { try { const fileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-"); await uploadToBlob(`onboarding/submissions/${documentId}/${profileId}/${crypto.randomUUID()}-${fileName}`, file, { access: "private", handleUploadUrl: `/api/onboarding/admin/profiles/${profileId}/resources/${documentId}/submission/upload`, clientPayload: JSON.stringify({ documentId }) }); setMessage("Employee submission updated."); load(); } catch { setMessage("Submission could not be updated; the previous file is still saved."); } });
  }
  return <div><p className={styles.liveMessage} aria-live="polite">{message}</p>{resources.length ? resources.map((resource) => <article className={styles.submissionRow} key={`${resource.id}-${resource.submittedAt}`}><div><h3>{resource.title}</h3><p>{resource.submittedAt ? `${resource.resubmissionRequired ? "Resubmission required · previous submission received" : "Received"} ${new Date(resource.submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}` : "Not received"}</p></div><div className={styles.resourceActions}>{resource.submissionDownloadHref && <a className={styles.secondaryButton} href={resource.submissionDownloadHref}>Download latest</a>}<label className={styles.uploadButton}>{resource.submittedAt ? "Replace for employee" : "Upload for employee"}<input type="file" accept="application/pdf,.pdf" disabled={pending} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) upload(resource.id, file); }} /></label></div></article>) : <p>No submission forms apply to this employee.</p>}</div>;
}
