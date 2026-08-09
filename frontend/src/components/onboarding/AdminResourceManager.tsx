"use client";

import { useEffect, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import styles from "./portal.module.css";

type AdminCategory = { id: string; title: string; applicability: "ALL" | "W2" | "CONTRACTOR_1099" };
type AdminResource = {
  id: string; categoryId: string; title: string; description: string | null;
  resourceType: "REFERENCE" | "SUBMISSION_FORM"; required: boolean; published: boolean;
  version: number; hasTemplate: boolean; submissionCount: number;
};

export default function AdminResourceManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  function load() {
    fetch("/api/onboarding/admin/resources", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) throw new Error();
      return response.json() as Promise<{ categories: AdminCategory[]; resources: AdminResource[] }>;
    }).then((data) => { setCategories(data.categories); setResources(data.resources); }).catch(() => setMessage("Resources could not be loaded.")).finally(() => setLoading(false));
  }
  useEffect(load, []);

  function create(form: HTMLFormElement) {
    const body = new FormData(form); const file = body.get("file");
    if (!(file instanceof File) || file.type !== "application/pdf") { setMessage("Choose a PDF file."); return; }
    if (file.size > 20 * 1024 * 1024) { setMessage("Choose a PDF smaller than 20 MB."); return; }
    const operationId = crypto.randomUUID();
    const clientPayload = JSON.stringify({ operationId, categoryId: body.get("categoryId"), resourceType: body.get("resourceType"), title: body.get("title"), description: body.get("description"), required: body.get("required") === "on", published: body.get("published") === "on" });
    startTransition(async () => {
      try { const fileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-"); await upload(`onboarding/templates/${operationId}/${fileName}`, file, { access: "private", handleUploadUrl: "/api/onboarding/admin/resources/upload", clientPayload }); setMessage("Resource created."); form.reset(); load(); }
      catch { setMessage("Resource could not be created."); }
    });
  }

  function update(resource: AdminResource, form: HTMLFormElement) {
    const body = new FormData(form); const file = body.get("file");
    if (file instanceof File && file.size && (file.type !== "application/pdf" || file.size > 20 * 1024 * 1024)) { setMessage("Choose a PDF smaller than 20 MB."); return; }
    const metadata = { categoryId: body.get("categoryId"), resourceType: body.get("resourceType"), title: body.get("title"), description: body.get("description"), required: body.get("required") === "on", published: body.get("published") === "on" };
    startTransition(async () => {
      try {
        const response = await fetch(`/api/onboarding/admin/resources/${resource.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(metadata) });
        if (!response.ok) throw new Error();
        if (file instanceof File && file.size) { const fileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-"); await upload(`onboarding/templates/${resource.id}/${crypto.randomUUID()}-${fileName}`, file, { access: "private", handleUploadUrl: `/api/onboarding/admin/resources/${resource.id}/upload`, clientPayload: JSON.stringify({ expectedVersion: resource.version, requireResubmission: body.get("requireResubmission") === "on" }) }); }
        setMessage(`${resource.title} updated.`); load();
      } catch { setMessage(`${resource.title} could not be updated.`); }
    });
  }

  function remove(resource: AdminResource) {
    const retention = resource.submissionCount ? " Employee submissions and the archived database record will be retained." : " Its database record will also be removed because it has no submissions.";
    if (!window.confirm(`Permanently remove the blank template for “${resource.title}”?${retention}`)) return;
    startTransition(async () => {
      const response = await fetch(`/api/onboarding/admin/resources/${resource.id}`, { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({}) });
      setMessage(response.ok ? `${resource.title} removed.` : `${resource.title} could not be removed.`);
      if (response.ok) load();
    });
  }

  if (loading) return <p aria-live="polite">Loading resources…</p>;
  return <div className={styles.resourceAdmin}>
    <p className={styles.liveMessage} aria-live="polite">{message}</p>
    <section className={styles.adminSection}><h2>Add PDF resource</h2><form className={styles.adminForm} onSubmit={(event) => { event.preventDefault(); create(event.currentTarget); }}>
      <div className={styles.adminFields}>
        <label>Category<select name="categoryId" required defaultValue=""><option value="" disabled>Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
        <label>Resource type<select name="resourceType" defaultValue="REFERENCE"><option value="REFERENCE">Reference document</option><option value="SUBMISSION_FORM">Form requiring submission</option></select></label>
        <label>Title<input name="title" required maxLength={160} /></label>
        <label>Description<input name="description" maxLength={500} /></label>
        <label>PDF<input name="file" type="file" accept="application/pdf,.pdf" required /></label>
        <label className={styles.inlineCheck}><input name="required" type="checkbox" /> Required</label>
        <label className={styles.inlineCheck}><input name="published" type="checkbox" /> Publish immediately</label>
      </div><button className={styles.primaryButton} disabled={pending}>{pending ? "Uploading…" : "Create resource"}</button>
    </form></section>
    <section className={styles.adminSection}><h2>Resource library</h2>{resources.length ? resources.map((resource) => <form className={styles.resourceAdminCard} key={`${resource.id}-${resource.version}-${resource.published}`} onSubmit={(event) => { event.preventDefault(); update(resource, event.currentTarget); }}>
      <header><div><p className={styles.documentMeta}>{resource.published ? "Published" : "Draft"} · Version {resource.version} · {resource.submissionCount} submission{resource.submissionCount === 1 ? "" : "s"}</p><h3>{resource.title}</h3></div><button type="button" className={styles.dangerButton} disabled={pending} onClick={() => remove(resource)}>Delete template</button></header>
      <div className={styles.adminFields}>
        <label>Category<select name="categoryId" defaultValue={resource.categoryId}>{categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
        <label>Resource type<select name="resourceType" defaultValue={resource.resourceType}><option value="REFERENCE">Reference document</option><option value="SUBMISSION_FORM">Form requiring submission</option></select></label>
        <label>Title<input name="title" required maxLength={160} defaultValue={resource.title} /></label>
        <label>Description<input name="description" maxLength={500} defaultValue={resource.description ?? ""} /></label>
        <label>Replace PDF<input name="file" type="file" accept="application/pdf,.pdf" /></label>
        <label className={styles.inlineCheck}><input name="required" type="checkbox" defaultChecked={resource.required} /> Required</label>
        <label className={styles.inlineCheck}><input name="published" type="checkbox" defaultChecked={resource.published} /> Published</label>
        {resource.resourceType === "SUBMISSION_FORM" && <label className={styles.inlineCheck}><input name="requireResubmission" type="checkbox" /> Require resubmission when replacing this PDF</label>}
      </div><button className={styles.secondaryButton} disabled={pending}>{pending ? "Saving…" : "Save resource"}</button>
    </form>) : <p>No uploaded resources yet.</p>}</section>
  </div>;
}
