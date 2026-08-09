"use client";

import { useEffect, useState, useTransition } from "react";
import styles from "./portal.module.css";

type AdminMeeting = {
  id: string;
  title: string;
  durationMinutes: number;
  assigned: boolean;
  scheduledAt: string | null;
  hostName: string | null;
  completed: boolean;
};

function localDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function AdminMeetingControls({ profileId }: { profileId: string }) {
  const [meetings, setMeetings] = useState<AdminMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    fetch(`/api/onboarding/admin/profiles/${profileId}/meetings`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ meetings: AdminMeeting[] }>;
      })
      .then((data) => { if (active) setMeetings(data.meetings); })
      .catch(() => { if (active) setMessage("Meeting assignments could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [profileId]);

  function save(meeting: AdminMeeting, form: HTMLFormElement) {
    const data = new FormData(form);
    const assigned = data.get("assigned") === "on";
    const localValue = String(data.get("scheduledAt") || "");
    const next = {
      assigned,
      scheduledAt: assigned && localValue ? new Date(localValue).toISOString() : null,
      hostDisplayName: assigned ? String(data.get("hostDisplayName") || "").trim() || null : null,
      completed: assigned && data.get("completed") === "on",
    };
    setMessage("");
    startTransition(async () => {
      const response = await fetch(`/api/onboarding/admin/profiles/${profileId}/meetings`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ meetingId: meeting.id, ...next }),
      });
      if (!response.ok) { setMessage(`Could not update ${meeting.title}.`); return; }
      setMeetings((current) => current.map((candidate) => candidate.id === meeting.id ? {
        ...candidate,
        assigned: next.assigned,
        scheduledAt: next.scheduledAt,
        hostName: next.hostDisplayName,
        completed: next.completed,
      } : candidate));
      setMessage(`${meeting.title} updated.`);
    });
  }

  if (loading) return <p aria-live="polite">Loading meeting assignments…</p>;
  return <div className={styles.adminMeetingList}>
    <p className={styles.liveMessage} aria-live="polite">{message}</p>
    {meetings.length ? meetings.map((meeting) => <form className={styles.adminMeeting} key={`${meeting.id}-${meeting.scheduledAt}-${meeting.completed}`} onSubmit={(event) => { event.preventDefault(); save(meeting, event.currentTarget); }}>
      <div className={styles.adminMeetingTitle}><h3>{meeting.title}</h3><p>{meeting.durationMinutes} minutes</p></div>
      <label className={styles.inlineCheck}><input name="assigned" type="checkbox" defaultChecked={meeting.assigned} /> Assigned</label>
      <label>Date and time<input name="scheduledAt" type="datetime-local" defaultValue={localDateTime(meeting.scheduledAt)} /></label>
      <label>Host<input name="hostDisplayName" defaultValue={meeting.hostName ?? ""} autoComplete="name" /></label>
      <label className={styles.inlineCheck}><input name="completed" type="checkbox" defaultChecked={meeting.completed} /> Completed</label>
      <button className={styles.secondaryButton} disabled={pending}>{pending ? "Saving…" : "Save meeting"}</button>
    </form>) : <p>No applicable meetings are available. Assign a classification first.</p>}
  </div>;
}
