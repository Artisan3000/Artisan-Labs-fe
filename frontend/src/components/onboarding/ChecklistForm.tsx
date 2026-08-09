"use client";

import { useState, useTransition } from "react";
import type { ChecklistItemView } from "./types";
import styles from "./portal.module.css";

export default function ChecklistForm({ item, disabled = false }: { item: ChecklistItemView; disabled?: boolean }) {
  const [checked, setChecked] = useState(item.completed);
  const [pending, startTransition] = useTransition();
  return <label className={styles.checkItem}>
    <input type="checkbox" checked={checked} disabled={disabled || item.readOnly || pending} onChange={(event) => {
      const next = event.currentTarget.checked;
      setChecked(next);
      startTransition(async () => {
        const response = await fetch("/api/onboarding/checklist", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ itemId: item.id, completed: next }) });
        if (!response.ok) setChecked(!next);
      });
    }} />
    <span>{item.label}{item.source === "MEETING" && <small>Updated from Meetings</small>}</span>
  </label>;
}
