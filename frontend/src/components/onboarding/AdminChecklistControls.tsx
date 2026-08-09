"use client";

import { useState, useTransition } from "react";
import type { ChecklistGroupView } from "./types";
import styles from "./portal.module.css";

function AdminChecklistItem({ profileId, item }: { profileId: string; item: ChecklistGroupView["items"][number] }) {
  const [checked, setChecked] = useState(item.completed);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return <label className={styles.checkItem}>
    <input type="checkbox" checked={checked} disabled={pending || item.source === "MEETING"} onChange={(event) => {
      const next = event.currentTarget.checked;
      setChecked(next);
      setMessage("");
      startTransition(async () => {
        const response = await fetch(`/api/onboarding/admin/profiles/${profileId}/checklist`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ itemId: item.id, completed: next }) });
        if (!response.ok) { setChecked(!next); setMessage("Update failed."); }
        else setMessage(next ? "Marked complete." : "Marked incomplete.");
      });
    }} />
    <span>{item.label}{item.source === "MEETING" && <small>Updated from Meetings</small>}<span className={styles.liveMessage} aria-live="polite">{message}</span></span>
  </label>;
}

export default function AdminChecklistControls({ profileId, groups }: { profileId: string; groups: ChecklistGroupView[] }) {
  if (!groups.length) return <p>Assign a classification before managing checklist items.</p>;
  return <div>{groups.map((group) => <section className={styles.checkGroup} key={group.id}><header><div><h3>{group.title}</h3>{group.subtitle && <p>{group.subtitle}</p>}</div></header>{group.items.map((item) => <AdminChecklistItem key={item.id} profileId={profileId} item={item} />)}</section>)}</div>;
}
