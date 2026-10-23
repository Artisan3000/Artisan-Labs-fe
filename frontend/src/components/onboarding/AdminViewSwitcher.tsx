"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AdminViewMode } from "@/lib/onboarding/view-mode";
import styles from "./portal.module.css";

const options: Array<{ mode: AdminViewMode; label: string }> = [
  { mode: "ADMIN", label: "Admin" },
  { mode: "W2", label: "W-2 employee" },
  { mode: "CONTRACTOR_1099", label: "1099 contractor" },
];

export default function AdminViewSwitcher({ activeMode }: { activeMode: AdminViewMode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function selectMode(mode: AdminViewMode) {
    if (mode === activeMode) return;
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/onboarding/admin/view-mode", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      if (response.ok) router.push(mode === "ADMIN" ? "/careers/portal/admin" : "/careers/portal");
      else setMessage("View mode could not be changed.");
    });
  }

  return <div className={styles.viewSwitcher} aria-label="Admin view mode">
    <span className={styles.viewSwitcherLabel}>View as</span>
    <div className={styles.viewSwitcherOptions} role="group" aria-label="Choose a view mode">
      {options.map(({ mode, label }) => <button
        key={mode}
        type="button"
        className={activeMode === mode ? styles.viewSwitcherActive : styles.viewSwitcherButton}
        aria-pressed={activeMode === mode}
        disabled={pending}
        onClick={() => selectMode(mode)}
      >{label}</button>)}
    </div>
    {message && <span className={styles.visuallyHidden} role="alert">{message}</span>}
  </div>;
}
