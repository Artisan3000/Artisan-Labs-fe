"use client";

import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import type { ResourceDocumentView } from "./types";
import styles from "./portal.module.css";

export default function ResourceActions({ document, disabled = false }: { document: ResourceDocumentView; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [completed, setCompleted] = useState(document.completed);
  const [submittedAt, setSubmittedAt] = useState(document.submittedAt);
  const [resubmissionRequired, setResubmissionRequired] = useState(document.resubmissionRequired);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const isForm = document.resourceType === "SUBMISSION_FORM";

  function submitForm(file: File) {
    if (file.type !== "application/pdf") { setMessage("Choose a PDF file."); return; }
    if (file.size > 20 * 1024 * 1024) { setMessage("Choose a PDF smaller than 20 MB."); return; }
    startTransition(async () => {
      try {
        const fileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
        await upload(`onboarding/submissions/${document.id}/self/${crypto.randomUUID()}-${fileName}`, file, { access: "private", handleUploadUrl: `/api/onboarding/resources/${document.id}/submission/upload`, clientPayload: JSON.stringify({ documentId: document.id }) });
        setSubmittedAt(new Date().toISOString()); setResubmissionRequired(false); setCompleted(true); setMessage("Your form was received.");
        if (inputRef.current) inputRef.current.value = "";
      } catch { setMessage("Your form could not be submitted. Your previous submission is still saved."); }
    });
  }

  return <div className={styles.resourceActions}>
    {disabled
      ? <span className={styles.tooltipWrap}>
          <span className={styles.disabledButton} tabIndex={0} aria-disabled="true" aria-describedby={`${document.id}-preview-tip`}>Open document<span className={styles.visuallyHidden}>: {document.title}</span></span>
          <span id={`${document.id}-preview-tip`} className={styles.tooltipBubble} role="tooltip">You're viewing a read-only preview, so this is disabled for you. The employee can open and download it from their own portal.</span>
        </span>
      : <a className={styles.secondaryButton} href={document.href} target={document.kind === "LINK" ? "_blank" : undefined} rel={document.kind === "LINK" ? "noreferrer" : undefined}>{document.kind === "FILE" ? (isForm ? "Open blank form" : "Open document") : "Visit resource"}<span className={styles.visuallyHidden}>: {document.title}</span></a>}
    {!disabled && isForm && <label className={styles.uploadButton}>{submittedAt ? "Replace submission" : "Upload completed PDF"}<input ref={inputRef} type="file" accept="application/pdf,.pdf" disabled={pending} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) submitForm(file); }} /></label>}
    {!disabled && !isForm && <button className={styles.textButton} disabled={pending} onClick={() => { const next = !completed; setCompleted(next); startTransition(async () => { const response = await fetch("/api/onboarding/resources/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ documentId: document.id, completed: next }) }); if (!response.ok) setCompleted(!next); }); }}>{pending ? "Saving…" : completed ? "Mark incomplete" : "Mark complete"}</button>}
    <span className={styles.liveMessage} aria-live="polite">{isForm && submittedAt ? `${resubmissionRequired ? "Resubmission required · previously received" : "Received"} ${new Date(submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}` : completed ? "Completed" : message}</span>
    {message && (isForm && submittedAt) && <span className={styles.liveMessage} aria-live="polite">{message}</span>}
  </div>;
}
