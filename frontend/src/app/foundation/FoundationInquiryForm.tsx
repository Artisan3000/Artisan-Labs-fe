"use client";

import { useState, type FormEvent } from "react";
import styles from "./FoundationInquiryForm.module.css";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function FoundationInquiryForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          organization: formData.get("organization"),
          email: formData.get("email"),
          subject: "Foundation school inquiry",
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Message failed to send.");

      form.reset();
      setStatus("success");
      setMessage("Thanks. Your inquiry has been sent.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Message failed to send. Please try again."
      );
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.hiddenField}>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className={styles.row}>
        <label>
          Name
          <input type="text" name="name" autoComplete="name" required />
        </label>
        <label>
          School / Organization
          <input type="text" name="organization" autoComplete="organization" required />
        </label>
      </div>

      <label>
        Email
        <input type="email" name="email" autoComplete="email" required />
      </label>

      <label>
        Message / inquiry
        <textarea name="message" rows={6} required />
      </label>

      <div className={styles.actions}>
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send inquiry"}
        </button>
        {message && (
          <p className={status === "success" ? styles.success : styles.error} role="status">
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
