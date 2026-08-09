"use client";

import { useState, useTransition } from "react";
import type { AdminProfileSummary } from "./types";
import styles from "./portal.module.css";

export default function AdminProfileForm({ profile }: { profile: AdminProfileSummary }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  return <form className={styles.adminForm} onSubmit={(event) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    startTransition(async () => { const response = await fetch(`/api/onboarding/admin/profiles/${profile.profileId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ employmentType: data.get("employmentType") || null, startDate: data.get("startDate") || null, active: data.get("active") === "on", trainingAccess: data.get("trainingAccess") === "on", assistantStylistEligible: data.get("assistantStylistEligible") === "on" }) }); setMessage(response.ok ? "Profile updated." : "Update failed. Try again."); });
  }}>
    <div className={styles.adminFields}>
      <label>Classification<select name="employmentType" defaultValue={profile.employmentType ?? ""}><option value="">Pending</option><option value="W2">W-2</option><option value="CONTRACTOR_1099">1099 contractor</option></select></label>
      <label>Start date<input name="startDate" type="date" defaultValue={profile.startDate?.slice(0, 10) ?? ""} /></label>
      <label className={styles.inlineCheck}><input name="active" type="checkbox" defaultChecked={profile.active} /> Active</label>
      <label className={styles.inlineCheck}><input name="trainingAccess" type="checkbox" defaultChecked={profile.trainingAccess} /> Training access</label>
      <label className={styles.inlineCheck}><input name="assistantStylistEligible" type="checkbox" defaultChecked={profile.assistantStylistEligible} /> Assistant stylist eligible</label>
    </div>
    <button className={styles.primaryButton} disabled={pending}>{pending ? "Saving…" : "Save profile"}</button><p className={styles.liveMessage} aria-live="polite">{message}</p>
  </form>;
}
